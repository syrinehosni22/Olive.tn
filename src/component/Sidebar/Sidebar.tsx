import React, { Dispatch, SetStateAction } from 'react';
import { LucideIcon, LogOut } from 'lucide-react';

interface MenuItem {
  id: string; // Changed to string to match your Dashboard state
  icon: LucideIcon;
}

interface SidebarConfig {
  title: string;
  primaryColor: string;
  menu: MenuItem[];
}

interface SidebarProps {
  config: SidebarConfig;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>; // Fixes the TS(7031) and assignment error
  onLogout: () => void; // Made mandatory to ensure you don't forget it
}

const Sidebar: React.FC<SidebarProps> = ({ config, activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="d-flex flex-column align-items-center py-4 px-2"
      style={{ 
        width: '120px', 
        backgroundColor: config.primaryColor, 
        height: '100vh',
        position: 'sticky',
        top: 0
      }}>
      
      <div className="mb-5 text-center">
        <span className="fw-bold text-white text-uppercase" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
          {config.title}
        </span>
      </div>

      <div className="d-flex flex-column gap-4 flex-grow-1">
        {config.menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className="btn p-0 d-flex align-items-center justify-content-center shadow-none"
            style={{
              width: '55px',
              height: '55px',
              borderRadius: '50%',
              backgroundColor: activeTab === item.id ? '#0F141E' : 'white',
              color: activeTab === item.id ? 'white' : '#A0A0A0',
              transition: 'all 0.3s ease',
              border: 'none'
            }}
          >
            <item.icon size={26} strokeWidth={1.5} />
          </button>
        ))}
      </div>

      {/* Logout Button Section */}
      <div className="mt-auto mb-2">
        <button
          onClick={onLogout} // Calling the passed logic
          className="btn p-0 d-flex align-items-center justify-content-center shadow-none logout-btn"
          style={{
            width: '55px',
            height: '55px',
            borderRadius: '50%',
            backgroundColor: 'white',
            color: '#FF4D4D',
            border: 'none',
            transition: 'transform 0.2s'
          }}
        >
          <LogOut size={26} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;