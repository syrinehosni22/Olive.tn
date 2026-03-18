import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  // Helper function to check auth dynamically
  const checkAuth = () => !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'vendeur'; 

  return (
    <Router>
      <Routes>
        
        {/* --- GROUP 1: PUBLIC PAGES WITH HEADER & FOOTER --- */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home1 />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Auth Pages: Redirect to dashboard if already logged in */}
          <Route 
            path="/login" 
            element={!checkAuth() ? <SignIn /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/register" 
            element={!checkAuth() ? <RegistrationPage /> : <Navigate to="/dashboard" replace />} 
          />
        </Route>

        {/* --- GROUP 2: DASHBOARD / PRIVATE (BLANK LAYOUT) --- */}
        <Route element={<BlankLayout />}>
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/dashboard" 
              element={<Dashboard />} 
            />
          </Route>
        </Route>

        {/* Error Page */}
        <Route path="*" element={<ErrorPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;