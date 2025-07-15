import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    if (!decoded.email || Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem("token");
      return <Navigate to="/" />;
    }
  } catch (error) {
    localStorage.removeItem("token");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
