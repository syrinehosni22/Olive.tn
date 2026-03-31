import React from "react";
import ProfileView from "../ProfileView/ProfileView";
import { UserRole, UserData } from "./user";
import InventoryView from "../InventoryView/InventoryView";
import Market from "../market/Market";
import { AddressBook } from "../adressBook/AddressBook";

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
      return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4" style={{ color }}>Messagerie</h2>
          {selectedContact ? (
            <div className="flex flex-col space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <p className="text-xs uppercase tracking-wider text-emerald-600 font-bold">Discussion avec</p>
                <p className="text-lg font-semibold text-emerald-900">{selectedContact.name}</p>
                <p className="text-sm text-emerald-700">{selectedContact.email}</p>
              </div>
              {/* Le composant de chat réel irait ici */}
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
                <p className="text-gray-400">Interface de message pour {selectedContact.name}...</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 italic">Sélectionnez un contact dans l'Address Book pour démarrer une conversation.</p>
              <button 
                onClick={() => setTab("addressBook")}
                className="mt-4 text-emerald-700 font-semibold underline"
              >
                Aller à l'Address Book
              </button>
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="flex items-center justify-center h-full text-muted">
          Sélectionnez une option dans le menu latéral.
        </div>
      );
  }
};

export default ContentRenderer;