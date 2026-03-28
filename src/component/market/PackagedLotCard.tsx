import React from "react";
import { ChevronRight } from "lucide-react";

interface PackagedLotCardProps {
  item: any;
  onClick: () => void;
}

const PackagedLotCard: React.FC<PackagedLotCardProps> = ({ item, onClick }) => {
  return (
    <div onClick={onClick} className="oil-card-link" style={{ cursor: "pointer" }}>
      <div className="oil-lot-card-horizontal">
        <div className="oil-card-img-wrapper">
          <img src={item.image} alt={item.type} className="oil-card-img" />
        </div>

        <div className="oil-card-content">
          <div className="oil-card-info">
            <h4 className="oil-type-label">{item.type}</h4>
            <div className="oil-units-count">
              {Number(item.units).toLocaleString("fr-FR")} unités
            </div>
            <div className="oil-specs">
              {item.container} - {item.volume}
            </div>
            <div className="oil-origin">
              <span>{item.country}</span>
              <span className="flag-icon">
                {item.country === "Tunisie" ? "🇹🇳" : "🇪🇸"}
              </span>
            </div>
          </div>

          <div className="oil-card-arrow">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackagedLotCard;