import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Search } from 'lucide-react';
import { ROLE_THEMES } from '../component/dashboard/rolesConfig';
import Sidebar from '../component/Sidebar/Sidebar';
import ContentRenderer from '../component/dashboard/ContentRenderer';

// Redux Imports
import { RootState } from '../redux/store';
import { logout } from '../redux/slices/authSlice';

// 1. Extend your Props interface to include Redux actions and state
interface DashboardProps {
  userRole: 'vendeur' | 'acheteur' | 'prestataire';
  userData: any;
  isAuthenticated: boolean;
  onLogout: () => void; // From Dispatch
}

const Dashboard: React.FC<DashboardProps> = ({ 
  userRole, 
  userData, 
  isAuthenticated, 
  onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const config = ROLE_THEMES[userRole] || ROLE_THEMES.vendeur;

  // Security check: if not authenticated, you could redirect here
  if (!isAuthenticated) return <div>Access Denied. Please Login.</div>;

  return (
    <div className="d-flex w-100 bg-white min-vh-100">
      <Sidebar 
        config={config} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} // Calling the Redux Action prop
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

// 2. Map the Centralized State to Component Props
const mapStateToProps = (state: RootState) => ({
  // We pull from the 'profile' and 'auth' slices we created earlier
  userRole: state.user.role,
  userData: state.user.userInfo, // This contains seller/buyer/provider objects
  isAuthenticated: state.auth.isAuthenticated
});

// 3. Map the Logout Action to Props
const mapDispatchToProps = {
  onLogout: logout
};

// 4. Wrap the component with connect
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);