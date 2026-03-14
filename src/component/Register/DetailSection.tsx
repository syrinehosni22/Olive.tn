import React from "react";

export interface DetailItem {
  icon: React.ReactNode; // Changé de string à ReactNode
  title: string;
  desc: string;
}

interface DetailSectionProps {
  title: string;
  items: DetailItem[];
  bgColor: string;
}

export const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  items,
  bgColor,
}) => {
  return (
    <div className="rounded-0 extension-5" style={{ backgroundColor: bgColor }}>
      {/* Titre de section avec bordure épaisse en bas (Design exact) */}
      <div className="mb-5 container">
        <h2
          className="fw-bold pb-2 border-bottom border-dark border-4"
          style={{ fontFamily: "serif", width: "fit-content", fontSize: "1.8rem" }}
        >
          {title}
        </h2>
      </div>

      <div className="d-flex flex-column gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="d-flex align-items-center gap-4 mx-auto"
            style={{ maxWidth: "900px", width: "100%" }}
          >
            {/* Conteneur d'icône circulaire (Gris clair comme le design) */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{ 
                width: "70px", 
                height: "70px", 
                minWidth: "70px", 
                backgroundColor: "#D9D9D9", // Gris du design
                color: "#333" 
              }}
            >
              {/* On rend l'icône directement */}
              <div style={{ transform: "scale(1.2)" }}>{item.icon}</div>
            </div>

            {/* Contenu texte centré horizontalement par rapport à la section */}
            <div className="text-center flex-grow-1">
              <h5 className="fw-bold mb-1" style={{ fontSize: "1.15rem" }}>
                {item.title}
              </h5>
              <p className="mb-0 text-dark" style={{ lineHeight: "1.4", fontSize: "1.05rem" }}>
                {item.desc}
              </p>
            </div>
            
            {/* Spacer invisible à droite pour équilibrer le centrage du texte 
                car l'icône à gauche décale le centre visuel */}
            <div style={{ width: "70px" }} className="d-none d-md-block"></div>
          </div>
        ))}
      </div>
    </div>
  );
};