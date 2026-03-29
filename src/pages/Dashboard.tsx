import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ROLE_THEMES } from '../component/dashboard/rolesConfig';
import Sidebar from '../component/Sidebar/Sidebar';
import ContentRenderer from '../component/dashboard/ContentRenderer';

import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

// 1. Updated Interface: userRole must accept 'null' to match Redux state
interface DashboardProps {
  userRole: 'vendeur' | 'acheteur' | 'prestataire' | null;
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
  const navigate = useNavigate();

  // 2. Security/Safety Guard
  // If the user is not authenticated or role is null, redirect them.
  // This satisfies TypeScript because code after this block knows userRole is NOT null.
  if (!isAuthenticated || !userRole) {
    console.log("isAuthenticated userRole",isAuthenticated,userRole)
    return <Navigate to="/" replace />;
  }

  // 3. Configuration lookup
  // Since we handled the null case above, TypeScript knows userRole is valid here.
  const config = ROLE_THEMES[userRole] || ROLE_THEMES.vendeur;

  const handleLogout = () => {
    onLogout();
    navigate('/');
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
            role={userRole} 
            color={config.primaryColor} 
            userData={userData}
          />
        </main>
      </div>
    </div>
  );
};

// 4. Mapping Redux State
const mapStateToProps = (state: RootState) => ({
  userRole: state.user.role, 
  userData: state.user.userInfo,
  isAuthenticated: state.auth.isAuthenticated
});

const mapDispatchToProps = {
  onLogout: logout
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);