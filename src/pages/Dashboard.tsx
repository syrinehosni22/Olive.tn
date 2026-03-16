import React, { useState } from "react";
import { Search } from "lucide-react";
import Sidebar from "../component/Sidebar/Sidebar";
import { ROLE_THEMES } from "../component/dashboard/rolesConfig";

// --- Sous-composant pour le rendu du contenu ---
const ContentRenderer: React.FC<{
  tab: string;
  role: string;
  color: string;
}> = ({ tab, role, color }) => {
  switch (tab) {
    case "profile":
      return (
        <section className="animate-fade-in">
          <h2 style={{ fontFamily: "serif", fontWeight: "300" }}>
            Mon Profil{" "}
            <small className="text-muted fs-6" style={{ color }}>
              ({role})
            </small>
          </h2>
          <hr
            style={{ borderColor: color, width: "50px", borderWidth: "2px" }}
          />
          {/* Ajoutez ici votre composant ProfileForm */}
        </section>
      );
    case "inventory":
      return (
        <h2 style={{ fontFamily: "serif", fontWeight: "300" }}>
          Gestion du Stock
        </h2>
      );
    case "market":
      return (
        <h2 style={{ fontFamily: "serif", fontWeight: "300" }}>
          Marché de l'Huile d'Olive
        </h2>
      );
    case "sales":
      return (
        <h2 style={{ fontFamily: "serif", fontWeight: "300" }}>
          Suivi des Ventes
        </h2>
      );
    default:
      return (
        <div className="text-muted">
          Sélectionnez une option dans le menu pour commencer.
        </div>
      );
  }
};

interface DashboardProps {
  userRole?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ userRole = "vendeur" }) => {
  const [activeTab, setActiveTab] = useState<string>("profile");

  // Sécurité si le rôle n'existe pas dans la config
  const config =
    ROLE_THEMES[userRole as keyof typeof ROLE_THEMES] || ROLE_THEMES.vendeur;
  // 1. Logic for Logout
  const handleLogout = () => {
    // Example: Clear session/token
    localStorage.removeItem("token");
    // Example: Redirect to login
    window.location.href = "/login";
  };
  return (
    <div className="d-flex w-100 bg-white min-vh-100">
      {/* Sidebar à gauche */}
      <Sidebar
        config={config}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout} // <--- Missing call added here
      />

      {/* Zone de contenu à droite */}
      <div className="flex-grow-1 p-4 p-md-5">
        {/* Barre de Recherche (Style Pilule) */}
        <header className="mb-5">
          <div className="position-relative" style={{ maxWidth: "450px" }}>
            <Search
              className="position-absolute top-50 translate-middle-y ms-3 text-muted"
              size={20}
            />
            <input
              type="text"
              className="form-control rounded-pill border-0 shadow-sm ps-5 py-2"
              placeholder="Rechercher dans votre espace..."
              style={{
                backgroundColor: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                fontSize: "0.9rem",
              }}
            />
          </div>
        </header>

        {/* Rendu Dynamique */}
        <main className="mt-4">
          <ContentRenderer
            tab={activeTab}
            role={userRole}
            color={config.primaryColor}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
