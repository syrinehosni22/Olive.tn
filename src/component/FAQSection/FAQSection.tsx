import React from "react";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";

interface FAQItem {
  id: string;
  title: string;
  description: string;
}

const faqData: FAQItem[] = [
  {
    id: "01",
    title: "GAIN DE TEMPS",
    description: "Feedback is integral to our growth. We are dedicated to understanding your needs and providing you with the best products.",
  },
  {
    id: "02",
    title: "STRUCTURE",
    description: "This survey is comprised of multiple-choice questions. It will take a maximum of ten minutes to complete.",
  },
  {
    id: "03",
    title: "REMINDERS",
    description: "Please complete this within 72 hours. You are allowed to retake it anytime within that period. After that, you will get a confirmation of receipt from our team.",
  },
];

const FAQSection: React.FC = () => {
  return (
    <section className="faq-section py-5" style={{ backgroundColor: "#D1D1D1", minHeight: "100vh" }}>
      <div className="container">
        {/* Titre de la section */}
        <div className="row mb-4">
          <div className="col-lg-6">
            <h2 className="faq-main-title mb-3">Questions Fréquentes</h2>
            <hr className="faq-divider" />
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6">
            <DivAnimateYAxis>
              {faqData.map((item, index) => (
                <div key={index} className="faq-item-container py-4 border-bottom-dark">
                  <div className="d-flex align-items-start">
                    
                    {/* Numéro dans le cercle */}
                    <div className="faq-number-circle me-4">
                      <span>{item.id}</span>
                    </div>

                    {/* Contenu Texte */}
                    <div className="faq-content">
                      <h5 className="faq-item-title fw-bold text-uppercase mb-2">
                        {item.title}
                      </h5>
                      <p className="faq-item-text mb-0 text-secondary">
                        {item.description}
                      </p>
                    </div>

                  </div>
                </div>
              ))}
            </DivAnimateYAxis>
          </div>
          
          {/* Colonne de droite vide pour respecter le design de l'image */}
          <div className="col-lg-6"></div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;