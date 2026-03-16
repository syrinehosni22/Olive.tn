import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./component/Layout";
import BlankLayout from "./component/BlankLayout"; // Import the new one
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
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'vendeur'; 

  return (
    <Router>
      <Routes>
        
        {/* --- GROUP 1: PAGES WITH HEADER & FOOTER --- */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home1 />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactPage />} />
            {/* Auth Pages */}
          <Route 
            path="/login" 
            element={!isAuthenticated ? <SignIn /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/register" 
            element={!isAuthenticated ? <RegistrationPage /> : <Navigate to="/dashboard" />} 
          />
        </Route>

        {/* --- GROUP 2: PAGES WITHOUT HEADER & FOOTER --- */}
        <Route element={<BlankLayout />}>
          
        

          {/* Protected Dashboard */}
          <Route element={<ProtectedRoute />}>
            <Route 
              path="/dashboard" 
              element={<Dashboard userRole={userRole} />} 
            />
          </Route>

        </Route>

        {/* Error Page (Usually no Header/Footer) */}
        <Route path="*" element={<ErrorPage />} />
        
      </Routes>
    </Router>
  );
}

export default App;