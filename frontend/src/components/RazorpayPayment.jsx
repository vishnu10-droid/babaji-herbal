import { useCallback, useRef, useState } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptPromise = null;
function loadRazorpayScript() {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve(true);
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Opens official Razorpay Checkout. Returns via callbacks only —
 * payment is NOT trusted until backend /payment/verify succeeds.
 */
export function useRazorpayCheckout() {
  const [opening, setOpening] = useState(false);
  const rzpRef = useRef(null);

  const openCheckout = useCallback(
    async ({ keyId, razorpayOrderId, amountPaise, orderId, customer, onSuccess, onFailure, onDismiss }) => {
      setOpening(true);
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded || !window.Razorpay) {
          onFailure?.(new Error("Could not load Razorpay Checkout. Check your connection and retry."));
          return;
        }
        const key = keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!key) {
          onFailure?.(new Error("Razorpay Key ID is not configured (VITE_RAZORPAY_KEY_ID)."));
          return;
        }

        rzpRef.current?.close?.();
        const rzp = new window.Razorpay({
          key,
          amount: amountPaise,
          currency: "INR",
          name: "Babaji Herbal",
          description: "Order payment",
          order_id: razorpayOrderId,
          prefill: {
            name: customer?.name || "",
            contact: customer?.contact || "",
            email: customer?.email || "",
          },
          notes: { mongoOrderId: orderId },
          theme: { color: "#0B6B3A" },
          handler(response) {
            // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
            onSuccess?.(response);
          },
          modal: {
            ondismiss() {
              onDismiss?.();
            },
          },
        });
        rzp.on("payment.failed", (resp) => {
          onFailure?.(new Error(resp?.error?.description || "Payment failed. Please try again."));
        });
        rzpRef.current = rzp;
        rzp.open();
      } finally {
        setOpening(false);
      }
    },
    [],
  );

  return { openCheckout, opening };
}
