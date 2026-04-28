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
  ArrowLeft,
  Settings2,
  Globe,
  Database
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
    filtration?: string;
    typeIrrigation?: string;
    stabiliteRancimatMin?: string;
  };
  physicoChimique: {
    variety: string;
    classification: string;
    aciditeLibreMax?: number;
    indicePeroxydeMax?: number;
    k232Max?: number;
  };
  logistique: {
    quantityNeeded: number;
    targetPrice: number;
    packagingType: string;
    incotermSouhaite?: string;
    destinationPort?: string;
  };
  status: string;
  createdAt: string;
}

interface MarketRequestsViewProps {
  onContactSelect: (contact: any, messageContext?: string) => void;
}

const styles = {
  headerTitle: { fontFamily: "serif", fontSize: "2.5rem", fontWeight: "300" as const, color: "#000" },
  label: { fontSize: "0.6rem", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#999", fontWeight: "700", display: "block", marginBottom: "5px" },
  card: { border: "1px solid #f2f2f2", borderRadius: "0", backgroundColor: "#fff", transition: "all 0.3s ease" },
  statusFlag: (color: string) => ({ 
    fontSize: "0.55rem", 
    padding: "3px 10px", 
    fontWeight: "bold" as const, 
    textTransform: "uppercase" as const, 
    border: `1px solid ${color}`, 
    color: color,
    backgroundColor: `${color}05` 
  })
};

const MarketRequestsView: React.FC<MarketRequestsViewProps> = ({ onContactSelect }) => {
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState<BuyRequest | null>(null);

  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = reduxUser?.role === "admin";
  const userId = reduxUser?.id || reduxUser?._id;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // L'admin voit tout, l'acheteur voit ses demandes, le vendeur voit les demandes validées
      const response = await axios.get("http://localhost:5000/api/buy-requests/");
      setRequests(response.data);
    } catch (error) {
      console.error("Erreur chargement market requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [isAdmin]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Validé": return "#2ecc71";
      case "Ouvert": return "#2ecc71";
      case "Rejeté": return "#e74c3c";
      default: return "#f1c40f";
    }
  };

  const handlePropose = (request: BuyRequest) => {
    const contact = {
      id: request.buyerId._id,
      firstName: request.buyerId.firstName,
      name: request.buyerId.name,
      companyName: request.buyerId.companyName
    };
    const message = `Bonjour, je réponds à votre appel d'offre pour ${request.logistique.quantityNeeded}L de ${request.physicoChimique.variety}. Je souhaite vous soumettre une proposition technique.`;
    onContactSelect(contact, message);
  };

  // --- RENDU DU FORMULAIRE D'ÉDITION AVEC DONNÉES PRÉ-REMPLIES ---
  if (editingRequest) {
    return (
      <div className="fade-in bg-white h-100 min-vh-100">
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
            <button 
              onClick={() => { setEditingRequest(null); fetchRequests(); }} 
              className="btn btn-outline-dark btn-sm rounded-0 d-flex align-items-center gap-2"
              style={{ fontSize: '0.65rem', fontWeight: 'bold' }}
            >
              <ArrowLeft size={14} /> ABANDONNER L'ÉDITION
            </button>
            <div className="text-end">
              <span style={styles.label}>ID Document</span>
              <span className="small fw-bold text-muted">#{editingRequest._id.slice(-8).toUpperCase()}</span>
            </div>
          </div>
          
          <div className="bg-light p-3 mb-4 d-flex align-items-center gap-3 border">
            <Database size={20} className="text-muted" />
            <p className="mb-0 small">
              Vous modifiez actuellement l'appel d'offre de <strong>{editingRequest.buyerId.companyName}</strong>. 
              Toutes les spécifications COI et logistiques ont été chargées.
            </p>
          </div>

          <PublishBuyRequest 
            editMode={true} 
            requestToEdit={editingRequest} // Transmission de l'objet complet
            onSuccess={() => {
              setEditingRequest(null);
              fetchRequests();
            }}
          />
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center h-100 py-5">
      <div className="spinner-border text-dark spinner-border-sm me-2"></div>
      <span style={styles.label}>Chargement du registre...</span>
    </div>
  );

  return (
    <section className="container py-5" style={{ maxWidth: "1100px" }}>
      <header className="mb-5 border-bottom pb-4 d-flex justify-content-between align-items-end">
        <div>
          <span style={styles.label}>{isAdmin ? "Administration Système" : "Opportunités B2B"}</span>
          <h1 style={styles.headerTitle}>Registre des Appels d'Offres</h1>
        </div>
        <div className="text-end">
          <span className="h4 fw-bold">{requests.length}</span>
          <p className="text-muted small mb-0 text-uppercase tracking-widest" style={{ fontSize: '0.5rem' }}>Dossiers actifs</p>
        </div>
      </header>

      <DivAnimateYAxis className="row g-4">
        {requests.length > 0 ? (
          requests.map((req) => (
            <div className="col-12" key={req._id}>
              <div style={styles.card} className="p-4 border-start border-4 border-dark shadow-sm hover-shadow">
                <div className="row align-items-center">
                  <div className="col-md-3 border-end">
                    <div className="mb-2">
                      <span style={styles.statusFlag(getStatusColor(req.status))}>{req.status}</span>
                    </div>
                    <h5 className="fw-bold mb-1" style={{ fontSize: '1rem', letterSpacing: '-0.3px' }}>{req.buyerId?.companyName}</h5>
                    <div className="d-flex align-items-center gap-2 text-success small fw-bold">
                      <Globe size={12} /> {req.physicoChimique.variety}
                    </div>
                  </div>

                  <div className="col-md-4 px-4">
                    <div className="d-flex align-items-center gap-2 text-muted mb-2 small">
                      <Package size={14} className="text-dark" /> 
                      <span className="text-dark fw-bold">{req.logistique.quantityNeeded.toLocaleString()} L</span>
                      <span className="opacity-25">|</span>
                      {req.logistique.packagingType}
                    </div>
                    <div className="d-flex align-items-center gap-2 text-muted small">
                      <Beaker size={14} className="text-dark" /> 
                      Seuil Acidité : <span className="text-dark fw-bold">{req.physicoChimique.aciditeLibreMax || "0.8"}%</span>
                    </div>
                  </div>

                  <div className="col-md-2 text-center border-start border-end">
                    <span style={styles.label}>Budget Cible</span>
                    <div className="h5 fw-bold text-dark mb-0">{req.logistique.targetPrice} €/L</div>
                    <div style={{ fontSize: '0.6rem' }} className="text-muted text-uppercase fw-bold">
                      {req.logistique.incotermSouhaite || "EXW"}
                    </div>
                  </div>

                  <div className="col-md-3 text-end">
                    {isAdmin || req.buyerId?._id === userId ? (
                      <button 
                        onClick={() => setEditingRequest(req)} 
                        className="btn btn-outline-dark rounded-0 btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                        style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}
                      >
                        <Settings2 size={14} /> MODIFIER LE CAHIER
                      </button>
                    ) : (
                      <button 
                        onClick={() => handlePropose(req)} 
                        className="btn btn-dark rounded-0 btn-sm w-100 d-flex align-items-center justify-content-center gap-2 shadow-sm"
                        style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}
                      >
                        <MessageSquare size={14} /> SOUMETTRE OFFRE
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5 border bg-light">
             <Globe size={40} className="text-muted opacity-25 mb-3" />
             <p className="text-muted small text-uppercase" style={{ letterSpacing: '2px' }}>Aucune demande d'achat en cours</p>
          </div>
        )}
      </DivAnimateYAxis>

      <footer className="mt-5 pt-5 text-center border-top">
        <p style={{ fontSize: '0.55rem', color: '#ccc', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Système de Courtage Numérique — Olive Tn Platform
        </p>
      </footer>

      <style>{`
        .hover-shadow:hover {
          transform: translateX(4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important;
          border-left-color: #2ecc71 !important;
        }
      `}</style>
    </section>
  );
};

export default MarketRequestsView;