import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { ROLE_THEMES } from './rolesConfig';
import { UserRole, UserData } from './user';
import ContentRenderer from './ContentRenderer';
import Sidebar from '../Sidebar/Sidebar';

interface DashboardProps {
  userRole?: UserRole;
  userData: UserData;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = 'vendeur', userData }) => {
  // État pour gérer l'onglet actif
  const [activeTab, setActiveTab] = useState<string>('profile');
  
  // Récupération de la configuration visuelle selon le rôle
  const config = ROLE_THEMES[userRole] || ROLE_THEMES.vendeur;

  /**
   * Logique de déconnexion
   * À adapter selon votre système d'authentification (Context, Redux, ou simple Redirect)
   */
  const handleLogout = () => {
    console.log("Utilisateur déconnecté");
    // Exemple : localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="d-flex w-100 bg-white min-vh-100">
      {/* Sidebar avec injection de la prop onLogout manquante */}
      <Sidebar 
        config={config} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
      />

      <div className="flex-grow-1 p-5">
        {/* Barre de Recherche Style Pilule */}
        <div className="mb-5 position-relative" style={{ maxWidth: '450px' }}>
          <Search 
            className="position-absolute top-50 translate-middle-y ms-3 text-muted" 
            size={20} 
          />
          <input 
            type="text"
            className="form-control rounded-pill border-0 shadow-sm ps-5 py-2"
            placeholder="Rechercher dans votre espace..."
            style={{ 
              backgroundColor: '#fff', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)' 
            }}
          />
        </div>

        {/* Zone de contenu dynamique */}
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

export default Dashboard;