import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import Layout from "./component/Layout";
import BlankLayout from "./component/BlankLayout";
import ProtectedRoute from "./component/ProtectedRoute";

import Home1 from "./pages/Home1";
import SignIn from "./pages/SignIn";
import RegistrationPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import About from "./pages/About";
import Services from "./pages/Services";
import { ContactPage } from "./pages/ContactPage";
import { setAuthFailed, setCredentials } from "./redux/slices/authSlice";
import api from "./config/api";
import { loginSuccess } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, setIsAuthenticated } = useSelector((state: any) => state.auth);

  const verifyUserSession = useCallback(async () => {
    try {
      const response = await api.get("/auth/me");
      console.log(response.data.user)
      if (response.data.user) {
        dispatch(setCredentials(response.data.user));
            dispatch(loginSuccess(response.data.user));
        
      } else {
        dispatch(setAuthFailed());
      }
    } catch (error) {
      dispatch(setAuthFailed());
    }
  }, [dispatch]);

  useEffect(() => {
    verifyUserSession();
  }, [verifyUserSession]);

  

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home1 />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Auth Pages: Redirect to dashboard ONLY if they try to access /login while logged in */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegistrationPage /> : <Navigate to="/dashboard" replace />} 
          />
        </Route>

        {/* PROTECTED ROUTES */}
        <Route element={<BlankLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;