import React from "react";

interface SummaryFeature {
  icon: string;
  label: string;
  desc: string;
}

interface PricingCardProps {
  title: string;
  features: SummaryFeature[];
  bgColor: string;
}

export const SummaryCard: React.FC<PricingCardProps> = ({ title, features, bgColor }) => {
  return (
    <div className="col-md-5">
      <div 
        className="rounded-5 p-5 d-flex flex-column h-100" 
        style={{ backgroundColor: bgColor, minHeight: "400px" }}
      >
        <h3 className="fw-bold mb-5 text-center">{title}</h3>
        <div className="text-start flex-grow-1">
          {features.map((item, idx) => (
            <div key={idx} className="mb-4 d-flex gap-3 align-items-start">
              <i className={`bi ${item.icon} fs-4`}></i>
              <p className="small">
                <b className="d-block">{item.label}</b>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        {/* Optional: Add a 'Select' or 'S'abonner' button here later */}
      </div>
    </div>
  );
};