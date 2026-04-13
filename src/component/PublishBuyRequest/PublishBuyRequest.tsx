import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { 
  Edit3, Plus, ArrowLeft, ClipboardList, Eye, Settings, 
  FileText, CheckCircle, AlertCircle, Package, Beaker,
  Thermometer, ShieldCheck, Truck
} from "lucide-react";

// --- INTERFACE POUR LES PROPS (Correction de l'erreur TS) ---
interface PublishBuyRequestProps {
  editMode?: boolean;
  requestToEdit?: any;
  onSuccess?: () => void;
}

const styles = {
  headerTitle: { fontFamily: "serif", fontSize: "2.5rem", fontWeight: "300" as const, color: "#000" },
  subTitle: {
    fontFamily: "serif", fontSize: "1.1rem", marginBottom: "1.5rem", marginTop: "2.5rem", color: "#000",
    borderBottom: "1px solid #000", paddingBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px",
  },
  label: { fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#999", fontWeight: "600", display: "block", marginBottom: "8px" },
  input: { border: "none", borderBottom: "1px solid #e0e0e0", borderRadius: "0", padding: "10px 0", fontSize: "0.9rem", width: "100%", outline: "none", backgroundColor: "transparent", marginBottom: "20px" },
  select: { border: "none", borderBottom: "1px solid #e0e0e0", borderRadius: "0", padding: "10px 0", fontSize: "0.9rem", width: "100%", outline: "none", backgroundColor: "transparent", marginBottom: "20px", appearance: "none" as const },
  card: { border: "1px solid #f2f2f2", borderRadius: "0", padding: "2rem", marginBottom: "2rem", backgroundColor: "#fff" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" },
  badge: { fontSize: "0.6rem", padding: "5px 12px", border: "1px solid #000", borderRadius: "20px", textTransform: "uppercase" as const, letterSpacing: "1px", fontWeight: "bold" as const },
  statusFlag: (color: string) => ({ fontSize: "0.55rem", padding: "3px 8px", fontWeight: "bold" as const, textTransform: "uppercase" as const, border: `1px solid ${color}`, color: color }),
  tabButton: (active: boolean) => ({
    padding: "10px 20px",
    cursor: "pointer",
    fontSize: "0.65rem",
    fontWeight: "bold" as const,
    backgroundColor: active ? "#000" : "transparent",
    color: active ? "#fff" : "#999",
    border: "1px solid #000",
    textTransform: "uppercase" as const,
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }),
  detailBox: { padding: "15px", border: "1px solid #f8f9fa", backgroundColor: "#fcfcfc", marginBottom: "10px" }
};

const PublishBuyRequest: React.FC<PublishBuyRequestProps> = ({ 
  editMode = false, 
  requestToEdit = null, 
  onSuccess 
}) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const buyerId = user?.id || user?.id;
  const isAdmin = user?.role === "admin";

  // Si on est en mode édition forcé par le parent, on affiche le formulaire
  const [view, setView] = useState<"list" | "form">(editMode ? "form" : "list");
  const [activeTab, setActiveTab] = useState<"consult" | "details" | "modify">("consult");
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(requestToEdit);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchRequests = async () => {
    if (editMode) return; // Pas besoin de charger la liste si on est en train d'éditer une offre précise
    setLoading(true);
    try {
      const url = isAdmin 
        ? "http://localhost:5000/api/buy-requests/" 
        : `http://localhost:5000/api/buy-requests/my-requests/${buyerId}`;
      const res = await axios.get(url);
      setRequests(res.data);
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [buyerId, isAdmin, editMode]);

  const handleEdit = (req: any) => {
    setSelectedRequest(req);
    setActiveTab(isAdmin ? "details" : "modify");
    setView("form");
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess(); // Retour au parent (MarketRequestsView)
    } else {
      setSelectedRequest(null);
      setView("list");
      setMessage(null);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Validé" || status === "Ouvert") return "#2ecc71";
    if (status === "Rejeté") return "#e74c3c";
    return "#f1c40f"; 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      buyerId: selectedRequest ? selectedRequest.buyerId : buyerId,
      status: isAdmin ? formData.get("status") : (selectedRequest?.status || "En attente de validation"),
      traceability: {
        campagneOleicole: formData.get("campagne"),
        methodeExtraction: formData.get("methodeExtraction"),
        typeRecolte: formData.get("typeRecolte"),
        typeIrrigation: formData.get("typeIrrigation"),
        stockageSuhaité: [formData.get("stockage")],
      },
      physicoChimique: {
        variety: formData.get("variety"),
        classification: formData.get("classification"),
        aciditeLibreMax: Number(formData.get("acidite")),
        indicePeroxydeMax: Number(formData.get("peroxyde")),
      },
      logistique: {
        quantityNeeded: Number(formData.get("quantity")),
        targetPrice: Number(formData.get("price")),
        packagingType: formData.get("packaging"),
      },
      validationDetails: isAdmin ? {
        isValidated: formData.get("status") === "Validé",
        rejectionReason: formData.get("rejectionReason")
      } : selectedRequest?.validationDetails
    };

    try {
      if (selectedRequest) {
        await axios.put(`http://localhost:5000/api/buy-requests/edit/${selectedRequest._id}`, payload);
        setMessage({ type: "success", text: "Mise à jour réussie !" });
      } else {
        await axios.post("http://localhost:5000/api/buy-requests/add", payload);
        setMessage({ type: "success", text: "Publication réussie. En attente de validation." });
      }
      
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500);
      } else {
        fetchRequests();
        setTimeout(() => handleCancel(), 1500);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'enregistrement." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-2" style={{ maxWidth: "1100px" }}>
      {!editMode && (
        <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
          <div>
            <span style={styles.label}>{isAdmin ? "Administration Centrale" : "Plateforme Acheteur"}</span>
            <h1 style={styles.headerTitle}>Appels d'Offres</h1>
          </div>
          <div className="d-flex gap-4">
            <button 
              onClick={handleCancel} 
              className="btn btn-link text-decoration-none p-0"
              style={{ ...styles.label, color: view === "list" ? "#000" : "#ccc" }}
            >
              {isAdmin ? "Toutes les demandes" : "Mes demandes"} ({requests.length})
            </button>
            {!isAdmin && (
              <button 
                onClick={() => { setSelectedRequest(null); setView("form"); }} 
                className="btn btn-link text-decoration-none p-0"
                style={{ ...styles.label, color: view === "form" && !selectedRequest ? "#000" : "#ccc" }}
              >
                <Plus size={14} className="me-1"/> Publier
              </button>
            )}
          </div>
        </header>
      )}

      {message && (
        <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} rounded-0 mb-4`} style={styles.label}>
          {message.text}
        </div>
      )}

      {view === "list" && !editMode ? (
        <div className="fade-in">
          {loading ? (
            <p className="text-center py-5 text-muted">Chargement du marché...</p>
          ) : requests.length > 0 ? (
            <div className="row g-4">
              {requests.map((req) => (
                <div className="col-md-6" key={req._id}>
                  <div style={styles.card} className="h-100 shadow-sm border-start border-4 border-dark position-relative">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span style={styles.badge}>{req.physicoChimique?.variety}</span>
                        <div className="mt-2">
                           <span style={styles.statusFlag(getStatusColor(req.status))}>
                            {req.status}
                           </span>
                        </div>
                      </div>
                      <button onClick={() => handleEdit(req)} className="btn p-0 text-muted">
                        {isAdmin ? <Settings size={18}/> : <Edit3 size={18}/>}
                      </button>
                    </div>
                    <h5 className="mt-3 fw-bold">{req.logistique?.quantityNeeded?.toLocaleString()} L recherchés</h5>
                    <p className="small text-muted mb-0">Prix cible: <strong>{req.logistique?.targetPrice} €/L</strong></p>
                    {isAdmin && <p className="small text-dark mt-1">Client: {req.buyerId?.companyName || "N/A"}</p>}
                    {req.status === "Rejeté" && req.validationDetails?.rejectionReason && (
                      <div className="mt-2 p-2 bg-light border-start border-danger small text-danger">
                        <strong>Motif :</strong> {req.validationDetails.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 border bg-light">
                <ClipboardList size={40} className="text-muted mb-3" />
                <p className="text-muted">Aucun appel d'offre actif.</p>
                {!isAdmin && <button onClick={() => setView("form")} className="btn btn-dark rounded-0 px-4 mt-2" style={styles.label}>Créer ma première demande</button>}
            </div>
          )}
        </div>
      ) : (
        <div className="fade-in pb-5">
          <div className="d-flex align-items-center mb-4">
            <button type="button" onClick={handleCancel} className="btn btn-link text-dark p-0 me-3"><ArrowLeft /></button>
            <h2 style={{ ...styles.subTitle, border: 'none', margin: 0, padding: 0 }}>
              {isAdmin ? `Modération : Lot #${selectedRequest?._id.slice(-5)}` : (selectedRequest ? "Modifier ma demande" : "Nouveau Cahier des Charges")}
            </h2>
          </div>

          {isAdmin && selectedRequest && (
            <div className="d-flex gap-2 mb-4">
              <button onClick={() => setActiveTab("details")} style={styles.tabButton(activeTab === "details")}><FileText size={14}/> Détails</button>
              <button onClick={() => setActiveTab("modify")} style={styles.tabButton(activeTab === "modify")}><Settings size={14}/> Modération</button>
            </div>
          )}

          {isAdmin && activeTab === "details" && selectedRequest ? (
            <div className="row g-3 animate-in">
              <div className="col-md-6">
                <div style={styles.detailBox}>
                  <div className="d-flex align-items-center gap-2 mb-3"><Thermometer size={16}/> <span style={styles.label}>Traçabilité & Extraction</span></div>
                  <ul className="list-unstyled small">
                    <li>Campagne: <strong>{selectedRequest.traceability?.campagneOleicole}</strong></li>
                    <li>Extraction: <strong>{selectedRequest.traceability?.methodeExtraction}</strong></li>
                    <li>Récolte: <strong>{selectedRequest.traceability?.typeRecolte}</strong></li>
                    <li>Stockage: <strong>{selectedRequest.traceability?.stockageSuhaité?.join(", ")}</strong></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6">
                <div style={styles.detailBox}>
                  <div className="d-flex align-items-center gap-2 mb-3"><ShieldCheck size={16}/> <span style={styles.label}>Qualité Ciblée</span></div>
                  <ul className="list-unstyled small">
                    <li>Classification: <strong>{selectedRequest.physicoChimique?.classification}</strong></li>
                    <li>Acidité Max: <strong>{selectedRequest.physicoChimique?.aciditeLibreMax}%</strong></li>
                    <li>Peroxyde Max: <strong>{selectedRequest.physicoChimique?.indicePeroxydeMax}</strong></li>
                  </ul>
                </div>
              </div>
              <div className="col-12">
                <div style={styles.detailBox}>
                  <div className="d-flex align-items-center gap-2 mb-3"><Truck size={16}/> <span style={styles.label}>Logistique</span></div>
                  <p className="small mb-0">Conditionnement: <strong>{selectedRequest.logistique?.packagingType}</strong></p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 style={styles.subTitle}>1. Traçabilité & Extraction</h2>
              <div style={styles.card}>
                <div style={styles.grid}>
                  <div><label style={styles.label}>Campagne</label><input name="campagne" style={styles.input} defaultValue={selectedRequest?.traceability?.campagneOleicole} required /></div>
                  <div><label style={styles.label}>Extraction</label>
                    <select name="methodeExtraction" style={styles.select} defaultValue={selectedRequest?.traceability?.methodeExtraction}>
                      <option value="À froid">À froid</option><option value="2 phases">2 phases</option><option value="Traditionnelle">Traditionnelle</option>
                    </select>
                  </div>
                  <div><label style={styles.label}>Récolte</label>
                    <select name="typeRecolte" style={styles.select} defaultValue={selectedRequest?.traceability?.typeRecolte}>
                      <option value="Manuelle">Manuelle</option><option value="Mécanique">Mécanique</option>
                    </select>
                  </div>
                  <div><label style={styles.label}>Stockage</label>
                    <select name="stockage" style={styles.select} defaultValue={selectedRequest?.traceability?.stockageSuhaité?.[0]}>
                      <option value="Récipients Inox">Récipients Inox</option><option value="Verre foncé">Verre foncé</option>
                    </select>
                  </div>
                </div>
              </div>

              <h2 style={styles.subTitle}>2. Seuils Physico-chimiques</h2>
              <div style={styles.card}>
                <div style={styles.grid}>
                  <div><label style={styles.label}>Variété</label>
                    <select name="variety" style={styles.select} defaultValue={selectedRequest?.physicoChimique?.variety} required>
                      <option value="Chemlali">Chemlali</option><option value="Chetoui">Chetoui</option><option value="Oueslati">Oueslati</option>
                    </select>
                  </div>
                  <div><label style={styles.label}>Classification</label>
                    <select name="classification" style={styles.select} defaultValue={selectedRequest?.physicoChimique?.classification} required>
                      <option value="Vierge Extra">Vierge Extra</option><option value="Vierge">Vierge</option>
                    </select>
                  </div>
                  <div><label style={styles.label}>Acidité Max (%)</label><input name="acidite" type="number" step="0.01" style={styles.input} defaultValue={selectedRequest?.physicoChimique?.aciditeLibreMax} /></div>
                  <div><label style={styles.label}>Peroxyde Max</label><input name="peroxyde" type="number" style={styles.input} defaultValue={selectedRequest?.physicoChimique?.indicePeroxydeMax} /></div>
                </div>
              </div>

              <h2 style={styles.subTitle}>3. Volume & Budget</h2>
              <div style={styles.card}>
                <div style={styles.grid}>
                  <div><label style={styles.label}>Quantité (L)</label><input name="quantity" type="number" style={styles.input} defaultValue={selectedRequest?.logistique?.quantityNeeded} required /></div>
                  <div><label style={styles.label}>Prix Cible (€/L)</label><input name="price" type="number" step="0.01" style={styles.input} defaultValue={selectedRequest?.logistique?.targetPrice} required /></div>
                  <div><label style={styles.label}>Conditionnement</label>
                    <select name="packaging" style={styles.select} defaultValue={selectedRequest?.logistique?.packagingType} required>
                      <option value="Vrac">Vrac</option><option value="Bouteilles">Bouteilles</option><option value="Semi Vrac">Semi Vrac (IBC)</option>
                    </select>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <>
                  <h2 style={styles.subTitle}>4. Décision Administrative</h2>
                  <div style={styles.card}>
                    <div style={styles.grid}>
                      <div>
                        <label style={styles.label}>Statut</label>
                        <select name="status" style={styles.select} defaultValue={selectedRequest?.status}>
                          <option value="En attente de validation">En attente</option>
                          <option value="Validé">Validé / Ouvert</option>
                          <option value="Rejeté">Rejeté</option>
                        </select>
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                        <label style={styles.label}>Motif (si rejet)</label>
                        <input name="rejectionReason" style={styles.input} defaultValue={selectedRequest?.validationDetails?.rejectionReason} placeholder="..." />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="d-flex justify-content-end gap-3 mt-5">
                <button type="button" onClick={handleCancel} className="btn btn-link text-dark text-decoration-none" style={styles.label}>Annuler</button>
                <button type="submit" className="btn btn-dark px-5" style={{ ...styles.label, color: "#fff", borderRadius: 0, height: "50px" }} disabled={isSubmitting}>
                  {isSubmitting ? "CHARGEMENT..." : isAdmin ? "CONFIRMER LES MODIFICATIONS" : selectedRequest ? "METTRE À JOUR" : "DIFFUSER"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
};

export default PublishBuyRequest;