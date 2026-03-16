import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Search } from 'lucide-react';
import { ROLE_THEMES } from './rolesConfig';

const Dashboard = ({ userRole = 'vendeur' }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const config = ROLE_THEMES[userRole] || ROLE_THEMES.vendeur;

  return (
    <div className="d-flex w-100 bg-white min-vh-100">
      <Sidebar 
        config={config} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="flex-grow-1 p-5">
        {/* Barre de Recherche Pilule */}
        <div className="mb-5 position-relative" style={{ maxWidth: '450px' }}>
          <Search className="position-absolute top-50 translate-middle-y ms-3 text-muted" size={20} />
          <input 
            type="text"
            className="form-control rounded-pill border-0 shadow-sm ps-5 py-2"
            placeholder="Rechercher..."
            style={{ backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
          />
        </div>

        {/* Zone de contenu dynamique */}
        <main className="mt-4">
          <ContentRenderer tab={activeTab} role={userRole} color={config.primaryColor} />
        </main>
      </div>
    </div>
  );
};

// Séparateur de contenu (Render Props)
const ContentRenderer = ({ tab, role, color }) => {
  switch (tab) {
    case 'profile':
      return <h2 style={{ fontFamily: 'serif', fontWeight: '300' }}>Mon Profil <small className="text-muted fs-6">({role})</small></h2>;
    case 'inventory':
      return <h2 style={{ fontFamily: 'serif', fontWeight: '300' }}>Gestion du Stock</h2>;
    default:
      return <div className="text-muted">Sélectionnez une option dans le menu.</div>;
  }
};

export default Dashboard;