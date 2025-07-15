import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { login } from "../state/action/login";
import ProtectedRoute from "../src/components/ProtectectedRoute";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UsersDashboardView from "./pages/DashBoardView/Users";
import DashboardHomeView from "./pages/DashBoardView/DashboardHome";
import UserProfileView from "./pages/DashBoardView/UserProfile";
import HomePage from "./pages/HomePage";
import CreatePassword from "./pages/CreatePassword";
import NotFoundPage from "./pages/NotFoundPage";
import AdminProtectectedRoute from "./components/AdminProtectectedRoute";
import UnauthorizedPage from "./pages/UnauthorizedPage";


function App() {
  // scrnsht
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);

        if (storedToken) {
          const decoded = jwtDecode(storedToken);
          if (!decoded.email || Date.now() >= decoded.exp * 1000) {
            localStorage.removeItem("token");
            navigate("/");
          } else {
            dispatch(login());
            const currentPath = window.location.pathname;

            const protectedRoutes = [
              "/dashboard",
              
              "/users",
              "/profile",
              "/notifications",
              "/unauthorized",
             
            ];
            if (!protectedRoutes.includes(currentPath)) {
              navigate("/dashboard");
            }
          }
        } else {
          const publicRoutes = [
            "/signin",
            "/signup",
            "/forgot",
            "/resetpassword",
          ];
          const currentPath = window.location.pathname;
          if (!publicRoutes.includes(currentPath)) {
            navigate(currentPath);
          }
        }
      } catch (err) {
        console.log("Error decoding token:", err);
        navigate("/");
      }
    };

    checkToken();
  }, [dispatch, navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/resetpassword/:token" element={<ResetPassword />} />
      <Route path="/createpassword/:token" element={<CreatePassword />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route
        path="/users"
        element={
      
            <UsersDashboardView />
         
        }
      />
   
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardHomeView />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <UserProfileView />
          </ProtectedRoute>
        }
      />
    
    
  
    </Routes>
  );
}

export default App;
