import React, { useState } from "react";
import { RoleType } from "../component/Register/types";
import { RoleSelector } from "../component/Register/RoleSelector";
import PricingSection from "../component/Register/PricingSection";
import SubscriptionForm from "../component/Register/Subscription";

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<RoleType>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null); // Stocke le plan choisi

  return (
    <div className="registration-flow">
      {/* ÉTAPE 1 : Sélection du rôle */}
      {!role && (
        <RoleSelector onSelect={(selected) => setRole(selected)} />
      )}

      {/* ÉTAPE 2 : Choix du Plan (Apparaît après le rôle) */}
      {role && !selectedPlan && (
        <div className="animate-slide-up">
          <PricingSection 
            role={role} 
            onBack={() => setRole(null)} 
            onSelectPlan={(plan) => setSelectedPlan(plan)} // Callback à ajouter dans PricingSection
          />
        </div>
      )}

      {/* ÉTAPE 3 : Formulaire final & Paiement */}
      {role && selectedPlan && (
        <div className="animate-slide-up">
          <SubscriptionForm 
            role={role} 
            plan={selectedPlan} 
            onBack={() => setSelectedPlan(null)} 
          />
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