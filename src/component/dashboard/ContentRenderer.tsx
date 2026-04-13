import React from "react";
import ProfileView from "../ProfileView/ProfileView";
import { UserRole, UserData } from "./user";
import InventoryView from "../InventoryView/InventoryView";
import Market from "../market/Market";
import { AddressBook } from "../adressBook/AddressBook";
import MessengerPage from "../messenger/Messenger";
import PublishBuyRequest from "../PublishBuyRequest/PublishBuyRequest";
import MarketRequestsView from "../marketRequests/MarketRequestsView";
import ManageUsers from "../manageUsers/ManageUsers";

interface ContentRendererProps {
  tab: string;
  setTab: (tab: string) => void;
  role: UserRole;
  color: string;
  userData: UserData;
  selectedContact?: any;
  setSelectedContact: (contact: any) => void;
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
  const isAdmin = role === 'admin';

  // --- GESTIONNAIRE DE CONTACT (Centralisé pour Market/AddressBook) ---
  const handleInitiateContact = (contact: any, messageContext?: string) => {
    setSelectedContact({
      ...contact,
      initialMessage: messageContext,
    });
    setTab("messages");
  };

  // --- MOTEUR DE RENDU DES ONGLETS ---
  // On a supprimé toute la logique de polling axios ici
  const renderMainContent = () => {
    switch (tab) {
      case "profile":
        return <ProfileView />;

      case "inventory":
        return (
          <div className="d-flex flex-column h-100">
            {isAdmin && (
              <div className="bg-dark text-white px-4 py-2 small fw-bold text-uppercase tracking-wider">
                Mode Administration : Vue de tous les lots
              </div>
            )}
            <InventoryView />
          </div>
        );

      case "market":
        return <Market role={role} onContactSelect={handleInitiateContact} />;

      case "addressBook":
        return <AddressBook onContactSelect={handleInitiateContact} />;

      case "publishOffer":
        return <PublishBuyRequest />;

      case "marketRequests":
        return (
          <div className="d-flex flex-column h-100">
            {isAdmin && (
              <div className="bg-dark text-white px-4 py-2 small fw-bold text-uppercase tracking-wider">
                Mode Administration : Vue de tous les appels d'offres
              </div>
            )}
            <MarketRequestsView onContactSelect={handleInitiateContact} />
          </div>
        );

      case "manageUsers":
        return <ManageUsers />;

      case "messages":
        return (
          <MessengerPage
            selectedContact={selectedContact}
            setSelectedContact={setSelectedContact}
            setTab={setTab}
          />
        );

      case "orders":
      case "sales":
        return (
          <div className="container-fluid py-4">
            <h2 className="h4 fw-bold" style={{ color }}>
              {tab === "sales" ? "Ventes" : "Commandes"}
            </h2>
            <p className="text-muted">
              Historique et suivi de vos transactions.
            </p>
          </div>
        );

      default:
        return (
          <div className="d-flex align-items-center justify-content-center h-100 text-muted">
            <p>Sélectionnez une option dans le menu latéral.</p>
          </div>
        );
    }
  };

  return (
    <div className="w-100 h-100">
      {renderMainContent()}
    </div>
  );
};

export default ContentRenderer;