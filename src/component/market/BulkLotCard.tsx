import React from "react";
import { Droplet, ChevronRight, Anchor, Globe } from "lucide-react";

interface BulkLotCardProps {
  item: any; // Correspond au schéma Product
  onClick: () => void;
}

const BulkLotCard: React.FC<BulkLotCardProps> = ({ item, onClick }) => {
  // Détermination de la couleur selon la classification
  const isExtraVierge = item.physicoChimique?.classification === "Vierge Extra";
  const statusColor = isExtraVierge ? "#88c057" : "#f1c40f"; // Vert pour Extra, Jaune pour Vierge

  return (
    <div onClick={onClick} className="oil-card-link" style={{ cursor: "pointer" }}>
      <div className="oil-lot-card shadow-sm border-light">
        
        {/* INDICATEUR VISUEL GAUCHE */}
        <div className="oil-card-left">
          <div className="oil-drop-circle" style={{ borderColor: statusColor }}>
            <Droplet 
              size={20} 
              fill={statusColor} 
              strokeWidth={1.5} 
              style={{ color: statusColor }} 
            />
          </div>
        </div>

        {/* CORPS DE LA CARTE : DÉTAILS TECHNIQUES */}
        <div className="oil-card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h4 className="oil-type" style={{ color: statusColor, fontWeight: 'bold', fontSize: '0.8rem' }}>
                {item.physicoChimique?.classification?.toUpperCase()}
              </h4>
              <h3 className="oil-quantity" style={{ color: "#000", fontFamily: 'serif' }}>
                {Number(item.logistique?.totalQuantity).toLocaleString("fr-FR")} L.
              </h3>
            </div>
            {/* BADGE PRIX */}
            <div className="text-end">
                <span style={{ fontSize: '0.6rem', color: '#999', display: 'block' }}>PRIX INDICATIF</span>
                <span className="fw-bold text-dark">{item.logistique?.price} €/L</span>
            </div>
          </div>

          <div className="oil-specs-grid mt-2">
            <div className="oil-info-row">
              <span className="label">Variété:</span>
              <span className="value fw-bold">{item.physicoChimique?.variety}</span>
            </div>
            
            <div className="oil-info-row">
              <span className="label">Acidité:</span>
              <span className="value">{item.physicoChimique?.aciditeLibre}%</span>
            </div>

            <div className="oil-info-row d-flex align-items-center gap-2">
              <span className="label">Origine:</span>
              <span className="value d-flex align-items-center gap-1">
                Tunisie 🇹🇳
              </span>
            </div>

            <div className="oil-info-row d-flex align-items-center gap-2">
              <span className="label">Logistique:</span>
              <span className="value text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                <Anchor size={12} className="me-1" />
                {item.logistique?.incoterm} • {item.logistique?.port}
              </span>
            </div>
          </div>
        </div>

        {/* ACTION DROITE */}
        <div className="oil-card-right">
          <ChevronRight size={20} strokeWidth={2} color="#ccc" />
        </div>
      </div>

      <style>{`
        .oil-lot-card {
          display: flex;
          background: #fff;
          padding: 20px;
          border: 1px solid #f2f2f2;
          margin-bottom: 15px;
          transition: all 0.2s ease;
          align-items: center;
        }
        .oil-lot-card:hover {
          border-color: #000;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05) !important;
        }
        .oil-card-left {
          margin-right: 20px;
        }
        .oil-drop-circle {
          width: 45px;
          height: 45px;
          border: 2px solid;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .oil-card-body {
          flex-grow: 1;
        }
        .oil-quantity {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 300;
        }
        .oil-type {
          margin-bottom: 2px;
          letter-spacing: 1px;
        }
        .oil-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px 20px;
          border-top: 1px solid #f9f9f9;
          padding-top: 10px;
        }
        .oil-info-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
        }
        .oil-info-row .label {
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .oil-info-row .value {
          color: #333;
        }
        .oil-card-right {
          padding-left: 20px;
        }
      `}</style>
    </div>
  );
};

export default BulkLotCard;