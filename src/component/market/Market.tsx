import React, { useEffect, useState } from "react";
import BulkLotCard from "./BulkLotCard";
import PackagedLotCard from "./PackagedLotCard";
import LotDetailView from "./LotDetailView";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";
import axios from "axios";

// --- INTERFACE PRODUIT (Identique à ton Schéma Mongoose) ---
interface Product {
  _id: string;
  sellerId: string;
  status: string;
  createdAt: string;
  variety: string;
  classification: string;
  price: number;
  totalQuantity: number;
  packaging?: string;
  traceability: {
    campagneOleicole: string;
    lotNumber: string;
    methodeExtraction: string;
    typeRecolte: string;
  };
  physicoChimique: {
    variety: string;
    classification: string;
    aciditeLibre: number;
    absorbanceUV?: { k232: number; k270: number };
  };
  purete: {
    alkylEsters: string;
    ciresWaxes: string;
    erythrodiolUvaol: string;
    acideOleique: number;
  };
  logistique: {
    totalQuantity: number;
    price: number;
    packagingType: string; // "Vrac", "Bouteilles", etc.
  };
  certifications?: any[];
}

interface MarketProps {
  role: string;
  // Ajout de la prop pour gérer la sélection du contact globalement (Dashboard)
  onContactSelect?: (contact: any, message?: string) => void;
}

const Market: React.FC<MarketProps> = ({ role, onContactSelect }) => {
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Chargement des produits
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. Trouver le lot sélectionné
  const selectedLot = products.find((item) => item._id === selectedLotId);

  // Vue détaillée si un lot est sélectionné
  if (selectedLot) {
    return (
      <LotDetailView 
        lot={selectedLot} 
        onBack={() => setSelectedLotId(null)} 
        onContactSelect={onContactSelect} // On transmet la fonction de sélection de contact
      />
    );
  }

  // 3. Logique de filtrage par packagingType
  const bulkProducts = products.filter(
    (p) => p.logistique?.packagingType === "Vrac"
  );
  
  const packagedProducts = products.filter(
    (p) => 
      p.logistique?.packagingType === "Bouteilles" || 
      p.logistique?.packagingType === "Conditionnée" ||
      p.logistique?.packagingType === "Conditionné" ||
      p.logistique?.packagingType === "Semi Vrac"
  );

  return (
    <div className="market-page">
      <header className="bg-white p-4 border-bottom shadow-sm">
        <h1 className="h4 m-0 fw-bold text-uppercase" style={{ fontFamily: 'serif', letterSpacing: '1px' }}>
          MARCHÉ — ACCÈS {role}
        </h1>
      </header>

      <main className="container mt-5">
        {loading ? (
          <div className="d-flex justify-content-center my-5 py-5">
            <div className="spinner-border text-dark" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        ) : (
          <>
            {/* SECTION HUILE EN VRAC */}
            {bulkProducts.length > 0 && (
              <section className="mb-5">
                <h5 className="text-muted fw-bold mb-4 border-start border-4 border-success ps-3" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>
                  HUILE EN VRAC (TRADING)
                </h5>
                <DivAnimateYAxis className="row g-4">
                  {bulkProducts.map((item) => (
                    <div className="col-xl-3 col-lg-4 col-md-6" key={item._id}>
                      <BulkLotCard
                        item={item}
                        onClick={() => setSelectedLotId(item._id)}
                      />
                    </div>
                  ))}
                </DivAnimateYAxis>
              </section>
            )}

            {/* SECTION PRODUITS CONDITIONNÉS */}
            {packagedProducts.length > 0 && (
              <section className="mb-5">
                <h5 className="text-muted fw-bold mb-4 border-start border-4 border-primary ps-3" style={{ fontSize: '0.75rem', letterSpacing: '2px' }}>
                  PRODUITS CONDITIONNÉS / EXPORT
                </h5>
                <DivAnimateYAxis className="row g-3">
                  {packagedProducts.map((item) => (
                    <div className="col-xl-3 col-lg-4 col-md-6" key={item._id}>
                      <PackagedLotCard
                        item={item}
                        onClick={() => setSelectedLotId(item._id)}
                      />
                    </div>
                  ))}
                </DivAnimateYAxis>
              </section>
            )}

            {/* MESSAGE SI VIDE */}
            {products.length === 0 && (
              <div className="text-center py-5">
                <p className="mb-0 text-muted" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>
                  Aucun lot n'est disponible sur le marché de Tunis actuellement.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="py-5 text-center">
        <p style={{ fontSize: '0.6rem', color: '#ccc', letterSpacing: '3px' }}>
          ZYNEX SOLUTION — PLATEFORME OLIVE TN
        </p>
      </footer>
    </div>
  );
};

export default Market;