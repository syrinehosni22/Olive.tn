import React from "react";
// 1. Import the shared type from your types file
import { DetailItem } from "./types"; 

interface DetailSectionProps {
  title: string;
  items: DetailItem[]; 
  bgColor: string;
}

export const DetailSection: React.FC<DetailSectionProps> = ({ title, items, bgColor }) => {
  return (
    <div className="py-5" style={{ backgroundColor: bgColor }}>
      <div className="container">
        <h3 className="text-center fw-bold mb-5">{title}</h3>
        <div className="row g-4">
          {items.map((item, index) => (
            <div key={index} className="col-md-4">
              <div className="d-flex gap-3">
                <div className="fs-3">{item.icon}</div>
                <div>
                  <h5 className="fw-bold">{item.title}</h5>
                  {/* 2. Change 'desc' to 'description' to match your Data.ts */}
                  <p className="text-muted">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};