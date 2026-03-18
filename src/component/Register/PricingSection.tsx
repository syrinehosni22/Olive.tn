import React from "react";
import { RoleType } from "./types";
import { DetailSection } from "./DetailSection";
import { ComparisonTable } from "./ComparisonTable";

// Import des données
import {
  COMPARISON_DATA,
  DETAILED_PLANS,
  SUMMARY_CARDS,
  ROLE_COLORS,
} from "./Data";

interface PricingProps {
  role: RoleType;
  onBack: () => void;
  // Ajout du callback pour notifier le parent du choix du plan
  onSelectPlan: (plan: { id: string; name: string; price: string }) => void;
}

const PricingSection: React.FC<PricingProps> = ({ role, onBack, onSelectPlan }) => {
  // Sécurité et récupération des données
  const currentSummary = role ? SUMMARY_CARDS[role] : null;
  const currentDetails = role ? DETAILED_PLANS[role] : null;
  const currentTable = role ? COMPARISON_DATA[role] : [];
  const colors = role ? ROLE_COLORS[role] : ROLE_COLORS.acheteur;

  if (!currentSummary || !currentDetails) return null;

  // Fonctions de sélection mises à jour pour utiliser le callback au lieu du router
  const handleSelectClassic = () => {
    onSelectPlan({ 
      id: "classic", 
      name: "CLASSIQUE", 
      price: "Gratuit" 
    });
  };

  const handleSelectPremium = () => {
    onSelectPlan({ 
      id: "premium", 
      name: "PREMIUM", 
      price: "49 DT / mois" 
    });
  };

  return (
    <div className="bg-white min-vh-100 pb-5 animate-fade-in">
      <div className="py-5">
        {/* HEADER & RETOUR */}
        <div className="container d-flex justify-content-between align-items-center mb-5">
          <button
            className="btn btn-outline-dark rounded-pill px-4 fw-bold"
            onClick={onBack}
          >
            ← Changer de profil
          </button>
          <div className="badge bg-light text-dark border p-2 px-3 rounded-pill text-capitalize">
            Profil : <strong>{role}</strong>
          </div>
        </div>

        <h2
          className="text-center fw-bold mb-5"
          style={{ fontFamily: "serif", fontSize: "2.8rem" }}
        >
          Nos formules Business
        </h2>

        {/* SUMMARY CARDS */}
        <div className="container space-5">
          <div className="row justify-content-center g-4 mb-5">
            {/* PLAN CLASSIQUE */}
            <div className="col-md-5">
              <div className="card pricing-card h-100 border-2 border-dark rounded-5 p-4 shadow-sm transition-hover">
                <div className="card-body">
                  <h3 className="fw-bold text-center">CLASSIQUE</h3>
                  <div className="display-5 my-3 fw-bold text-center">Gratuit</div>
                  <hr />
                  <div className="mt-4">
                    {currentSummary.classic.map((item, idx) => (
                      <div key={idx} className="d-flex gap-3 mb-3 align-items-center">
                        <div style={{ color: colors.selection }}>{item.icon}</div>
                        <div className="fw-bold">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-dark w-100 rounded-pill py-3 mt-4 fw-bold"
                    onClick={handleSelectClassic}
                  >
                    Choisir Classique
                  </button>
                </div>
              </div>
            </div>

            {/* PLAN PREMIUM */}
            <div className="col-md-5">
              <div className="card pricing-card h-100 border-2 border-dark rounded-5 p-4 bg-dark text-white shadow-lg transition-hover">
                <div className="card-body">
                  <div className="text-center">
                    <span className="badge bg-warning text-dark rounded-pill px-3 mb-2">RECOMMANDÉ</span>
                    <h3 className="fw-bold">PREMIUM</h3>
                    <div className="display-5 my-3 fw-bold">
                      49 DT <small className="fs-6">/ mois</small>
                    </div>
                  </div>
                  <hr className="border-secondary" />
                  <div className="mt-4">
                    {currentSummary.premium.map((item, idx) => (
                      <div key={idx} className="d-flex gap-3 mb-3 align-items-center">
                        <div className="text-warning">{item.icon}</div>
                        <div className="fw-bold">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-light w-100 rounded-pill py-3 mt-4 fw-bold"
                    onClick={handleSelectPremium}
                  >
                    Devenir Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTIONS DÉTAILLÉES */}
        <div className="mt-5">
          <DetailSection
            title={`Le plan ${role?.toUpperCase()} CLASSIQUE en détail`}
            items={currentDetails.classic}
            bgColor={colors.classique}
          />
          <DetailSection
            title={`Le plan ${role?.toUpperCase()} PREMIUM en détail`}
            items={currentDetails.premium}
            bgColor={colors.premium}
          />

          <div className="container mt-5">
            <h3 className="text-center fw-bold mb-4" style={{ fontFamily: "serif" }}>
              Comparatif des fonctionnalités
            </h3>
            <ComparisonTable data={currentTable} />
          </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .pricing-card { transition: transform 0.3s ease; }
        .pricing-card:hover { transform: translateY(-5px); }
      `}</style>
    </div>
  );
};

export default PricingSection;