import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { 
  Package, 
  Beaker, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";
import PublishBuyRequest from "../PublishBuyRequest/PublishBuyRequest";

// --- INTERFACES ---
interface BuyRequest {
  _id: string;
  buyerId: {
    _id: string;
    firstName: string;
    name: string;
    companyName: string;
  };
  traceability: {
    campagneOleicole: string;
    typeRecolte?: string;
    methodeExtraction?: string;
  };
  physicoChimique: {
    variety: string;
    classification: string;
    aciditeLibre?: number;
    aciditeLibreMax?: number;
  };
  logistique: {
    quantityNeeded: number;
    targetPrice: number;
    packagingType: string;
  };
  status: string;
  validationDetails?: {
    rejectionReason?: string;
  };
  createdAt: string;
}

interface MarketRequestsViewProps {
  onContactSelect: (contact: any, messageContext?: string) => void;
}

const styles = {
  headerTitle: { fontFamily: "serif", fontSize: "2.2rem", fontWeight: "300" as const, color: "#000" },
  label: { fontSize: "0.6rem", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#999", fontWeight: "700", display: "block", marginBottom: "5px" },
  card: { border: "1px solid #f2f2f2", borderRadius: "0", backgroundColor: "#fff", transition: "all 0.3s ease" },
  statusFlag: (color: string) => ({ fontSize: "0.5rem", padding: "3px 8px", fontWeight: "bold" as const, textTransform: "uppercase" as const, border: `1px solid ${color}`, color: color })
};

const MarketRequestsView: React.FC<MarketRequestsViewProps> = ({ onContactSelect }) => {
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState<BuyRequest | null>(null);

  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = reduxUser?.role === "admin";

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // L'admin voit toutes les demandes du système
      const url = isAdmin ? "http://localhost:5000/api/buy-requests/" : "http://localhost:5000/api/buy-requests";
      const response = await axios.get(url);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [isAdmin]);

  const getStatusColor = (status: string) => {
    if (status === "Validé" || status === "Ouvert") return "#2ecc71";
    if (status === "Rejeté") return "#e74c3c";
    return "#f1c40f"; 
  };

  const handlePropose = (request: BuyRequest) => {
    const contact = {
      id: request.buyerId._id,
      firstName: request.buyerId.firstName,
      name: request.buyerId.name,
      companyName: request.buyerId.companyName
    };
    const message = `Bonjour, je vois votre appel d'offre pour ${request.logistique.quantityNeeded}L de ${request.physicoChimique.variety}. Je dispose de stocks correspondants à vos critères techniques.`;
    onContactSelect(contact, message);
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-dark"></div></div>;

  // --- RENDU DU FORMULAIRE DE MODÉRATION (Version Complète) ---
  if (isAdmin && editingRequest) {
    return (
      <div className="fade-in">
        <div className="container py-4">
          <button 
            onClick={() => { setEditingRequest(null); fetchRequests(); }} 
            className="btn btn-link text-dark p-0 mb-4 d-flex align-items-center gap-2 text-decoration-none"
            style={styles.label}
          >
            <ArrowLeft size={16} /> Retour au marché
          </button>
          
          {/* On réutilise le composant PublishBuyRequest en mode édition */}
          <PublishBuyRequest 
            editMode={true} 
            requestToEdit={editingRequest} 
            onSuccess={() => { setEditingRequest(null); fetchRequests(); }}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="container py-5" style={{ maxWidth: "1100px" }}>
      <header className="mb-5 border-bottom pb-3 d-flex justify-content-between align-items-end">
        <div>
          <span style={styles.label}>{isAdmin ? "Supervision Plateforme" : "Opportunités"}</span>
          <h1 style={styles.headerTitle}>Marché des Appels d'Offres</h1>
        </div>
        <div className="text-end">
          <span className="small fw-bold" style={{ letterSpacing: '2px' }}>{requests.length} OFFRES</span>
        </div>
      </header>

      <DivAnimateYAxis className="row g-4">
        {requests.map((req) => (
          <div className="col-12" key={req._id}>
            <div style={styles.card} className="p-4 border-start border-4 border-dark shadow-sm">
              <div className="row align-items-center">
                <div className="col-md-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span style={styles.statusFlag(getStatusColor(req.status))}>{req.status}</span>
                    {req.status === "Validé" ? <CheckCircle size={12} color="#2ecc71" /> : <AlertCircle size={12} color="#f1c40f" />}
                  </div>
                  <h5 className="fw-bold mb-0">{req.buyerId?.companyName}</h5>
                  <span className="small text-muted">{req.physicoChimique.variety}</span>
                </div>

                <div className="col-md-4 text-muted small">
                  <div className="d-flex align-items-center gap-2"><Package size={14} /> <strong>{req.logistique.quantityNeeded.toLocaleString()} L</strong> en {req.logistique.packagingType}</div>
                  <div className="d-flex align-items-center gap-2"><Beaker size={14} /> Acidité Max : {req.physicoChimique.aciditeLibreMax || "N/A"}%</div>
                </div>

                <div className="col-md-2 text-center">
                  <span style={styles.label}>Budget Cible</span>
                  <div className="fw-bold text-dark">{req.logistique.targetPrice} €/L</div>
                </div>

                <div className="col-md-3 text-end">
                  {isAdmin ? (
                    <button 
                      onClick={() => setEditingRequest(req)} 
                      className="btn btn-outline-dark rounded-0 btn-sm px-4"
                    >
                      MODÉRER / ÉDITER
                    </button>
                  ) : (
                    <button onClick={() => handlePropose(req)} className="btn btn-dark rounded-0 btn-sm px-4 d-flex align-items-center gap-2 ms-auto">
                      <MessageSquare size={14} /> RÉPONDRE
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </DivAnimateYAxis>

      <footer className="mt-5 pt-5 text-center">
        <p style={{ fontSize: '0.6rem', color: '#ccc', letterSpacing: '4px' }}>ZYNEX SOLUTION — MARCHÉ OLIVE TN</p>
      </footer>
    </section>
  );
};

export default MarketRequestsView;