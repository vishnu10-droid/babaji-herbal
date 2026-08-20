import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminLoginRoute() {
  const { token, user } = useSelector((state) => state.auth);

  if (token && user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}