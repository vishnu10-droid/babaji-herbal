import Razorpay from "razorpay";

// Lazy getter: ES imports hoist, so constructing at module top-level can
// run before dotenv.config(). A getter guarantees env is read per-request.
export function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error(
      "Razorpay keys missing. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend env.",
    );
  }
  return new Razorpay({ key_id, key_secret });
}

// Kept for backward compat with old `import razorpay from ...` usage.
export default {
  get orders() {
    return getRazorpay().orders;
  },
};
