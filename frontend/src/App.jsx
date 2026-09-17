import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Blog from "./pages/Blog";
import BlogDetails from "./pages/BlogDetails";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import ReturnRefundPolicy from "./pages/ReturnRefundPolicy";
import PaymentPolicy from "./pages/PaymentPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import NotFound from "./pages/NotFound";
import Dashboard from "./dashboard/Dashboard";
import UserDashboard from "./dashboard/user/UserDashboard";
import Category from "./pages/Category";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import { useAuth } from "./context/auth-context";
import Contact from "./pages/Contact";
function ProtectedDashboard() {
  const { isAuthenticated, user } = useAuth();
  return isAuthenticated && user?.role === "admin" ? (
    <Dashboard />
  ) : (
    <Navigate to="/admin/login" replace />
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/category/:categoryId" element={<CategoryProducts />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog-details" element={<BlogDetails />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<About />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms-conditions" element={<Terms />} />
        <Route path="/return-refund-policy" element={<ReturnRefundPolicy />} />
        <Route path="/payment-policy" element={<PaymentPolicy />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/account" element={<UserDashboard />} />
        <Route path="/account/profile" element={<UserDashboard />} />
        <Route path="/account/orders" element={<UserDashboard />} />
        <Route path="/account/transactions" element={<UserDashboard />} />
        <Route path="/account/reviews" element={<UserDashboard />} />
        <Route path="/account/wishlist" element={<UserDashboard />} />
        <Route path="/account/settings" element={<UserDashboard />} />
      </Route>
      <Route path="/admin/*" element={<ProtectedDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
