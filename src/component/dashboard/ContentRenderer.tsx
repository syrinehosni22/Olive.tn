import React, { useState } from "react";
import ProfileView from "../ProfileView/ProfileView";
import { UserRole, UserData } from "./user";
import InventoryView from "../InventoryView/InventoryView";
import Market from "../market/Market";
import { AddressBook } from "../adressBook/AddressBook";
import MessengerPage from "../messenger/Messenger";

interface ContentRendererProps {
  tab: string;
  setTab: (tab: string) => void; // Pour changer d'onglet manuellement
  role: UserRole;
  color: string;
  userData: UserData;
  selectedContact?: any; // Le contact sélectionné via l'AddressBook
  setSelectedContact: (contact: any) => void; // Pour définir le contact avant redirection
}

const ContentRenderer: React.FC<ContentRendererProps> = ({
  tab,
  setTab,
  role,
  color,
  userData,
  selectedContact,
  setSelectedContact,
}) => {
  const [activeTab, setActiveTab] = useState<string>('messenger');

  // Fonction utilitaire pour rediriger vers un message spécifique
  const handleInitiateContact = (contact: any) => {
    setSelectedContact(contact);
    setTab("messages");
  };

  switch (tab) {
    case "profile":
      return (
        <ProfileView 
          // Permet au profil de rediriger vers le service client par défaut
        />
      );

    case "inventory":
      return <InventoryView />;

    case "market":
      return <Market role={role} />;

    case "addressBook":
      // On passe la fonction de redirection à l'AddressBook
      return <AddressBook onContactSelect={handleInitiateContact} />;
      
    case "orders":
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold" style={{ color }}>Commandes</h2>
          <p className="text-muted-foreground mt-2">Historique et suivi de vos transactions.</p>
        </div>
      );

    case "messages":
      return <MessengerPage 
            selectedContact={selectedContact} 
            setTab={setActiveTab} 
          />

    default:
      return (
        <div className="flex items-center justify-center h-full text-muted">
          Sélectionnez une option dans le menu latéral.
        </div>
      );
  }
};

export default ContentRenderer;