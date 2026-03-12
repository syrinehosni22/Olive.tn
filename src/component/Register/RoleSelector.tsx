import React, { useState } from "react";

// Types
type RoleType = 'acheteur' | 'vendeur' | 'prestataire' | null;

// Composants SVG personnalisés pour correspondre au design exact
const Icons = {
  Acheteur: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <circle cx="19" cy="11" r="3" />
      <path d="M19 8v6" />
      <path d="M17 11h4" />
      <text x="17.5" y="12.5" fontSize="3" fontWeight="bold" fill="currentColor" stroke="none">$</text>
    </svg>
  ),
  Vendeur: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M16 5V3a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="3" y1="13" x2="21" y2="13" />
      <circle cx="12" cy="17" r="2" />
    </svg>
  ),
  Prestataire: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <polyline points="10 3 6 3 2 7 2 17 6 21 10 21" />
      <path d="M2 12h12" />
      <path d="M10 8l4 4-4 4" />
      <circle cx="18" cy="12" r="3" />
      <text x="17" y="13.5" fontSize="4" fontWeight="bold" fill="currentColor" stroke="none">$</text>
    </svg>
  )
};

const ROLES_INFO = {
  acheteur: {
    label: "Vous êtes Acheteur",
    desc: "Vous êtes à la recherche d’une huile d’olive tunisienne de bonne qualité ?",
    icon: <Icons.Acheteur />,
  },
  vendeur: {
    label: "Vous êtes Vendeur",
    desc: "Vous souhaitez vendre vos produits oléicoles sur le marché international ?",
    icon: <Icons.Vendeur />,
  },
  prestataire: {
    label: "Vous êtes Prestataire de Service",
    desc: "Vous proposez des services de transport, d'analyse ou de logistique ?",
    icon: <Icons.Prestataire />,
  },
};

export const RoleSelector = ({ onSelect }: { onSelect: (role: RoleType) => void }) => {
  const [selectedRole, setSelectedRole] = useState<RoleType>(null);

  return (
    <div className="min-vh-100 bg-white d-flex flex-column position-relative overflow-hidden">
      
      {/* CARTE EN ARRIÈRE-PLAN */}
      <div 
        className="position-absolute" 
        style={{ 
          bottom: '-5%', 
          right: '-5%', 
          width: '55%', 
          zIndex: 0,
          opacity: 0.1,
          pointerEvents: 'none'
        }}
      >
        <div className="position-relative">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" 
            alt="World Map" 
            className="w-100 h-auto"
          />
          <div 
            className="position-absolute" 
            style={{ top: '42%', left: '52%', transform: 'translate(-50%, -100%)' }}
          >
            <div className="d-flex flex-column align-items-center">
                <div className="bg-white p-1 rounded-circle shadow border border-light" style={{ width: '60px', height: '60px' }}>
                    <img src="https://flagcdn.com/tn.svg" alt="TN" className="rounded-circle w-100 h-100 object-fit-cover" />
                </div>
                <div style={{ width: '2px', height: '15px', background: '#ccc' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="container-fluid px-5 flex-grow-1 d-flex align-items-center position-relative" style={{ zIndex: 5 }}>
        <div className="row w-100 align-items-center">
          
          <div className="col-lg-6 ps-lg-5">
            <h2 className="mb-5 fw-bold" style={{ fontSize: "2.8rem", maxWidth: '550px' }}>
              Faites Découvrir L’huile Tunisienne au Reste du Monde
            </h2>

            <div className="d-flex flex-column gap-3 mb-5">
              {(Object.keys(ROLES_INFO) as Array<keyof typeof ROLES_INFO>).map((key) => (
                <div 
                  key={key}
                  onClick={() => setSelectedRole(key)}
                  className="d-flex align-items-center gap-3"
                  style={{ cursor: "pointer" }}
                >
                  <div 
                    className="rounded-circle border border-dark d-flex align-items-center justify-content-center bg-white" 
                    style={{ width: "65px", height: "65px" }}
                  >
                    {ROLES_INFO[key].icon}
                  </div>
                  <div 
                    className={`rounded-pill px-4 py-3 border border-dark fw-bold text-center transition-all`}
                    style={{ 
                        width: "280px", 
                        backgroundColor: selectedRole === key ? '#D9D9D9' : 'transparent',
                        fontSize: '1rem'
                    }}
                  >
                    {ROLES_INFO[key].label}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn btn-dark rounded-pill px-5 py-3 fw-bold fs-5"
              style={{ backgroundColor: 'black', minWidth: '220px' }}
              onClick={() => selectedRole && onSelect(selectedRole)}
            >
              S’abonner
            </button>
          </div>

          {/* DYNAMIC DESCRIPTION BOX */}
          <div className="col-lg-6 d-flex justify-content-center">
            {selectedRole && (
              <div 
                className="position-relative p-5 border border-dark rounded-4 text-center bg-white" 
                style={{ maxWidth: "400px", minHeight: "250px", display: 'flex', alignItems: 'center' }}
              >
                <div className="position-absolute top-0 start-50 translate-middle">
                   <div 
                    className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                    style={{ width: "80px", height: "80px", backgroundColor: "#5E6358", fontSize: '3rem', fontWeight: 'bold' }}
                   >
                      !
                   </div>
                </div>
                <p className="mt-3 fs-4 fw-medium">
                  {ROLES_INFO[selectedRole].desc}
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};