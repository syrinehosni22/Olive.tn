import React from "react";
import { Droplet, ChevronRight } from "lucide-react";

interface BulkLotCardProps {
  item: {
    totalQuantity: number;
    acidity: number;
    country: string;
  };
  onClick: () => void;
}

const BulkLotCard: React.FC<BulkLotCardProps> = ({ item, onClick }) => {
  return (
    <div onClick={onClick} className="oil-card-link" style={{ cursor: "pointer" }}>
      <div className="oil-lot-card">
        <div className="oil-card-left">
          {/* Always show the green droplet and circle */}
          <div className="oil-drop-circle green">
            <Droplet size={20} fill="#88c057" strokeWidth={1.5} style={{ color: "#88c057" }} />
          </div>
        </div>

        <div className="oil-card-body">
          {/* Always use the green color for the type and quantity */}
          <h4 className="oil-type green">
            Vierge extra
          </h4>
          <h3 className="oil-quantity green">
            {Number(item.totalQuantity).toLocaleString("fr-FR")} Kg.
          </h3>
          <div className="oil-info-row">
            <span className="label">Taux d'acidité:</span>
            <span className="value">{item.acidity}°</span>
          </div>
          <div className="oil-info-row">
            <span className="label">{item.country}</span>
            <span className="flag-icon">
              {item.country === "Tunisie" ? "🇹🇳" : "🇪🇸"}
            </span>
          </div>
        </div>

        <div className="oil-card-right">
          <ChevronRight size={20} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

export default BulkLotCard;