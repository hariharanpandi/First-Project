/**
 * Component for rendering protected routes.
 * Checks if the user is logged in by checking the presence of a token in local storage.
*/

import { Navigate, Outlet } from "react-router-dom";
import { getLocalStorage } from "../helper/LocalStorage";
import { getQueryParam } from "../helper/SearchParams";
const sso =  getQueryParam('sso');


const ProtectedRoute = () => {
    const isLoggedIn = Boolean(getLocalStorage('token'));
    if (!isLoggedIn && !sso) {
        return <Navigate to="/" />;
    }

    return <Outlet/>;
};

export default ProtectedRoute;