import { Link } from "react-router-dom";
import logo from "../assets/babaji-logo.jpg";

const PHONE_DISPLAY = "+91-9956866752";
const PHONE_TEL = "tel:+919956866752";
const WHATSAPP_URL = "https://wa.me/919956866752";
const FACEBOOK_URL = "https://www.facebook.com/babajiherbals";
const QR_DATA = encodeURIComponent("upi://pay?pa=9956866752@upi&pn=BABAJI HERBALS&cu=INR");
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${QR_DATA}`;

const aboutLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
];

const serviceLinks = [
  { label: "Terms & Conditions", to: "/terms" },
  { label: "Privacy", to: "/privacy-policy" },
  { label: "Return & Refund Policy", to: "/return-refund-policy" },
  { label: "Payment Policy", to: "/payment-policy" },
  { label: "Shipping Policy", to: "/shipping-policy" },
];

const userLinks = [
  { label: "Profile", to: "/account/profile" },
  { label: "My Orders", to: "/account/orders" },
  { label: "Transaction", to: "/account/transactions" },
  { label: "Review", to: "/account/reviews" },
];

function LinkColumn({ title, links }) {
  return (
    <div>
      <h4 className="text-white font-bold text-sm mb-2">{title}</h4>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to} className="text-gray-300 hover:text-white transition-colors text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#0B6B3A] text-gray-200 pt-12 pb-4 px-6 md:px-16 text-xs">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8 border-b border-green-800 pb-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-3 lg:col-span-1">
          <Link to="/" className="inline-block" aria-label="Babaji Herbals home">
            <img src={logo} alt="Babaji Herbals" className="h-10 w-10 rounded-full object-cover shadow ring-2 ring-white/30" />
          </Link>
          <p className="text-gray-300 mt-4 text-sm leading-relaxed">
            Your Single Destination For All Needs. For COD - Delivery charges 100 ₹ extra in advance
          </p>
          <p className="text-gray-300 mt-3 text-sm">
            Call Now :{" "}
            <a href={PHONE_TEL} className="text-white hover:text-amber-400 hover:underline">
              {PHONE_DISPLAY}
            </a>
          </p>
          <div className="mt-4 flex gap-2">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Babaji Herbals on Facebook"
              title="Facebook"
              className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-gray-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.2v3h2.5v7h2.8z" />
              </svg>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat with Babaji Herbals on WhatsApp"
              title="WhatsApp"
              className="w-7 h-7 bg-[#08522c] rounded-full flex items-center justify-center hover:bg-amber-400 hover:text-black transition text-gray-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3zm0 1.8a7.2 7.2 0 1 1-3.7 13.4l-.3-.2-2.8.7.7-2.7-.2-.3A7.2 7.2 0 0 1 12 4.8zm-3.2 3.4c-.2 0-.5 0-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.9 4.5 3.9 2.2.8 2.7.7 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2-1.9-.9c-.2-.1-.4-.1-.6.1l-.9 1c-.2.2-.3.2-.6.1a7.4 7.4 0 0 1-2.2-1.3 8.2 8.2 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5L9.6 8.2c-.2-.4-.4-.4-.8-.4z" />
              </svg>
            </a>
          </div>
        </div>

        <LinkColumn title="About" links={aboutLinks} />
        <LinkColumn title="Services" links={serviceLinks} />
        <LinkColumn title="For users" links={userLinks} />

        {/* QR / Payment */}
        <div className="col-span-2 md:col-span-1">
          <div className="border-l-2 border-amber-400/60 pl-4">
            <p className="text-sm font-medium tracking-wide text-white">BABAJI HERBALS</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="Pay via UPI and confirm on WhatsApp" title="Pay and confirm on WhatsApp">
              <img src={QR_URL} alt="Scan to pay Babaji Herbals via UPI" className="mt-2 h-36 w-36 rounded-lg border border-emerald-800 object-cover bg-white" loading="lazy" />
            </a>
          </div>
          <p className="mt-3 text-center text-xs leading-relaxed text-gray-300">
            Please pay and send screenshot on{" "}
            <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-semibold text-white hover:text-amber-400 hover:underline">
              9956866752
            </a>{" "}
            this number
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto bg-amber-400 text-gray-900 py-2.5 px-4 rounded-md flex flex-col md:flex-row justify-between items-center gap-2 font-medium">
        <p>Copyright © 2021-2022 <strong>BABAJI HERBALS</strong> All Rights Reserved. Provided by AYULIFE HEALTH SOLUTION &amp; Designed By{" "}
          <a href="https://www.zaibainfotech.com" target="_blank" rel="noreferrer" className="hover:underline">
            www.zaibainfotech.com
          </a>
        </p>
        <div className="flex gap-4 text-xs font-semibold">
          <Link to="/terms" className="hover:underline">Terms And Conditions</Link>
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
