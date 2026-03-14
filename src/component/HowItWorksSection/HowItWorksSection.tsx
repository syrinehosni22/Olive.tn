import React from "react";
import { Link } from "react-router-dom";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";

// Interface pour les étapes
interface StepData {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const howItWorksData: StepData[] = [
  {
    id: 1,
    title: "1. Publiez votre offre ou demande",
    description:
      "Soumettez votre offre ou demande d'huile d'olive en indiquant les caractéristiques et le prix.",
    icon: "/assets/img/icons/marketing-icon.png",
  },
  {
    id: 2,
    title: "2. Négociez le prix",
    description:
      "Recevez et envoyez des offres pour la quantité et le prix que vous souhaitez.",
    icon: "/assets/img/icons/communication-icon.png",
  },
  {
    id: 3,
    title: "3. Faites la transaction",
    description:
      "Une fois que les deux parties sont d'accord, vous pouvez accepter l'offre et finaliser la vente.",
    icon: "/assets/img/icons/support-icon.png",
  },
];

const HowItWorksSection: React.FC = () => {
  return (
    <section className="how-it-works-section py-5 bg-white">
      <div className="container">
        {/* Header de la section */}
        <div className="row mb-5 text-center">
          <div className="col-12">
            <h2 className="section-title-how space-5">Comment ça marche ?</h2>
          </div>
        </div>

        <div className="row align-items-center">
          {/* Côté Gauche: Mockup Laptop */}
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="laptop-mockup-wrapper text-center">
              <img
                src="/assets/img/laptop-container.png"
                alt="Plateforme Olive"
                className="img-fluid"
              />
            </div>
          </div>

          {/* Côté Droit: Les Étapes */}
          <div className="col-lg-6">
            <DivAnimateYAxis className="steps-container-wrapper">
              {howItWorksData.map((item) => (
                <div className="step-card-horizontal mb-5" key={item.id}>
                  <div className="d-flex align-items-start">
                    {/* Icône dans cercle noir */}
                    <div className="step-icon-circle me-4">
                      <img
                        src={item.icon}
                        alt="icon"
                        className="img-fluid"
                      />
                    </div>

                    {/* Texte et Bouton */}
                    <div className="step-body-content">
                      <h4 className="step-title-text fw-bold">{item.title}</h4>
                      <p className="step-desc-text text-muted">
                        {item.description}
                      </p>
                      <Link to="/contact" className="btn-voir-plus-step">
                        Voir Plus
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </DivAnimateYAxis>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
