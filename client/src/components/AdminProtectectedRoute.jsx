import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const profile = useSelector((state) => state.Profile);


  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);

    if (!decoded.email || Date.now() >= decoded.exp * 1000) {
   
      localStorage.removeItem("token");
      return <Navigate to="/" />;
    }

    if (profile?.user?.role !== "Admin" && profile?.user?.department !== "IT") {
  
      return <Navigate to="/unauthorized" />;
    }
  } catch (error) {
  
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminProtectedRoute;
