import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function AdminRoute(){
     const {token,user} =useSelector(
        (state)=>state.auth,
     );
     if(!token || !user) {
         return <Navigate to="/login" replace/>
     }
     if(user.role!== "admin"){
        return <Navigate to ="/" replace/>
     }
     return <Outlet/>
}