// import React from 'react';
// import { BrowserRouter as Router, Route, redirect, Switch, useLocation } from 'react-router-dom';


// export const Guard = ({ children }) => {
//   const location = useLocation();

//   // Add any routes that need to be guarded
//   const guardedRoutes = ['/overview'];

//   // Check if the current route is a guarded route
//   const isRouteGuarded = guardedRoutes.includes(location.pathname);

//   // Redirect to home if the route is accessed directly
//   if (isRouteGuarded && !location.state?.from) {
//     return <redirect to="/" />;
//   }

//   return children;
// };
import React from 'react'

export const ProtectedGuard = () => {
  return (
    <div>ProtectedGuard</div>
  )
}
