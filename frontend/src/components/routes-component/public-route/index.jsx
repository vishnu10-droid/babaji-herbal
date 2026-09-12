import { Navigate } from "react-router-dom";
import { useAuth } from "../../../context/auth-context"

const PublicRoute = ({children}) =>{
    const {isAuthenticated, user} =useAuth();
    if (isAuthenticated) {
        return <Navigate to ={user?.role === "admin" ? "/admin" : "/account"} replace/>
    }
    return children
    
}
export default PublicRoute;
