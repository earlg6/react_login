import { useLocation, Navigate, Outlet } from "react-router-dom";


const RequireAuth = () => {

    const access_token = localStorage.getItem('access_token');
    const validTimeToken = (Date.now() < localStorage.getItem('expireTime'))
    const isLoggedIn = (!!access_token && validTimeToken);  


    const location = useLocation();
    
    
    
    return (
        isLoggedIn
            ? <Outlet/>
            : <Navigate to="/login" state={{from: location}} replace />
    );
}

export default RequireAuth;