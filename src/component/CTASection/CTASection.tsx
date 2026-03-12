import React from "react";
import { Link } from "react-router-dom";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";

const CTASection: React.FC = () => {
  return (
    <section className="cta-section py-5 bg-white">
      <div className="container">
        <div className="row justify-content-center text-center">
          <div className="col-lg-8">
            <DivAnimateYAxis>
              {/* Texte principal */}
              <h2 className="cta-title fw-bold mb-4">
                Prêt à acheter et vendre au meilleur prix ?
              </h2>

              {/* Bouton stylisé avec bordures arrondies */}
              <div className="cta-button-wrapper">
                <Link to="/register" className="btn btn-outline-dark btn-inscription-rounded">
                  S'inscrire
                </Link>
              </div>
            </DivAnimateYAxis>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;