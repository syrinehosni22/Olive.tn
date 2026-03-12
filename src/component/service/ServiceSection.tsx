"use client";
import { serviceData } from "../../data/Data";
import { useRef, useState } from "react";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";
import { Link } from "react-router-dom";

const ServiceSection = () => {
  const serviceRef = useRef<HTMLDivElement>(null);
  const [activeItemId, setActiveItemId] = useState<number>(1); // Default active item ID
  const handleMouseEnter = (id: number) => {
    setActiveItemId(id);
  };

  const handleMouseLeave = () => {
    // Do nothing or add additional logic if needed when mouse leaves
  };
  return (
    <section className="rv-20-service_section">
      <div className="container">
        <div className="row">
          
              <div className="align-center">
                <h2 className="section-title">
                  Faites Découvir L’huile Tunisienne au Reste du Monde
                </h2>
                <p>
                  Olive constitue la clé pour établir de nouvelles relations et
                  accéder à de nouveaux marchés.
                </p>
                <img src="assets/img/olive-map-exchange.png" alt="image" />
              </div>
            </div>
      </div>

      <span className="service-sh-1">
        <img src="assets/img/services/home-6-service-4.png" alt="image" />
      </span>
      <span className="service-sh-2">
        <img src="assets/img/services/home-6-service-5.png" alt="image" />
      </span>
    </section>
  );
};

export default ServiceSection;
