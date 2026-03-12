import React, { useState } from "react";
import { RoleType } from "../component/Register/types";
import { RoleSelector } from "../component/Register/RoleSelector";
import PricingSection from "../component/Register/PricingSection";

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<RoleType>(null);

  return (
    <div className="registration-flow">
      {/* ÉTAPE 1 : Sélection du rôle (Design Carte du Monde) */}
      {!role ? (
        <RoleSelector onSelect={(selected) => setRole(selected)} />
      ) : (
        /* ÉTAPE 2 : Détails des tarifs (Apparaît après le clic sur "S'abonner") */
        <div className="animate-slide-up">
          <PricingSection role={role} onBack={() => setRole(null)} />
        </div>
      )}

      <style>{`
        .animate-slide-up {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;