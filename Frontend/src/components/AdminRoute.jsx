import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute() {
  const {
    isAuthenticated,
    isAdmin,
  } = useAuth();


  // Not logged in → login page
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Logged in but not admin → home
  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  // Admin → allow the requested route
  return <Outlet />;
}

export default AdminRoute;