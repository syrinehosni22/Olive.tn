import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useInventory } from "./useInventory";
import ProductList from "./ProductList";
import {
  FileText, Upload, ChevronLeft, Save, CheckCircle, 
  Beaker, Globe, ShieldCheck, Package, Droplet, Truck,
  AlertCircle, Award, Microscope, Search, Info
} from "lucide-react";

// --- LOGIQUE DE STYLE DES STATUTS ---
const getStatusStyle = (status: string): React.CSSProperties => {
  switch (status) {
    case "Validé":
    case "Disponible":
      return { backgroundColor: "#f6fff8", color: "#2ecc71", borderColor: "#2ecc71" };
    case "Rejeté":
      return { backgroundColor: "#fff5f5", color: "#e74c3c", borderColor: "#e74c3c" };
    case "Vendu":
      return { backgroundColor: "#f4f4f4", color: "#7f8c8d", borderColor: "#7f8c8d" };
    default:
      return { backgroundColor: "#fffdf0", color: "#f1c40f", borderColor: "#f1c40f" };
  }
};

const styles = {
  headerTitle: { fontFamily: "serif", fontSize: "2.5rem", fontWeight: "300", color: "#000" },
  subTitle: { fontFamily: "serif", fontSize: "1.1rem", marginBottom: "1.5rem", marginTop: "2.5rem", color: "#000", borderBottom: "1px solid #000", paddingBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px", display: "flex", alignItems: "center", gap: "10px" },
  label: { fontSize: "0.65rem", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#999", fontWeight: "600", display: "block", marginBottom: "8px" },
  input: { border: "none", borderBottom: "1px solid #e0e0e0", borderRadius: "0", padding: "10px 0", fontSize: "0.9rem", width: "100%", outline: "none", backgroundColor: "transparent", marginBottom: "20px" },
  select: { border: "none", borderBottom: "1px solid #e0e0e0", borderRadius: "0", padding: "10px 0", fontSize: "0.9rem", width: "100%", outline: "none", backgroundColor: "transparent", marginBottom: "20px", appearance: "none" as const },
  card: { border: "1px solid #f2f2f2", borderRadius: "0", padding: "2rem", marginBottom: "2rem", backgroundColor: "#fff" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "25px" },
  uploadSection: { backgroundColor: "#fcfcfc", border: "1px dashed #ccc", padding: "15px", marginTop: "10px", textAlign: "center" as const, minHeight: "80px", display: "flex", flexDirection: "column" as const, justifyContent: "center", alignItems: "center" },
  uploadLink: { fontSize: "0.6rem", fontWeight: "bold" as const, cursor: "pointer", color: "#000", textDecoration: "underline", textTransform: "uppercase" as const },
  adminZone: { border: "1px solid #f1c40f", padding: "2rem", marginTop: "10px", borderLeft: "4px solid #f1c40f" },
  hint: { fontSize: "0.7rem", color: "#666", fontStyle: "italic", marginBottom: "10px", display: "block" }
};

const InventoryView = () => {
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = reduxUser?.role === "admin";
  const sellerId = reduxUser?.id || reduxUser?._id;

  const [view, setView] = useState<"list" | "add">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const initialFormState = {
    sellerId: sellerId || "",
    status: "En attente de validation",
    traceability: {
      campagneOleicole: "",
      lotNumber: "",
      dateRecolte: "",
      dateExtraction: "",
      typeRecolte: "Manuelle",
      typeIrrigation: "Sec",
      methodeExtraction: "À froid",
      filtration: "Filtrée",
      stabiliteRancimat: "8 à 15 h",
      dureeConservation: "18 à 24 mois",
      stockage: {
        temperature: "14–18 °C",
        recipients: "Récipients en Inox",
        conditions: ["À l'abri de la lumière"]
      },
      fileUrlTraceabilite: ""
    },
    physicoChimique: {
      variety: "Chemlali",
      classification: "Vierge Extra",
      aciditeLibre: "",
      indicePeroxyde: "",
      absorbanceUV: { k232: "", k270: "", deltaK: "" },
      humiditeMatieresVolatiles: "",
      impuretesInsolubles: "",
      fileUrlAnalyse: ""
    },
    organoleptique: {
      medianeDefauts: 0,
      medianeFruite: "",
      attributsNegatifs: [],
      attributsPositifs: [],
      fileUrlPanelTest: ""
    },
    purete: {
      acidesGras: { oleique: "", linoleique: "", palmitique: "" },
      sterols: { totaux: "", betaSitosterol: "" },
      erythrodiolUvaol: "",
      ciresWaxes: "",
      alkylEsters: "",
      ethylEstersFAEE: "",
      pointFumee: "",
      fileUrlPurete: ""
    },
    securite: {
      pesticides: false,
      metauxLourds: false,
      moshMoah: false,
      microbiologie: { levuresMoisissures: "", salmonella: "", eColi: "" },
      fileUrlSecurite: ""
    },
    qualiteCommerciale: {
      polyphenols: "150-350 mg/kg",
      tocopherols: "15-22 mg/100 g",
      couleur: ""
    },
    logistique: {
      packagingType: "Bouteilles",
      packagingDetail: "",
      totalQuantity: "",
      minOrderQuantity: "",
      price: "",
      incoterm: "EXW",
      port: "Radès"
    },
    documentsExport: {
      certificatOrigine: "",
      certificatBio: "",
      ficheTechnique: "",
      ficheSecurite: "",
      certificatSanitaire: "",
      coa: "",
      certificatPhytosanitaire: "",
      analyseEmballage: ""
    },
    certifications: []
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const { products, isLoading, refresh } = useInventory(isAdmin ? "all" : sellerId || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const keys = name.split(".");
    
    setFormData((prev: any) => {
      let newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      if (type === "checkbox") {
        current[keys[keys.length - 1]] = (e.target as HTMLInputElement).checked;
      } else {
        current[keys[keys.length - 1]] = value;
      }
      return newData;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        const keys = fieldPath.split(".");
        setFormData((prev: any) => {
          let newData = { ...prev };
          let current = newData;
          for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = base64;
          return newData;
        });
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData._id 
        ? `http://localhost:5000/api/products/edit/${formData._id}` 
        : "http://localhost:5000/api/products/add";

      const response = await fetch(url, {
        method: formData._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
      setMessage({ type: "success", text: "Lot et analyses enregistrés avec succès" });
      refresh();
      setTimeout(() => { setView("list"); setMessage(null); }, 2000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-5" style={{ maxWidth: "1200px" }}>
      <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
        <div>
          <span style={styles.label}>{isAdmin ? "Supervision Plateforme" : "Producteur / Exportateur"}</span>
          <h1 style={styles.headerTitle}>{isAdmin ? "Gestion du Catalogue" : "Mon Inventaire Olive Tn"}</h1>
        </div>
        <div className="d-flex gap-4">
          <button onClick={() => setView("list")} className="btn btn-link text-decoration-none p-0" style={{ ...styles.label, color: view === "list" ? "#000" : "#ccc" }}>Stock & Lots</button>
          {!isAdmin && <button onClick={() => { setFormData(initialFormState); setView("add"); }} className="btn btn-link text-decoration-none p-0" style={{ ...styles.label, color: view === "add" ? "#000" : "#ccc" }}>+ Certifier un Lot</button>}
        </div>
      </header>

      {message && <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb-4 rounded-0`}>{message.text}</div>}

      {view === "list" ? (
        <ProductList products={products} isLoading={isLoading} onEdit={(p) => { setFormData(p); setView("add"); }} getStatusStyle={getStatusStyle} />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="d-flex align-items-center mb-4" style={{ cursor: "pointer" }} onClick={() => setView("list")}>
            <ChevronLeft size={16} /> <span style={styles.label} className="mb-0 ms-2">Retour au catalogue</span>
          </div>

          {/* 1. TRAÇABILITÉ */}
          <h2 style={styles.subTitle}><Globe size={18}/> 1. Propriétés de l'Huile & Traçabilité</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Campagne Oléicole</label>
                <input name="traceability.campagneOleicole" placeholder="ex: 2024/2025" value={formData.traceability?.campagneOleicole} onChange={handleChange} style={styles.input} required />
              </div>
              <div><label style={styles.label}>Numéro de Lot</label>
                <input name="traceability.lotNumber" value={formData.traceability?.lotNumber} onChange={handleChange} style={styles.input} required />
              </div>
              <div><label style={styles.label}>Type de Récolte</label>
                <select name="traceability.typeRecolte" value={formData.traceability?.typeRecolte} onChange={handleChange} style={styles.select}>
                  <option value="Manuelle">Manuelle</option>
                  <option value="Récolte par gaule (bâtonnage)">Récolte par gaule (bâtonnage)</option>
                  <option value="Récolte avec filets au sol">Récolte avec filets au sol</option>
                  <option value="Récolte mécanique avec peignes">Récolte mécanique (peignes)</option>
                  <option value="Récolte mécanique par vibreur">Vibreur de tronc</option>
                  <option value="Récolte entièrement mécanisée">Entièrement mécanisée</option>
                </select>
              </div>
              <div><label style={styles.label}>Méthode d'Extraction</label>
                <select name="traceability.methodeExtraction" value={formData.traceability?.methodeExtraction} onChange={handleChange} style={styles.select}>
                  <option value="À froid">À froid</option>
                  <option value="Traditionnelle">Traditionnelle</option>
                  <option value="Presse hydraulique">Presse hydraulique</option>
                  <option value="2 phases">Système 2 phases</option>
                  <option value="3 phases">Système 3 phases</option>
                </select>
              </div>
              <div><label style={styles.label}>Test Rancimat (Stabilité)</label>
                <select name="traceability.stabiliteRancimat" value={formData.traceability?.stabiliteRancimat} onChange={handleChange} style={styles.select}>
                  <option value="5 à 8 h">5-8 h (Moyenne)</option>
                  <option value="8 à 15 h">8-15 h (Bonne)</option>
                  <option value="+15 h">+15 h (Excellente)</option>
                </select>
              </div>
              <div><label style={styles.label}>Filtrée ou Non</label>
                <select name="traceability.filtration" value={formData.traceability?.filtration} onChange={handleChange} style={styles.select}>
                  <option value="Filtrée">Filtrée</option>
                  <option value="Non filtrée">Non filtrée</option>
                </select>
              </div>
            </div>
            <div style={styles.uploadSection}>
              {formData.traceability?.fileUrlTraceabilite ? <CheckCircle size={20} className="text-success" /> : <Upload size={20} className="opacity-50" />}
              <label style={styles.uploadLink} className="mt-2">Joindre preuve de traçabilité <input type="file" hidden onChange={(e) => handleFileChange(e, "traceability.fileUrlTraceabilite")} /></label>
            </div>
          </div>

          {/* 2. PHYSICO-CHIMIQUE */}
          <h2 style={styles.subTitle}><Microscope size={18}/> 2. Analyses Physico-Chimiques</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Variété Principale</label>
                <select name="physicoChimique.variety" value={formData.physicoChimique?.variety} onChange={handleChange} style={styles.select}>
                  <option value="Chemlali">Chemlali</option>
                  <option value="Chetoui">Chetoui</option>
                  <option value="Oueslati">Oueslati</option>
                  <option value="Zarrazi">Zarrazi</option>
                  <option value="Koroneiki">Koroneiki</option>
                  <option value="Arbequina">Arbequina</option>
                  <option value="Picual">Picual</option>
                </select>
              </div>
              <div><label style={styles.label}>Classification (EVOO/VOO)</label>
                <select name="physicoChimique.classification" value={formData.physicoChimique?.classification} onChange={handleChange} style={styles.select}>
                  <option value="Vierge Extra">Vierge Extra (≤ 0,8%)</option>
                  <option value="Vierge">Vierge (≤ 2,0%)</option>
                  <option value="Lampante">Lampante ( `{'>'}` 2,0%)</option>
                </select>
              </div>
              <div><label style={styles.label}>Acidité Libre (% oléique)</label>
                <input name="physicoChimique.aciditeLibre" type="number" step="0.01" value={formData.physicoChimique?.aciditeLibre} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Indice de Peroxyde</label>
                <input name="physicoChimique.indicePeroxyde" type="number" value={formData.physicoChimique?.indicePeroxyde} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Absorbance K232</label>
                <input name="physicoChimique.absorbanceUV.k232" type="number" step="0.001" value={formData.physicoChimique?.absorbanceUV?.k232} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Absorbance K270</label>
                <input name="physicoChimique.absorbanceUV.k270" type="number" step="0.001" value={formData.physicoChimique?.absorbanceUV?.k270} onChange={handleChange} style={styles.input} />
              </div>
            </div>
            <div style={styles.uploadSection}>
              {formData.physicoChimique?.fileUrlAnalyse ? <CheckCircle size={20} className="text-success" /> : <FileText size={20} className="opacity-50" />}
              <label style={styles.uploadLink} className="mt-2">Joindre Bulletin d'analyse Physico-Chimique <input type="file" hidden onChange={(e) => handleFileChange(e, "physicoChimique.fileUrlAnalyse")} /></label>
            </div>
          </div>

          {/* 3. ORGANOLEPTIQUE (Panel Test) */}
          <h2 style={styles.subTitle}><Droplet size={18}/> 3. Analyse Organoleptique (Panel Test COI)</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Médiane des Défauts (Md)</label>
                <input name="organoleptique.medianeDefauts" type="number" step="0.1" value={formData.organoleptique?.medianeDefauts} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Médiane du Fruité (Mf)</label>
                <input name="organoleptique.medianeFruite" type="number" step="0.1" value={formData.organoleptique?.medianeFruite} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Équilibre de l'huile</label>
                <select name="organoleptique.attributsPositifs" value={formData.organoleptique?.attributsPositifs?.[0]} onChange={handleChange} style={styles.select}>
                  <option value="Équilibrée">Équilibrée</option>
                  <option value="Douce">Douce</option>
                  <option value="Intense">Intense</option>
                </select>
              </div>
            </div>
            <div style={styles.uploadSection}>
              {formData.organoleptique?.fileUrlPanelTest ? <CheckCircle size={20} className="text-success" /> : <Award size={20} className="opacity-50" />}
              <label style={styles.uploadLink} className="mt-2">Joindre Bulletin Panel Test <input type="file" hidden onChange={(e) => handleFileChange(e, "organoleptique.fileUrlPanelTest")} /></label>
            </div>
          </div>

          {/* 4. PURETÉ (Anti-Fraude) */}
          <h2 style={styles.subTitle}><ShieldCheck size={18}/> 4. Analyses de Pureté (Anti-Fraude)</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Acide Oléique C18:1 (55-83%)</label>
                <input name="purete.acidesGras.oleique" type="number" value={formData.purete?.acidesGras?.oleique} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Stérols Totaux (≥ 1000 mg/kg)</label>
                <input name="purete.sterols.totaux" type="number" value={formData.purete?.sterols?.totaux} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Alkyl Esters (mg/kg)</label>
                <input name="purete.alkylEsters" type="number" placeholder="Standard < 150" value={formData.purete?.alkylEsters} onChange={handleChange} style={styles.input} />
              </div>
              <div><label style={styles.label}>Éthyl Esters (FAEE)</label>
                <input name="purete.ethylEstersFAEE" type="number" placeholder="≤ 35 mg/kg" value={formData.purete?.ethylEstersFAEE} onChange={handleChange} style={styles.input} />
              </div>
            </div>
            <div style={styles.uploadSection}>
              {formData.purete?.fileUrlPurete ? <CheckCircle size={20} className="text-success" /> : <Search size={20} className="opacity-50" />}
              <label style={styles.uploadLink} className="mt-2">Joindre Analyses Pureté <input type="file" hidden onChange={(e) => handleFileChange(e, "purete.fileUrlPurete")} /></label>
            </div>
          </div>

          {/* 5. LOGISTIQUE & COMMERCE */}
          <h2 style={styles.subTitle}><Truck size={18}/> 5. Données Commerciales & Logistique</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Conditionnement</label>
                <select name="logistique.packagingType" value={formData.logistique?.packagingType} onChange={handleChange} style={styles.select}>
                  <option value="Bouteilles">Bouteilles (Verre/PET)</option>
                  <option value="Semi Vrac">Semi Vrac (IBC/Bidons)</option>
                  <option value="Vrac">Vrac (Flexitank/Citerne)</option>
                </select>
              </div>
              <div><label style={styles.label}>Volume Total (L)</label>
                <input name="logistique.totalQuantity" type="number" value={formData.logistique?.totalQuantity} onChange={handleChange} style={styles.input} required />
              </div>
              <div><label style={styles.label}>Prix Indicatif (€/L)</label>
                <input name="logistique.price" type="number" step="0.01" value={formData.logistique?.price} onChange={handleChange} style={styles.input} required />
              </div>
              <div><label style={styles.label}>Incoterm</label>
                <select name="logistique.incoterm" value={formData.logistique?.incoterm} onChange={handleChange} style={styles.select}>
                  <option value="EXW">EXW - Usine</option>
                  <option value="FOB">FOB - Franco Bord</option>
                  <option value="CIF">CIF - Coût, Assurance et Fret</option>
                  <option value="DDP">DDP - Rendu droits acquittés</option>
                </select>
              </div>
              <div><label style={styles.label}>Port de Chargement</label>
                <select name="logistique.port" value={formData.logistique?.port} onChange={handleChange} style={styles.select}>
                  <option value="Radès">Radès</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Sousse">Sousse</option>
                  <option value="Bizerte">Bizerte</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. DOCUMENTS EXPORT */}
          <h2 style={styles.subTitle}><FileText size={18}/> 6. Documents de Conformité Export</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div style={styles.uploadSection}>
                {formData.documentsExport?.certificatOrigine ? <CheckCircle size={16} className="text-success" /> : <Globe size={16} />}
                <label style={styles.uploadLink} className="mt-2">Certificat d'Origine <input type="file" hidden onChange={(e) => handleFileChange(e, "documentsExport.certificatOrigine")} /></label>
              </div>
              <div style={styles.uploadSection}>
                {formData.documentsExport?.certificatBio ? <CheckCircle size={16} className="text-success" /> : <Droplet size={16} />}
                <label style={styles.uploadLink} className="mt-2">Certificat BIO <input type="file" hidden onChange={(e) => handleFileChange(e, "documentsExport.certificatBio")} /></label>
              </div>
              <div style={styles.uploadSection}>
                {formData.documentsExport?.coa ? <CheckCircle size={16} className="text-success" /> : <Microscope size={16} />}
                <label style={styles.uploadLink} className="mt-2">COA (Analyses) <input type="file" hidden onChange={(e) => handleFileChange(e, "documentsExport.coa")} /></label>
              </div>
              <div style={styles.uploadSection}>
                {formData.documentsExport?.certificatSanitaire ? <CheckCircle size={16} className="text-success" /> : <ShieldCheck size={16} />}
                <label style={styles.uploadLink} className="mt-2">Certificat Sanitaire <input type="file" hidden onChange={(e) => handleFileChange(e, "documentsExport.certificatSanitaire")} /></label>
              </div>
            </div>
          </div>

          {/* SECTION ADMIN (Visible uniquement pour l'admin) */}
          {isAdmin && (
            <div style={{ ...styles.adminZone, ...getStatusStyle(formData.status) }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <ShieldCheck size={20} /> <span style={styles.label} className="mb-0">Zone de Validation Admin</span>
              </div>
              <div style={styles.grid}>
                <div><label style={styles.label}>Statut de Conformité</label>
                  <select name="status" value={formData.status} onChange={handleChange} style={styles.select}>
                    <option value="En attente de validation">En attente</option>
                    <option value="Validé">Validé (Analyses OK)</option>
                    <option value="Disponible">Disponible (Public)</option>
                    <option value="Rejeté">Rejeté (Inconforme)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end gap-3 mt-5 pb-5">
            <button type="button" onClick={() => setView("list")} className="btn btn-link text-dark text-decoration-none" style={styles.label}>Abandonner</button>
            <button type="submit" className="btn btn-dark px-5" style={{ borderRadius: 0 }} disabled={isSubmitting}>
              {isSubmitting ? "Traitement..." : <><Save size={14} className="me-2"/> Certifier le Lot et Publier</>}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default InventoryView;