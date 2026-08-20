import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectRoute(){
    const {token,user} =useSelector(
        (state) =>state.auth,
    );
    if (!token || !user) {
        return <Navigate to ="/login" replace />
    }
    return <Outlet/>;
}