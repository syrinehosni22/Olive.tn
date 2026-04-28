import React from "react";
import { ChevronRight, Package, anchor } from "lucide-react";
import { API_BASE_URL } from "../../config/api";

interface PackagedLotCardProps {
  item: any;
  onClick: () => void;
}

const PackagedLotCard: React.FC<PackagedLotCardProps> = ({ item, onClick }) => {
  // Gestion de l'URL de l'image (Base64 ou URL Backend)
  const imageUrl = item.logistique?.photoBouteille?.startsWith('data') 
    ? item.logistique.photoBouteille 
    : item.logistique?.photoBouteille 
      ? `${API_BASE_URL}${item.logistique.photoBouteille}`
      : null;

  return (
    <div onClick={onClick} className="oil-card-link" style={{ cursor: "pointer" }}>
      <div className="oil-lot-card-horizontal shadow-sm border">
        {/* WRAPPER IMAGE AVEC FALLBACK */}
        <div className="oil-card-img-wrapper bg-light d-flex align-items-center justify-content-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={item.physicoChimique?.variety} 
              className="oil-card-img" 
              style={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
          ) : (
            <Package size={30} className="text-muted opacity-25" />
          )}
        </div>

        <div className="oil-card-content">
          <div className="oil-card-info">
            {/* VARIÉTÉ & CLASSIFICATION */}
            <h4 className="oil-type-label" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
              {item.physicoChimique?.variety} 
              <span className="ms-2 fw-normal text-muted" style={{ fontSize: '0.7rem' }}>
                ({item.physicoChimique?.classification})
              </span>
            </h4>

            {/* QUANTITÉ TOTALE */}
            <div className="oil-units-count fw-bold text-dark">
              {Number(item.logistique?.totalQuantity).toLocaleString("fr-FR")} Litres
            </div>

            {/* PACKAGING DÉTAILLÉ */}
            <div className="oil-specs small text-muted">
              {item.logistique?.packagingType} • {item.logistique?.packagingDetail}
            </div>

            {/* ORIGINE & LOGISTIQUE */}
            <div className="oil-origin d-flex align-items-center gap-2 mt-1">
              <span className="small fw-bold">{item.logistique?.port || "Port Tunisie"}</span>
              <span className="flag-icon">🇹🇳</span>
              <span className="opacity-25">|</span>
              <span className="small text-muted">MOQ: {item.logistique?.minOrderQuantity || 0}L</span>
            </div>
          </div>

          <div className="oil-card-arrow">
            <div className="price-tag me-3 text-end">
                <div style={{ fontSize: '0.6rem', color: '#999' }}>PRIX INDICATIF</div>
                <div className="fw-bold text-success">{item.logistique?.price} €/L</div>
            </div>
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
      
      <style>{`
        .oil-lot-card-horizontal {
          display: flex;
          background: #fff;
          margin-bottom: 15px;
          transition: transform 0.2s ease;
          height: 120px;
        }
        .oil-lot-card-horizontal:hover {
          transform: translateX(5px);
          border-color: #000 !important;
        }
        .oil-card-img-wrapper {
          width: 120px;
          height: 120px;
          flex-shrink: 0;
          border-right: 1px solid #f2f2f2;
        }
        .oil-card-content {
          display: flex;
          flex-grow: 1;
          padding: 15px 20px;
          justify-content: space-between;
          align-items: center;
        }
        .oil-type-label {
          margin: 0;
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .oil-specs {
          margin: 2px 0;
          font-size: 0.75rem;
        }
        .oil-origin {
          font-size: 0.8rem;
        }
        .oil-card-arrow {
          display: flex;
          align-items: center;
          color: #ccc;
        }
      `}</style>
    </div>
  );
};

export default PackagedLotCard;