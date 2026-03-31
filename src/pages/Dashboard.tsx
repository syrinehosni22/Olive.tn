import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ROLE_THEMES } from '../component/dashboard/rolesConfig';
import Sidebar from '../component/Sidebar/Sidebar';
import ContentRenderer from '../component/dashboard/ContentRenderer';

import { RootState } from '../redux/store';
import { logout, logoutUser } from '../redux/slices/authSlice';

interface DashboardProps {
  userRole: 'vendeur' | 'acheteur' | 'prestataire' | undefined | null;
  userData: any;
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userRole, 
  userData, 
  isAuthenticated,
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  // NOUVEL ÉTAT : Pour stocker le contact sélectionné depuis l'AddressBook
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Security Guard
  if (!isAuthenticated || !userRole) {
    return <Navigate to="/" replace />;
  }

  // Configuration lookup
  const config = ROLE_THEMES[userRole] || ROLE_THEMES.vendeur;

  // Logout Handler
  const handleLogout = async () => {
    try {
      await onLogout(); 
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem('user_session'); 
      dispatch(logout()); 
      logoutUser(); 
      navigate('/', { replace: true });
    } catch (error) {
      console.error("Logout process failed:", error);
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <div className="d-flex w-100 bg-white min-vh-100">
      <Sidebar 
        config={config} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <div className="flex-grow-1 p-5">
        <div className="mb-5 position-relative" style={{ maxWidth: '450px' }}>
          <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
          <input 
            type="text"
            className="form-control rounded-pill border-0 shadow-sm ps-5 py-2"
            placeholder="Rechercher dans votre espace..."
            style={{ backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          />
        </div>

        <main className="mt-4">
          <ContentRenderer 
            tab={activeTab} 
            setTab={setActiveTab}           // Pour permettre le switch d'onglet
            role={userRole} 
            color={config.primaryColor} 
            userData={userData}
            selectedContact={selectedContact}   // On passe le contact actuel
            setSelectedContact={setSelectedContact} // Fonction pour définir le contact
          />
        </main>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  userRole: state.auth.user?.role, 
  userData: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = {
 onLogout: logoutUser
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);