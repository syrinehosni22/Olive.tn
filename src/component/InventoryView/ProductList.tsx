import React from "react";
import { Edit2, Package, Calendar, Tag } from "lucide-react";

// 1. On définit l'interface pour que TypeScript sache ce qu'on attend
interface ProductListProps {
  products: any[];
  isLoading: boolean;
  onEdit: (product: any) => void;
  getStatusStyle: (status: string) => React.CSSProperties; // La fonction qui manquait
}

// 2. On récupère les props avec les accolades { }
const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  isLoading, 
  onEdit, 
  getStatusStyle 
}) => {
  
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-dark" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-5 border" style={{ backgroundColor: "#fcfcfc" }}>
        <Package size={40} className="text-muted mb-3 opacity-20" />
        <p style={{ fontSize: "0.8rem", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>
          Aucun lot trouvé dans l'inventaire
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle" style={{ borderCollapse: "separate", borderSpacing: "0 15px" }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>Détails du Lot</th>
            <th style={tableHeaderStyle}>Variété</th>
            <th style={tableHeaderStyle}>Quantité</th>
            <th style={tableHeaderStyle}>Statut</th>
            <th style={tableHeaderStyle} className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} style={{ backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}>
              <td className="py-4">
                <div className="d-flex align-items-center">
                  <div className="bg-light p-2 me-3">
                    <Package size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                      Lot #{product.traceability?.lotNumber || "N/A"}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#999" }}>
                      Campagne {product.traceability?.campagneOleicole}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <span style={{ fontSize: "0.85rem" }}>{product.physicoChimique?.variety || "Non spécifiée"}</span>
              </td>
              <td>
                <span style={{ fontWeight: "500" }}>{product.logistique?.totalQuantity} L</span>
              </td>
              <td>
                {/* L'APPEL À LA FONCTION QUI CAUSAIT L'ERREUR */}
                <span style={{ 
                  fontSize: "0.55rem", 
                  padding: "4px 10px", 
                  letterSpacing: "1px", 
                  fontWeight: "bold", 
                  textTransform: "uppercase",
                  border: "1px solid",
                  ...getStatusStyle(product.status) // Appel sécurisé ici
                }}>
                  {product.status || "Inconnu"}
                </span>
              </td>
              <td className="text-end">
                <button 
                  onClick={() => onEdit(product)}
                  className="btn btn-sm btn-outline-dark rounded-0 border-0"
                  style={{ fontSize: "0.7rem", fontWeight: "bold" }}
                >
                  <Edit2 size={14} className="me-1" /> MODIFIER
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle: React.CSSProperties = {
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "#999",
  fontWeight: "600",
  borderBottom: "none",
  paddingBottom: "15px"
};

export default ProductList;