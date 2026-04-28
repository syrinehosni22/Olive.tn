import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { 
  Globe, Beaker, Truck, ShieldCheck, Microscope, 
  Droplet, Package, Search 
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

const PublishBuyRequest: React.FC<any> = ({ editMode = false, requestToEdit = null, onSuccess }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const buyerId = user?.id || user?._id;

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Styles optimisés
  const styles = {
    subTitle: { fontFamily: "serif", fontSize: "1.1rem", marginBottom: "1.5rem", marginTop: "2.5rem", color: "#000", borderBottom: "1px solid #000", paddingBottom: "8px", textTransform: "uppercase" as const, letterSpacing: "1px", display: "flex", alignItems: "center", gap: "10px" },
    label: { fontSize: "0.6rem", textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "#999", fontWeight: "700", display: "block", marginBottom: "5px" },
    input: { border: "none", borderBottom: "1px solid #e0e0e0", borderRadius: "0", padding: "8px 0", fontSize: "0.85rem", width: "100%", outline: "none", backgroundColor: "transparent", marginBottom: "15px" },
    select: { border: "none", borderBottom: "1px solid #e0e0e0", borderRadius: "0", padding: "8px 0", fontSize: "0.85rem", width: "100%", outline: "none", backgroundColor: "transparent", marginBottom: "15px" },
    card: { border: "1px solid #f2f2f2", borderRadius: "0", padding: "1.5rem", marginBottom: "2rem", backgroundColor: "#fff" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);

    const payload = {
      buyerId,
      traceability: {
        campagneOleicole: fd.get("campagne"),
        typeRecolte: fd.get("typeRecolte"),
        methodeExtraction: fd.get("methodeExtraction"),
        filtration: fd.get("filtration"),
        stabiliteRancimatMin: fd.get("stabilite"),
      },
      physicoChimique: {
        variety: fd.get("variety"),
        classification: fd.get("classification"),
        aciditeLibreMax: Number(fd.get("acidite")),
        indicePeroxydeMax: Number(fd.get("peroxyde")),
        absorbanceUV: {
            k232Max: Number(fd.get("k232")),
            k270Max: Number(fd.get("k270")),
            deltaKMax: Number(fd.get("deltaK")),
        }
      },
      organoleptique: {
        medianeFruiteMin: Number(fd.get("fruiteMin")),
        medianeDefautsMax: Number(fd.get("defautsMax")),
        attributsPositifsSouhaites: [fd.get("attributPositif")],
      },
      purete: {
        alkylEstersMax: Number(fd.get("alkyl")),
        acideOleiqueMin: Number(fd.get("oleique")),
        sterolsTotauxMin: Number(fd.get("sterols")),
      },
      logistique: {
        quantityNeeded: Number(fd.get("quantity")),
        targetPrice: Number(fd.get("price")),
        packagingType: fd.get("packaging"),
        incotermSouhaite: fd.get("incoterm"),
        destinationPort: fd.get("port"),
      },
      certificationsRequises: [fd.get("certif")],
    };

    try {
      const url = editMode && requestToEdit 
        ? `${API_BASE_URL}/api/buy-requests/edit/${requestToEdit._id}` 
        : `${API_BASE_URL}/api/buy-requests/add`;
      
      await axios[editMode ? "put" : "post"](url, payload);
      onSuccess && onSuccess();
    } catch (err) { 
      console.error(err); 
      alert("Erreur lors de la validation du formulaire"); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="container py-4 fade-in">
        <form onSubmit={handleSubmit}>
          {/* 1. TRAÇABILITÉ & PRODUCTION */}
          <h2 style={styles.subTitle}><Globe size={18}/> 1. Origine & Traçabilité Souhaitée</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Campagne</label>
                <input name="campagne" style={styles.input} defaultValue={requestToEdit?.traceability?.campagneOleicole} placeholder="2024/2025" />
              </div>
              <div>
                <label style={styles.label}>Type de Récolte</label>
                <select name="typeRecolte" style={styles.select} defaultValue={requestToEdit?.traceability?.typeRecolte || "Indifférent"}>
                  <option value="Indifférent">Indifférent</option>
                  <option value="Manuelle">Manuelle</option>
                  <option value="Récolte par gaule (bâtonnage)">Récolte par gaule (bâtonnage)</option>
                  <option value="Récolte mécanique par vibreur">Vibreur de tronc</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Extraction</label>
                <select name="methodeExtraction" style={styles.select} defaultValue={requestToEdit?.traceability?.methodeExtraction || "Indifférent"}>
                  <option value="Indifférent">Indifférent</option>
                  <option value="À froid">À froid</option>
                  <option value="Traditionnelle">Traditionnelle</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Stabilité Rancimat</label>
                <select name="stabilite" style={styles.select} defaultValue={requestToEdit?.traceability?.stabiliteRancimatMin || "Indifférent"}>
                  <option value="Indifférent">Indifférent</option>
                  <option value="8 à 15 h">Min 8-15 h (Bonne)</option>
                  <option value="+15 h">Min +15 h (Excellente)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. ANALYSES COI */}
          <h2 style={styles.subTitle}><Beaker size={18}/> 2. Seuils Qualité & Panel Test</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Classification</label>
                <select name="classification" style={styles.select} defaultValue={requestToEdit?.physicoChimique?.classification} required>
                  <option value="Vierge Extra">Vierge Extra (EVOO)</option>
                  <option value="Vierge">Vierge (VOO)</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Variété</label>
                <select name="variety" style={styles.select} defaultValue={requestToEdit?.physicoChimique?.variety} required>
                  <option value="Chemlali">Chemlali</option>
                  <option value="Chetoui">Chetoui</option>
                  <option value="Oueslati">Oueslati</option>
                  <option value="Koroneiki">Koroneiki</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Acidité Max (%)</label>
                <input name="acidite" type="number" step="0.01" style={styles.input} defaultValue={requestToEdit?.physicoChimique?.aciditeLibreMax} placeholder="0.8" />
              </div>
              <div>
                <label style={styles.label}>Médiane Fruité Min</label>
                <input name="fruiteMin" type="number" step="0.1" style={styles.input} defaultValue={requestToEdit?.organoleptique?.medianeFruiteMin} />
              </div>
              <div>
                <label style={styles.label}>Attribut Positif Cible</label>
                <select name="attributPositif" style={styles.select} defaultValue={requestToEdit?.organoleptique?.attributsPositifsSouhaites?.[0]}>
                  <option value="Fruité vert intense">Fruité vert intense</option>
                  <option value="Fruité mûr léger">Fruité mûr léger</option>
                  <option value="Huile équilibrée">Huile équilibrée</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. PURETÉ & SÉCURITÉ */}
          <h2 style={styles.subTitle}><Microscope size={18}/> 3. Pureté, Sécurité & Contaminants</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Alkyl Esters Max</label>
                <input name="alkyl" type="number" style={styles.input} defaultValue={requestToEdit?.purete?.alkylEstersMax} placeholder="75" />
              </div>
              <div>
                <label style={styles.label}>Acide Oléique Min (%)</label>
                <input name="oleique" type="number" style={styles.input} defaultValue={requestToEdit?.purete?.acideOleiqueMin} placeholder="55" />
              </div>
              <div>
                <label style={styles.label}>K232 Max</label>
                <input name="k232" type="number" step="0.01" style={styles.input} defaultValue={requestToEdit?.physicoChimique?.absorbanceUV?.k232Max} />
              </div>
            </div>
          </div>

          {/* 4. LOGISTIQUE & CERTIFICATIONS */}
          <h2 style={styles.subTitle}><Truck size={18}/> 4. Logistique, Incoterms & Certifs</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Volume (L)</label>
                <input name="quantity" type="number" style={styles.input} defaultValue={requestToEdit?.logistique?.quantityNeeded} required />
              </div>
              <div>
                <label style={styles.label}>Budget (€/L)</label>
                <input name="price" type="number" step="0.01" style={styles.input} defaultValue={requestToEdit?.logistique?.targetPrice} />
              </div>
              <div>
                <label style={styles.label}>Incoterm Souhaité</label>
                <select name="incoterm" style={styles.select} defaultValue={requestToEdit?.logistique?.incotermSouhaite}>
                  <option value="FOB">FOB (Franco Bord)</option>
                  <option value="CIF">CIF (Cout, Assu, Fret)</option>
                  <option value="DDP">DDP (Rendu droits acquittés)</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Port de Destination</label>
                <select name="port" style={styles.select} defaultValue={requestToEdit?.logistique?.destinationPort}>
                  <option value="Radès">Radès</option>
                  <option value="Sfax">Sfax</option>
                  <option value="Sousse">Sousse</option>
                </select>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-4 pb-5">
             <button type="submit" className="btn btn-dark px-5 py-3 rounded-0 fw-bold" disabled={isSubmitting}>
               {isSubmitting ? "ENREGISTREMENT..." : (editMode ? "METTRE À JOUR LE CAHIER DES CHARGES" : "PUBLIER L'APPEL D'OFFRE EXPORT")}
             </button>
          </div>
        </form>
    </div>
  );
};

export default PublishBuyRequest;