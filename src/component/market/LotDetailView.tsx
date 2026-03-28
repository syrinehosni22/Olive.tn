import React from "react";
import { ArrowLeft, Droplet, Package, Beaker, Globe } from "lucide-react";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";

interface LotDetailViewProps {
  lot: any;
  onBack: () => void;
}

const LotDetailView: React.FC<LotDetailViewProps> = ({ lot, onBack }) => {
  const isPackaged = "units" in lot;

  return (
    <div className="container mt-4 pb-5">
      <button 
        className="btn btn-link text-decoration-none mb-4 d-flex align-items-center gap-2 p-0 text-dark" 
        onClick={onBack}
      >
        <ArrowLeft size={20} /> Retour au Marché
      </button>

      <DivAnimateYAxis className="card border-0 shadow-sm p-4">
        <div className="row g-4">
          <div className="col-md-5">
            {isPackaged ? (
              <img src={lot.image} alt={lot.type} className="img-fluid rounded-3 shadow-sm w-100" />
            ) : (
              <div className="bg-light rounded-3 d-flex align-items-center justify-content-center" style={{ height: "350px" }}>
                <Droplet size={100} className="text-success opacity-25" />
              </div>
            )}
          </div>

          <div className="col-md-7">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h2 className="display-6 fw-bold mb-1">{lot.type}</h2>
                <p className="text-muted fs-5">{lot.country} {lot.country === "Tunisie" ? "🇹🇳" : "🇪🇸"}</p>
              </div>
              <span className="badge bg-success-soft text-success p-2 px-3 border border-success">Disponible</span>
            </div>

            <div className="mt-4">
              <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted d-flex align-items-center gap-2"><Package size={20}/> Quantité Totale</span>
                <span className="fw-bold fs-5">{isPackaged ? `${lot.units} Unités` : `${lot.quantityKg} Kg`}</span>
              </div>
              
              {"acidity" in lot && (
                <div className="p-3 bg-light rounded-3 d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted d-flex align-items-center gap-2"><Beaker size={20}/> Taux d'Acidité</span>
                  <span className="fw-bold text-success fs-5">{lot.acidity}°</span>
                </div>
              )}
            </div>

            <button className="btn btn-dark btn-lg w-100 mt-5 py-3 shadow">
              Négocier ce lot
            </button>
          </div>
        </div>
      </DivAnimateYAxis>
    </div>
  );
};

export default LotDetailView;