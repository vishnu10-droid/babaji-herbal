import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/auth-context";

// Customer-only pages: cart, wishlist and checkout.
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Keep the admin dashboard separate from the customer storefront.
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default PrivateRoute;
