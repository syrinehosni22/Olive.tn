import { Link } from "react-router-dom";
import { oilLotData } from "../../data/Data";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";
// Import the ready-made icon components
import { Droplet, ChevronRight } from "lucide-react";

const OliveOilLotsSection = () => {
  return (
    <section className="olive-lots-section">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="section-header">
              <h2 className="section-title">Lots d'huile d'olive en vrac</h2>
              <div className="title-underline"></div>
            </div>
          </div>
        </div>

        <DivAnimateYAxis className="row g-4">
          {oilLotData.slice(0, 8).map((item) => (
            <div className="col-xl-3 col-lg-4 col-md-6" key={item.id}>
              <Link to={`/lot/${item.id}`} className="oil-card-link">
                <div className="oil-lot-card">
                  {/* Left Icon Section */}
                  <div className="oil-card-left">
                    <div className={`oil-drop-circle ${item.type.toLowerCase().includes('premium') ? 'premium' : ''}`}>
                      {/* Using the Droplet component */}
                      <Droplet size={20} fill="currentColor" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Center Content Section */}
                  <div className="oil-card-body">
                    <h4 className={`oil-type ${item.type.toLowerCase().includes('premium') ? 'premium' : ''}`}>
                        {item.type}
                    </h4>
                    <h3 className="oil-quantity">
                      {Number(item.quantityKg).toLocaleString("fr-FR")} Kg.
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

                  {/* Right Arrow Section */}
                  <div className="oil-card-right">
                    {/* Using the ChevronRight component */}
                    <ChevronRight size={20} strokeWidth={2.5} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </DivAnimateYAxis>

        <div className="row mt-20">
            <div className="col-12 text-start">
                <button className="btn-voir-plus">Voir Plus</button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default OliveOilLotsSection;