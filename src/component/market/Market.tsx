import React, { useEffect, useState } from "react";
import { oilLotData, packagedOilLotData } from "../../data/Data";
import BulkLotCard from "./BulkLotCard";
import PackagedLotCard from "./PackagedLotCard";
import LotDetailView from "./LotDetailView";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";
import axios from "axios";

const Market: React.FC<{ role: string }> = ({ role }) => {
  const [selectedLotId, setSelectedLotId] = useState<number | string | null>(
    null,
  );
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("all"); // 'all', 'bulk', ou 'packaged'

  const allLots = [...oilLotData, ...packagedOilLotData];
  const selectedLot = allLots.find((item) => item._id === selectedLotId);

  if (selectedLot) {
    return (
      <LotDetailView lot={selectedLot} onBack={() => setSelectedLotId(null)} />
    );
  }
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // On construit l'URL avec le filtre 'type' si nécessaire
        const url =
          activeType === "all"
            ? "http://localhost:5000/api/products"
            : `http://localhost:5000/api/products?type=${activeType}`;

        const response = await axios.get(url);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeType]); // Se recharge quand on change de catégorie
  return (
    <div className="market-page">
      <header className="bg-white p-4 border-bottom shadow-sm">
        <h1 className="h4 m-0 fw-bold">MARCHÉ — ACCÈS {role.toUpperCase()}</h1>
      </header>

      <main className="container mt-5">
        <section className="mb-5">
          <h5 className="text-muted fw-bold mb-4 border-start border-4 border-success ps-3">
            HUILE EN VRAC
          </h5>
          <DivAnimateYAxis className="row g-4">
            {products.map((item) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={item._id}>
                <BulkLotCard
                  item={item}
                  onClick={() => setSelectedLotId(item._id)}
                />
              </div>
            ))}
          </DivAnimateYAxis>
        </section>

        <section className="mb-5">
          <h5 className="text-muted fw-bold mb-4 border-start border-4 border-primary ps-3">
            PRODUITS CONDITIONNÉS
          </h5>
          <DivAnimateYAxis className="row g-3">
            {packagedOilLotData.map((item) => (
              <div className="col-xl-3 col-lg-4 col-md-6" key={item.id}>
                <PackagedLotCard
                  item={item}
                  onClick={() => setSelectedLotId(item.id)}
                />
              </div>
            ))}
          </DivAnimateYAxis>
        </section>
      </main>
    </div>
  );
};

export default Market;
