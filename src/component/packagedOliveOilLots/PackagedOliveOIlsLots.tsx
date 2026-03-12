import { Link } from "react-router-dom";
import { oilLotData, packagedOilLotData } from "../../data/Data";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";

const PackagedOliveOIlsLotsSection = () => {
  return (
    <section className="olive-lots-section-packaged py-5">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <div className="section-header">
              {/* Updated Title to match image */}
              <h2 className="section-title-packaged-lot">Lots d'huile d'olive conditionnée</h2>
              <div className="title-underline-packaged-lot"></div>
            </div>
          </div>
        </div>

        <DivAnimateYAxis className="row g-3">
          {packagedOilLotData.slice(0, 8).map((item) => (
            <div className="col-xl-3 col-lg-4 col-md-6" key={item.id}>
              <Link to={`/lot/${item.id}`} className="oil-card-link">
                <div className="oil-lot-card-horizontal">
                  
                  {/* Left: Product Image */}
                  <div className="oil-card-img-wrapper">
                    <img src={item.image} alt={item.type} className="oil-card-img" />
                  </div>

                  {/* Right: Content */}
                  <div className="oil-card-content">
                    <div className="oil-card-info">
                      <h4 className="oil-type-label">{item.type}</h4>
                      <div className="oil-units-count">
                        {item.units ? Number(item.units).toLocaleString("fr-FR") : "0"} unités
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
                    
                    {/* Arrow Indicator */}
                    <div className="oil-card-arrow">
                      <i className="fas fa-chevron-right"></i>
                    </div>
                  </div>

                </div>
              </Link>
            </div>
          ))}
        </DivAnimateYAxis>

        <div className="row mt-4">
          <div className="col-12">
            <button className="btn-voir-plus-outline">Voir Plus</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagedOliveOIlsLotsSection;