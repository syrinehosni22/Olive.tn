import React from 'react';
// 1. Ensure ProfileView is imported correctly
import ProfileView from '../ProfileView/ProfileView'; 
import { UserRole, UserData } from './user';

interface ContentRendererProps {
  tab: string;
  role: UserRole;
  color: string;
  userData: UserData;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ tab, role, color, userData }) => {
  // Use the 'color' or 'role' props if needed to avoid "unused variable" warnings
  switch (tab) {
    case 'profile': 
      // This line will only stop erroring once ProfileView.tsx 
      // is updated to accept the userData prop.
      return <ProfileView userData={userData} />;
      
    case 'inventory': 
      return <div style={{ color }}>Inventaire</div>;
      
    case 'market': 
      return <div>Marché - Accès: {role}</div>;
      
    case 'orders': 
      return <div>Commandes</div>;
      
    case 'messages': 
      return <div>Messages</div>;
      
    default:
      return <div className="text-muted">Sélectionnez une option.</div>;
  }
};

export default ContentRenderer;