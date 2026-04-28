import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useInventory } from "./useInventory";
import ProductList from "./ProductList";
import {
  FileText,
  Upload,
  ChevronLeft,
  CheckCircle,
  Globe,
  ShieldCheck,
  Package,
  Microscope,
  Camera,
  Beaker,
  Award,
  Thermometer,
  Droplet,
  FlaskConical,
  ClipboardCheck,
  Info,
  Truck,
  Zap,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { API_BASE_URL } from "../../config/api";

// --- 1. LOGIQUE DE STYLE DES STATUTS ---
const getStatusStyle = (status: string): React.CSSProperties => {
  switch (status) {
    case "Validé":
    case "Disponible":
      return {
        backgroundColor: "#f6fff8",
        color: "#2ecc71",
        borderColor: "#2ecc71",
      };
    case "Rejeté":
      return {
        backgroundColor: "#fff5f5",
        color: "#e74c3c",
        borderColor: "#e74c3c",
      };
    case "Vendu":
      return {
        backgroundColor: "#f4f4f4",
        color: "#7f8c8d",
        borderColor: "#7f8c8d",
      };
    default:
      return {
        backgroundColor: "#fffdf0",
        color: "#f1c40f",
        borderColor: "#f1c40f",
      };
  }
};

const styles = {
  headerTitle: {
    fontFamily: "serif",
    fontSize: "2.5rem",
    fontWeight: "300" as const,
    color: "#000",
  },
  label: {
    fontSize: "0.65rem",
    textTransform: "uppercase" as const,
    letterSpacing: "1.5px",
    color: "#999",
    fontWeight: "600",
    display: "block",
    marginBottom: "8px",
  },
  input: {
    border: "none",
    borderBottom: "1px solid #e0e0e0",
    padding: "10px 0",
    fontSize: "0.9rem",
    width: "100%",
    outline: "none",
    backgroundColor: "transparent",
    marginBottom: "20px",
  },
  select: {
    border: "none",
    borderBottom: "1px solid #e0e0e0",
    padding: "10px 0",
    fontSize: "0.9rem",
    width: "100%",
    outline: "none",
    backgroundColor: "transparent",
    marginBottom: "20px",
    appearance: "none" as const,
  },
  card: {
    border: "1px solid #f2f2f2",
    padding: "2rem",
    marginBottom: "2rem",
    backgroundColor: "#fff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "25px",
  },
  subTitle: {
    fontFamily: "serif",
    fontSize: "1.1rem",
    marginBottom: "1.5rem",
    marginTop: "2.5rem",
    color: "#000",
    borderBottom: "1px solid #000",
    paddingBottom: "8px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  uploadSection: {
    backgroundColor: "#fcfcfc",
    border: "1px dashed #ccc",
    padding: "15px",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    minHeight: "100px",
    justifyContent: "center",
  },
  uploadLink: {
    fontSize: "0.6rem",
    fontWeight: "bold" as const,
    cursor: "pointer",
    color: "#000",
    textDecoration: "underline",
    textTransform: "uppercase" as const,
  },
};

const InventoryView = () => {
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = reduxUser?.role === "admin";
  const sellerId = reduxUser?.id || reduxUser?._id;

  const [view, setView] = useState<"list" | "form">("list");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
        temperature: "14-18 °C",
        recipients: "Récipients en Inox",
        conditions: [],
      },
      fileUrlTraceabilite: "",
    },
    physicoChimique: {
      variety: "Chemlali",
      classification: "Vierge Extra",
      aciditeLibre: "",
      indicePeroxyde: "",
      absorbanceUV: { k232: "", k270: "", deltaK: "" },
      humiditeMatieresVolatiles: "",
      impuretesInsolubles: "",
      fileUrlAnalyse: "",
    },
    organoleptique: {
      medianeDefauts: 0,
      medianeFruite: "",
      attributsNegatifs: [],
      attributsPositifs: [],
      fileUrlPanelTest: "",
    },
    purete: {
      acidesGras: { oleique: "", linoleique: "", palmitique: "" },
      sterols: { totaux: "", betaSitosterol: "" },
      erythrodiolUvaol: "",
      ciresWaxes: "",
      alkylEsters: "",
      ethylEstersFAEE: "",
      pointFumee: "",
      polyphenolsTotaux: "150-350 mg/kg",
      tocopherols: "",
      fileUrlPurete: "",
    },
    securite: {
      pesticides: false,
      metauxLourds: [],
      contaminants: [],
      microbiologie: { levuresMoisissures: "", salmonella: "", eColi: "" },
      fileUrlSecurite: "",
    },
    logistique: {
      packagingType: "Bouteilles",
      packagingDetail: "",
      totalQuantity: "",
      moq: 0,
      price: "",
      currency: "EUR",
      incoterm: "EXW",
      port: "Radès",
      photosProduit: [],
    },
    documentsExport: {
      certificatOrigine: "",
      certificatBio: "",
      certificatSanitaire: "",
      certificatPhytosanitaire: "",
      coa: "",
      ficheTechnique: "",
      ficheSecurite: "",
      analyseMigrationEmballage: "",
    },
    verification: { isSellerVerified: false, isAnalysisValidated: false },
    certifications: [],
    recompenses: [],
  };

  const [formData, setFormData] = useState<any>(initialFormState);
  const { products, isLoading, refresh } = useInventory(
    isAdmin ? "all" : sellerId || "",
  );

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldPath: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        updateNestedState(fieldPath, reader.result as string);
      };
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    updateNestedState(name, val);
  };

  const updateNestedState = (path: string, value: any) => {
    const keys = path.split(".");
    setFormData((prev: any) => {
      let newData = { ...prev };
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = formData._id
        ? `${API_BASE_URL}/api/products/edit/${formData._id}`
        : `${API_BASE_URL}/api/products/add`;
      const response = await fetch(url, {
        method: formData._id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
      setMessage({ type: "success", text: "Lot synchronisé avec succès" });
      refresh();
      setTimeout(() => {
        setView("list");
        setMessage(null);
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };
  const toggleAttribute = (path: string, value: string) => {
    const currentAttributes = path
      .split(".")
      .reduce((obj, key) => obj[key], formData) as string[];
    const newAttributes = currentAttributes.includes(value)
      ? currentAttributes.filter((item) => item !== value)
      : [...currentAttributes, value];

    updateNestedState(path, newAttributes);
  };
  return (
    <section className="container py-5" style={{ maxWidth: "1200px" }}>
      {/* HEADER TABS */}
      <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
        <div>
          <span style={styles.label}>
            {isAdmin ? "Dashboard Admin" : "Producteur Olive Tn"}
          </span>
          <h1 style={styles.headerTitle}>
            {isAdmin ? "Certification Marché" : "Mon Inventaire"}
          </h1>
        </div>
        <div className="d-flex gap-4">
          <button
            onClick={() => setView("list")}
            className="btn btn-link text-decoration-none p-0"
            style={{
              ...styles.label,
              color: view === "list" ? "#000" : "#ccc",
              borderBottom: view === "list" ? "2px solid #000" : "none",
            }}
          >
            Liste des Lots
          </button>
          {!isAdmin && (
            <button
              onClick={() => {
                setFormData(initialFormState);
                setView("form");
              }}
              className="btn btn-link text-decoration-none p-0"
              style={{
                ...styles.label,
                color: view === "form" ? "#000" : "#ccc",
                borderBottom: view === "form" ? "2px solid #000" : "none",
              }}
            >
              + Nouveau Lot
            </button>
          )}
        </div>
      </header>

      {message && (
        <div
          className={`alert alert-${message.type === "success" ? "success" : "danger"} rounded-0 mb-4`}
        >
          {message.text}
        </div>
      )}

      {view === "list" ? (
        <ProductList
          products={products}
          isLoading={isLoading}
          onEdit={(p) => {
            setFormData(p);
            setView("form");
          }}
          getStatusStyle={getStatusStyle}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <div
            className="mb-4 d-flex align-items-center"
            style={{ cursor: "pointer" }}
            onClick={() => setView("list")}
          >
            <ChevronLeft size={16} />{" "}
            <span style={styles.label} className="ms-2 mb-0">
              Annuler et retour
            </span>
          </div>

          {/* 1. TRAÇABILITÉ & RÉCOLTE */}
          <h2 style={styles.subTitle}>
            <Globe size={18} /> 1. Traçabilité & Récolte
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Campagne Oléicole</label>
                <input
                  name="traceability.campagneOleicole"
                  value={formData.traceability.campagneOleicole}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  placeholder="ex: 2024/2025"
                />
              </div>
              <div>
                <label style={styles.label}>N° Lot</label>
                <input
                  name="traceability.lotNumber"
                  value={formData.traceability.lotNumber}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Date de Récolte</label>
                <input
                  name="traceability.dateRecolte"
                  type="date"
                  value={formData.traceability.dateRecolte?.split("T")[0]}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Date d'Extraction</label>
                <input
                  name="traceability.dateExtraction"
                  type="date"
                  value={formData.traceability.dateExtraction?.split("T")[0]}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Type de Récolte</label>
                <select
                  name="traceability.typeRecolte"
                  value={formData.traceability.typeRecolte}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Manuelle">Manuelle</option>
                  <option value="Récolte par gaule (bâtonnage)">
                    Récolte par gaule
                  </option>
                  <option value="Récolte avec filets au sol">
                    Filets au sol
                  </option>
                  <option value="Récolte mécanique avec peignes ou vibreurs portatifs">
                    Vibreurs portatifs
                  </option>
                  <option value="Récolte mécanique par vibreur de tronc">
                    Vibreur de tronc
                  </option>
                  <option value="Récolte entièrement mécanisée (oliveraies intensives)">
                    Entièrement mécanisée
                  </option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Méthode d'Extraction</label>
                <select
                  name="traceability.methodeExtraction"
                  value={formData.traceability.methodeExtraction}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="À froid">À froid</option>
                  <option value="Traditionnelle">Traditionnelle</option>
                  <option value="Presse hydraulique">Presse hydraulique</option>
                  <option value="2 phases">2 phases</option>
                  <option value="3 phases">3 phases</option>
                  <option value="Assistée">Assistée</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Irrigation</label>
                <select
                  name="traceability.typeIrrigation"
                  value={formData.traceability.typeIrrigation}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {[
                    "Sec",
                    "Complémentaire",
                    "Gravitaire",
                    "Aspersion",
                    "Goutte-à-goutte",
                    "Enterrée",
                  ].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Filtration</label>
                <select
                  name="traceability.filtration"
                  value={formData.traceability.filtration}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Filtrée">Filtrée</option>
                  <option value="Non filtrée">Non filtrée (En décanter)</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>
                  Indice de stabilité (Rancimat)
                </label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    name="purete.stabiliteRancimat"
                    type="number"
                    step="0.1"
                    value={formData.purete.stabiliteRancimat}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="ex: 12.5"
                  />
                  <span className="small fw-bold">heures</span>
                </div>
              </div>
              {/* AFFICHAGE DYNAMIQUE DU LABEL DE STABILITÉ */}
              {formData.purete.stabiliteRancimat > 0 && (
                <div
                  className="mt-2 p-2 d-inline-block border"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Statut :{" "}
                  {formData.purete.stabiliteRancimat < 8
                    ? "Stabilité Moyenne"
                    : formData.purete.stabiliteRancimat <= 15
                      ? "Bonne Stabilité"
                      : "Excellente Stabilité"}
                </div>
              )}
              <div>
                <label style={styles.label}>Conservation</label>
                <select
                  name="traceability.dureeConservation"
                  value={formData.traceability.dureeConservation}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {[
                    "2 à 6 mois",
                    "12 à 18 mois",
                    "18 à 24 mois",
                    "24 mois",
                  ].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-4">
                <label style={styles.label}>
                  <Thermometer size={14} className="me-1" /> Récipients de
                  Stockage
                </label>
                <select
                  name="traceability.stockage.recipients"
                  value={formData.traceability.stockage.recipients}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {[
                    "Récipients en Inox",
                    "Récipients en Verre foncé",
                    "Citernes souples",
                    "IBC",
                  ].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label style={styles.label}>Température</label>
                <input
                  name="traceability.stockage.temperature"
                  value={formData.traceability.stockage.temperature}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="14-18 °C"
                />
              </div>
              <div className="col-md-6">
                <div style={styles.uploadSection}>
                  {formData.traceability.fileUrlTraceabilite ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <Upload size={20} className="opacity-30" />
                  )}
                  <label style={styles.uploadLink} className="mt-2">
                    Certificat de Traçabilité (Upload)
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleFileChange(e, "traceability.fileUrlTraceabilite")
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. ANALYSES PHYSICO-CHIMIQUES */}
          <h2 style={styles.subTitle}>
            <Microscope size={18} /> 2. Analyses Physico-Chimiques (COI)
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Variété</label>
                <select
                  name="physicoChimique.variety"
                  value={formData.physicoChimique.variety}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {[
                    "Chemlali",
                    "Chetoui",
                    "Oueslati",
                    "Zarrazi",
                    "Chemchali",
                    "Koroneiki",
                    "Sayali / Tounsi",
                    "Frantoio",
                    "Leccino",
                    "Coratina",
                    "Arbequina",
                    "Arbosana",
                    "Picual",
                    "Picholine",
                    "Aglandau",
                  ].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Classification</label>
                <select
                  name="physicoChimique.classification"
                  value={formData.physicoChimique.classification}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Vierge Extra">Vierge Extra</option>
                  <option value="Vierge">Vierge</option>
                  <option value="Lampante">Lampante</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Acidité Libre (%)</label>
                <input
                  name="physicoChimique.aciditeLibre"
                  type="number"
                  step="0.01"
                  value={formData.physicoChimique.aciditeLibre}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Indice Peroxyde</label>
                <input
                  name="physicoChimique.indicePeroxyde"
                  type="number"
                  value={formData.physicoChimique.indicePeroxyde}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>K232 / K270 / ΔK</label>
                <div className="d-flex gap-2">
                  <input
                    name="physicoChimique.absorbanceUV.k232"
                    type="number"
                    step="0.001"
                    value={formData.physicoChimique.absorbanceUV.k232}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="K232"
                  />
                  <input
                    name="physicoChimique.absorbanceUV.k270"
                    type="number"
                    step="0.001"
                    value={formData.physicoChimique.absorbanceUV.k270}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="K270"
                  />
                  <input
                    name="physicoChimique.absorbanceUV.deltaK"
                    type="number"
                    step="0.001"
                    value={formData.physicoChimique.absorbanceUV.deltaK}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="ΔK"
                  />
                </div>
              </div>
              <div style={styles.uploadSection}>
                {formData.physicoChimique.fileUrlAnalyse ? (
                  <CheckCircle size={20} className="text-success" />
                ) : (
                  <Beaker size={20} className="opacity-30" />
                )}
                <label style={styles.uploadLink} className="mt-2">
                  Bulletin d'Analyse Officiel
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleFileChange(e, "physicoChimique.fileUrlAnalyse")
                    }
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 3. ANALYSE ORGANOLEPTIQUE (PANEL TEST) */}
          <h2 style={styles.subTitle}>
            <Camera size={18} /> 3. Évaluation Organoleptique (Panel Test)
          </h2>
          <div style={styles.card}>
            <div style={styles.grid} className="mb-4">
              <div>
                <label style={styles.label}>Médiane des Défauts (Md)</label>
                <input
                  name="organoleptique.medianeDefauts"
                  type="number"
                  step="0.1"
                  value={formData.organoleptique.medianeDefauts}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="0"
                />
              </div>
              <div>
                <label style={styles.label}>Médiane du Fruité (Mf)</label>
                <input
                  name="organoleptique.medianeFruite"
                  type="number"
                  step="0.1"
                  value={formData.organoleptique.medianeFruite}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="ex: 3.5"
                />
              </div>
              <div style={styles.uploadSection}>
                {formData.organoleptique.fileUrlPanelTest ? (
                  <CheckCircle size={20} className="text-success" />
                ) : (
                  <Camera size={20} className="opacity-30" />
                )}
                <label style={styles.uploadLink} className="mt-2">
                  Bulletin Panel Test (JPG/PDF)
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleFileChange(e, "organoleptique.fileUrlPanelTest")
                    }
                  />
                </label>
              </div>
            </div>

            {/* ATTRIBUTS NÉGATIFS */}
            <div className="mb-4">
              <label style={styles.label}>
                Attributs Négatifs (Défauts constatés)
              </label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {[
                  "Chômé/lies",
                  "Moisi-humidité-terre",
                  "Vineux - Vinaigré - Acide – Aigre",
                  "Olive gelée (Bois humide)",
                  "Rance",
                  "Métallique",
                  "Foin sec",
                  "Ver",
                  "Grossier",
                  "Saumure",
                  "Cuit ou brûlé",
                  "Margines Sparte",
                  "Concombre",
                  "Lubrifiants",
                ].map((attr) => (
                  <button
                    key={attr}
                    type="button"
                    onClick={() =>
                      toggleAttribute("organoleptique.attributsNegatifs", attr)
                    }
                    className="btn btn-sm rounded-0 border text-uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.5px",
                      backgroundColor:
                        formData.organoleptique.attributsNegatifs.includes(attr)
                          ? "#000"
                          : "#fff",
                      color: formData.organoleptique.attributsNegatifs.includes(
                        attr,
                      )
                        ? "#fff"
                        : "#999",
                      borderColor:
                        formData.organoleptique.attributsNegatifs.includes(attr)
                          ? "#000"
                          : "#eee",
                    }}
                  >
                    {attr}
                  </button>
                ))}
              </div>
            </div>

            {/* ATTRIBUTS POSITIFS */}
            <div>
              <label style={styles.label}>Attributs Positifs (Qualités)</label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {[
                  "Fruité",
                  "Fruité mûr",
                  "Fruité vert",
                  "Fruité léger",
                  "Fruité moyen",
                  "Fruité intense",
                  "Fruité mûr léger",
                  "Fruité mûr moyen",
                  "Fruité mûr intense",
                  "Fruité vert léger",
                  "Fruité vert moyen",
                  "Fruité vert intense",
                  "Amer léger",
                  "Amer moyen",
                  "Amer intense",
                  "Piquant léger",
                  "Piquant moyen",
                  "Piquant intense",
                  "Huile équilibrée",
                  "Huile douce",
                ].map((attr) => (
                  <button
                    key={attr}
                    type="button"
                    onClick={() =>
                      toggleAttribute("organoleptique.attributsPositifs", attr)
                    }
                    className="btn btn-sm rounded-0 border text-uppercase"
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.5px",
                      backgroundColor:
                        formData.organoleptique.attributsPositifs.includes(attr)
                          ? "#2ecc71"
                          : "#fff",
                      color: formData.organoleptique.attributsPositifs.includes(
                        attr,
                      )
                        ? "#fff"
                        : "#999",
                      borderColor:
                        formData.organoleptique.attributsPositifs.includes(attr)
                          ? "#2ecc71"
                          : "#eee",
                    }}
                  >
                    {attr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. PURETÉ & QUALITÉ COMMERCIALE */}
          <h2 style={styles.subTitle}>
            <FlaskConical size={18} /> 3. Pureté & Qualité Commerciale
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              {/* --- GROUPE : ACIDES GRAS --- */}
              <div>
                <label style={styles.label}>Acide Oléique (%)</label>
                <input
                  name="purete.acidesGras.oleique"
                  type="number"
                  step="0.01"
                  value={formData.purete.acidesGras.oleique}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="C18:1"
                />
              </div>
              <div>
                <label style={styles.label}>Acide Linoléique (%)</label>
                <input
                  name="purete.acidesGras.linoleique"
                  type="number"
                  step="0.01"
                  value={formData.purete.acidesGras.linoleique}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="C18:2"
                />
              </div>
              <div>
                <label style={styles.label}>Acide Palmitique (%)</label>
                <input
                  name="purete.acidesGras.palmitique"
                  type="number"
                  step="0.01"
                  value={formData.purete.acidesGras.palmitique}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="C16:0"
                />
              </div>

              {/* --- GROUPE : STÉROLS --- */}
              <div>
                <label style={styles.label}>Stérols Totaux (mg/kg)</label>
                <input
                  name="purete.sterols.totaux"
                  type="number"
                  value={formData.purete.sterols.totaux}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Bêta-Sitostérol (%)</label>
                <input
                  name="purete.sterols.betaSitosterol"
                  type="number"
                  step="0.01"
                  value={formData.purete.sterols.betaSitosterol}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Érythrodiol + Uvaol (%)</label>
                <input
                  name="purete.erythrodiolUvaol"
                  type="number"
                  step="0.01"
                  value={formData.purete.erythrodiolUvaol}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* --- QUALITÉ EXPORT (ESTERS & CIRES) --- */}
              <div>
                <label style={styles.label}>Cires / Waxes (mg/kg)</label>
                <input
                  name="purete.ciresWaxes"
                  type="number"
                  value={formData.purete.ciresWaxes}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Alkyl Esters (mg/kg)</label>
                <input
                  name="purete.alkylEsters"
                  type="number"
                  value={formData.purete.alkylEsters}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Ethyl Esters (FAEE)</label>
                <input
                  name="purete.ethylEstersFAEE"
                  type="number"
                  value={formData.purete.ethylEstersFAEE}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* --- ANALYSES DE STABILITÉ & TOC --- */}
              <div>
                <label style={styles.label}>Polyphénols Totaux</label>
                <select
                  name="purete.polyphenolsTotaux"
                  value={formData.purete.polyphenolsTotaux}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Sélectionner</option>
                  {[
                    "80-150 mg/kg",
                    "150-350 mg/kg",
                    "350-500 mg/kg",
                    "700-1000 mg/kg",
                    "> 1000 mg/kg",
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Tocophérols (Vit. E)</label>
                <select
                  name="purete.tocopherols"
                  value={formData.purete.tocopherols}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Sélectionner</option>
                  <option value="15-22 mg/100 g">15-22 mg/100 g</option>
                  <option value="< 15 mg/100 g">&lt; 15 mg/100 g</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Stabilité Rancimat (h)</label>
                <input
                  name="purete.stabiliteRancimat"
                  type="number"
                  step="0.1"
                  value={formData.purete.stabiliteRancimat}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Indice stabilité"
                />
              </div>

              {/* --- AUTRES --- */}
              <div>
                <label style={styles.label}>Point de Fumée (°C)</label>
                <input
                  name="purete.pointFumee"
                  type="number"
                  value={formData.purete.pointFumee}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              {/* --- UPLOAD --- */}
              <div style={styles.uploadSection}>
                {formData.purete.fileUrlPurete ? (
                  <CheckCircle size={20} className="text-success" />
                ) : (
                  <ClipboardCheck size={20} className="opacity-30" />
                )}
                <label style={styles.uploadLink} className="mt-2">
                  Rapport de Pureté (PDF/IMG)
                  <input
                    type="file"
                    hidden
                    onChange={(e) =>
                      handleFileChange(e, "purete.fileUrlPurete")
                    }
                  />
                </label>
              </div>
            </div>

            {/* Feedback visuel Stabilité */}
            {formData.purete.stabiliteRancimat > 0 && (
              <div
                className="mt-3 p-2 bg-light border-start border-4 border-dark"
                style={{ fontSize: "10px", letterSpacing: "1px" }}
              >
                VERDICT STABILITÉ :{" "}
                <strong>
                  {formData.purete.stabiliteRancimat < 8
                    ? "MOYENNE"
                    : formData.purete.stabiliteRancimat <= 15
                      ? "BONNE"
                      : "EXCELLENTE"}
                </strong>
              </div>
            )}
          </div>

          {/* 4. SÉCURITÉ & CONTAMINANTS (Normes Export) */}
          <h2 style={styles.subTitle}>
            <ShieldAlert size={18} /> 4. Sécurité & Contaminants
          </h2>
          <div style={styles.card}>
            <div className="row">
              <div className="col-md-6 border-end">
                <label style={styles.label}>Résidus Chimiques & Toxines</label>
                <div className="d-flex flex-column gap-2 mt-2">
                  {[
                    {
                      id: "pest",
                      label: "Pesticides (Multi-résidus)",
                      path: "securite.pesticides",
                    },
                    {
                      id: "mosh",
                      label: "Hydrocarbures MOSH / MOAH",
                      path: "securite.contaminants",
                    },
                    {
                      id: "hap",
                      label: "HAP / PAH (Hydrocarbures Aromatiques)",
                      path: "securite.contaminants",
                    },
                    {
                      id: "phta",
                      label: "Plastifiants / Phtalates (DEHP, DBP...)",
                      path: "securite.contaminants",
                    },
                  ].map((item) => (
                    <div key={item.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={item.id}
                      />
                      <label
                        className="form-check-label small fw-bold"
                        htmlFor={item.id}
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-md-6 ps-4">
                <label style={styles.label}>Métaux Lourds (Seuils COI)</label>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    "Plomb (Pb)",
                    "Cadmium (Cd)",
                    "Arsenic (As)",
                    "Mercure (Hg)",
                  ].map((metal) => (
                    <div
                      key={metal}
                      className="d-flex align-items-center gap-2"
                    >
                      <CheckCircle size={14} className="text-success" />
                      <span className="small">{metal}</span>
                    </div>
                  ))}
                </div>
                <div style={styles.uploadSection} className="mt-4">
                  {formData.securite.fileUrlSecurite ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <ShieldCheck size={20} className="opacity-30" />
                  )}
                  <label style={styles.uploadLink} className="mt-2">
                    Bulletin d'Analyse Contaminants (Obligatoire)
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleFileChange(e, "securite.fileUrlSecurite")
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* 5. LOGISTIQUE & COMMERCE */}
          <h2 style={styles.subTitle}>
            <Package size={18} /> 5. Logistique & Commerce
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Type de Packaging</label>
                <select
                  name="logistique.packagingType"
                  value={formData.logistique.packagingType}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="Bouteilles">Bouteilles</option>
                  <option value="Semi Vrac">Semi Vrac</option>
                  <option value="Vrac">Vrac</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Quantité Totale (L)</label>
                <input
                  name="logistique.totalQuantity"
                  type="number"
                  value={formData.logistique.totalQuantity}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Prix Indicatif (€/L)</label>
                <input
                  name="logistique.price"
                  type="number"
                  step="0.01"
                  value={formData.logistique.price}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Incoterm</label>
                <select
                  name="logistique.incoterm"
                  value={formData.logistique.incoterm}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {[
                    "EXW",
                    "FCA",
                    "CPT",
                    "CIP",
                    "DAP",
                    "DPU",
                    "DDP",
                    "FAS",
                    "FOB",
                    "CFR",
                    "CIF",
                  ].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Port de Départ</label>
                <select
                  name="logistique.port"
                  value={formData.logistique.port}
                  onChange={handleChange}
                  style={styles.select}
                >
                  {[
                    "Radès",
                    "La Goulette",
                    "Bizerte",
                    "Sousse",
                    "Sfax",
                    "Gabès",
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 6. DOCUMENTS EXPORT */}
          <h2 style={styles.subTitle}>
            <FileText size={18} /> 6. Certificats & Documents Export
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              {Object.keys(formData.documentsExport).map((doc) => (
                <div key={doc} style={styles.uploadSection}>
                  {formData.documentsExport[doc] ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : (
                    <FileText size={18} className="opacity-30" />
                  )}
                  <label style={styles.uploadLink} className="mt-2">
                    {doc.replace(/([A-Z])/g, " $1").toUpperCase()}
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleFileChange(e, `documentsExport.${doc}`)
                      }
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
          {/* 6. QUALITÉ COMMERCIALE (MARKETING) */}
          <h2 style={styles.subTitle}>
            <Award size={18} /> 6. Arguments Commerciaux & Santé
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Polyphénols Totaux (mg/kg)</label>
                <select
                  name="purete.polyphenolsTotaux"
                  value={formData.purete.polyphenolsTotaux}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="80-150 mg/kg">80-150 mg/kg</option>
                  <option value="150-350 mg/kg">
                    150-350 mg/kg (Standard)
                  </option>
                  <option value="350-500 mg/kg">350-500 mg/kg (Premium)</option>
                  <option value="700-1000 mg/kg">
                    700-1000 mg/kg (Santé+)
                  </option>
                  <option value="> 1000 mg/kg">
                    `{">"}` 1000 mg/kg (Ultra-Premium)
                  </option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Tocophérols (Vitamine E)</label>
                <select
                  name="purete.tocopherols"
                  value={formData.purete.tocopherols}
                  onChange={handleChange}
                  style={styles.select}
                >
                  <option value="">Sélectionner</option>
                  {/* On envoie 18 pour la plage 15-22 et 14 pour < 15 */}
                  <option value={18}>15-22 mg/100 g</option>
                  <option value={14}>&lt; 15 mg/100 g</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Couleur / Aspect</label>
                <input
                  name="purete.couleur"
                  value={formData.purete.couleur}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="ex: Jaune doré avec reflets verts"
                />
              </div>
            </div>
            <div className="mt-4 pt-3 border-top d-flex align-items-center gap-3">
              <Info size={20} className="text-info" />
              <p className="small mb-0 text-muted">
                Ces données seront affichées sur la{" "}
                <strong>Fiche Technique Publique</strong> du lot pour attirer
                les acheteurs internationaux.
              </p>
            </div>
          </div>

          {/* ZONE ADMIN (Système de Confiance) */}
          {isAdmin && (
            <div className="mt-5 p-4 bg-light border-start border-4 border-warning shadow-sm">
              <h3 style={styles.label} className="text-dark">
                Validation Administrative
              </h3>
              <div className="row mt-3">
                <div className="col-md-6">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {[
                      "En attente de validation",
                      "Validé",
                      "Disponible",
                      "Rejeté",
                    ].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 d-flex align-items-center gap-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.verification.isSellerVerified}
                      onChange={(e) =>
                        updateNestedState(
                          "verification.isSellerVerified",
                          e.target.checked,
                        )
                      }
                      id="seller"
                    />
                    <label className="form-check-label small" htmlFor="seller">
                      Vendeur Vérifié
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.verification.isAnalysisValidated}
                      onChange={(e) =>
                        updateNestedState(
                          "verification.isAnalysisValidated",
                          e.target.checked,
                        )
                      }
                      id="analysis"
                    />
                    <label
                      className="form-check-label small"
                      htmlFor="analysis"
                    >
                      Analyses Certifiées
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end gap-3 mt-5 pb-5">
            <button
              type="button"
              onClick={() => setView("list")}
              className="btn btn-link text-dark text-decoration-none"
              style={styles.label}
            >
              Abandonner
            </button>
            <button
              type="submit"
              className="btn btn-dark px-5 py-3 rounded-0 fw-bold shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Traitement..."
                : "Certifier et Enregistrer le Lot"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default InventoryView;
