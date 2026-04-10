import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useInventory } from "./useInventory"; // Utilisé uniquement pour le refresh et products
import ProductList from "./ProductList";

const styles = {
  headerTitle: {
    fontFamily: "serif",
    fontSize: "2.5rem",
    fontWeight: "300" as const,
    color: "#000",
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
    borderRadius: "0",
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
    borderRadius: "0",
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
    borderRadius: "0",
    padding: "2rem",
    marginBottom: "2rem",
    backgroundColor: "#fff",
  },
  badge: {
    fontSize: "0.6rem",
    padding: "5px 12px",
    border: "1px solid #000",
    borderRadius: "20px",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    fontWeight: "bold" as const,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "20px",
  },
  uploadSection: {
    backgroundColor: "#fcfcfc",
    border: "1px dashed #ccc",
    padding: "15px",
    marginTop: "10px",
    textAlign: "center" as const,
  },
  uploadLink: {
    fontSize: "0.65rem",
    fontWeight: "bold" as const,
    cursor: "pointer",
    color: "#000",
    textDecoration: "underline",
  },
  fileName: {
    fontSize: "0.7rem",
    color: "#2ecc71",
    marginTop: "5px",
    display: "block",
    fontWeight: "600",
  },
};

const InventoryView = () => {
  const [view, setView] = useState<"list" | "add">("list");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});

  const sellerId = useSelector((state: RootState) => state.user.id);
  const { products, isLoading, refresh } = useInventory(sellerId);

  // --- LOGIQUE DE GESTION DES FICHIERS ---
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    if (e.target.files && e.target.files[0]) {
      setFileNames((prev) => ({
        ...prev,
        [fieldName]: e.target.files![0].name,
      }));
    }
  };

  // --- FONCTION DE SAUVEGARDE (POST) ---
  const saveProduct = async (payload: any) => {
    const response = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Échec de l'enregistrement");
    return response.json();
  };

  // --- FONCTION DE MISE À JOUR (PUT) ---
  const updateProduct = async (productId: string, payload: any) => {
    const response = await fetch(
      `http://localhost:5000/api/products/edit/${productId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) throw new Error("Échec de la mise à jour");
    return response.json();
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setFileNames({});
    setMessage(null);
    setView("add");
    window.scrollTo(0, 0);
  };

  const handleCancel = () => {
    setSelectedProduct(null);
    setFileNames({});
    setMessage(null);
    setView("list");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    // Mapping complet vers le modèle Mongoose
    const payload = {
      sellerId,
      traceability: {
        campagneOleicole: formData.get("campagne"),
        lotNumber: formData.get("lotNumber"),
        dateRecolte: formData.get("dateRecolte"),
        dateExtraction: formData.get("dateExtraction"),
        methodeExtraction: formData.get("methodeExtraction"),
        typeRecolte: formData.get("typeRecolte"),
        typeIrrigation: formData.get("typeIrrigation"),
        stockage: [formData.get("stockage")], // Array exigé par le schéma
        stabiliteRancimat: formData.get("stabilite"),
      },
      physicoChimique: {
        variety: formData.get("variety"),
        classification: formData.get("classification"),
        aciditeLibre: Number(formData.get("acidite")),
        indicePeroxyde: Number(formData.get("peroxyde")),
        absorbanceUV: {
          k232: Number(formData.get("k232")),
          k270: Number(formData.get("k270")),
        },
        humiditeMatieresVolatiles: Number(formData.get("humidite")),
      },
      purete: {
        // Envoi en String (pour accepter les symboles < et ≥)
        erythrodiolUvaol: formData.get("erythrodiol"),
        ciresWaxes: formData.get("cires"),
        alkylEsters: formData.get("alkylEsters"),
        ethylEstersFAEE: formData.get("ethylEsters"),
        acideOleique: Number(formData.get("oleic")),
        sterolsTotaux: Number(formData.get("sterols")),
      },
      securite: {
        microbiologie: {
          levuresMoisissures: formData.get("levures"),
          salmonella: formData.get("salmonella"),
          eColi: formData.get("ecoli"),
        },
      },
      logistique: {
        totalQuantity: Number(formData.get("quantity")),
        price: Number(formData.get("price")),
        packagingType: formData.get("packaging"),
      },
    };

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct._id, payload);
        setMessage({
          type: "success",
          text: "Mise à jour réussie avec succès !",
        });
      } else {
        await saveProduct(payload);
        setMessage({
          type: "success",
          text: "Le nouveau lot a été enregistré avec succès !",
        });
      }

      refresh();
      setTimeout(() => handleCancel(), 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Une erreur est survenue lors de l'opération. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-5" style={{ maxWidth: "1100px" }}>
      <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
        <div>
          <span style={styles.label}>Plateforme Vendeur</span>
          <h1 style={styles.headerTitle}>Stock & Produits</h1>
        </div>
        <div className="d-flex gap-4">
          <button
            onClick={handleCancel}
            className="btn btn-link text-decoration-none p-0"
            style={{
              ...styles.label,
              color: view === "list" ? "#000" : "#ccc",
            }}
          >
            Inventaire ({products.length})
          </button>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setFileNames({});
              setView("add");
            }}
            className="btn btn-link text-decoration-none p-0"
            style={{
              ...styles.label,
              color: view === "add" && !selectedProduct ? "#000" : "#ccc",
            }}
          >
            + Ajouter un lot
          </button>
        </div>
      </header>

      {message && (
        <div
          className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} rounded-0 mb-4`}
          style={styles.label}
        >
          {message.text}
        </div>
      )}

      {view === "list" ? (
        <ProductList
          products={products}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      ) : (
        <form className="fade-in pb-5" onSubmit={handleSubmit}>
          <h2 style={styles.subTitle}>
            {selectedProduct
              ? `Édition du lot : ${selectedProduct.traceability?.lotNumber}`
              : "1. Traçabilité & Extraction"}
          </h2>

          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Campagne Oléicole</label>
                <input
                  name="campagne"
                  style={styles.input}
                  defaultValue={selectedProduct?.traceability?.campagneOleicole}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Numéro de lot</label>
                <input
                  name="lotNumber"
                  style={styles.input}
                  defaultValue={selectedProduct?.traceability?.lotNumber}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Date de récolte</label>
                <input
                  name="dateRecolte"
                  type="date"
                  style={styles.input}
                  defaultValue={
                    selectedProduct?.traceability?.dateRecolte?.split("T")[0]
                  }
                />
              </div>
              <div>
                <label style={styles.label}>Extraction</label>
                <select
                  name="methodeExtraction"
                  style={styles.select}
                  defaultValue={
                    selectedProduct?.traceability?.methodeExtraction
                  }
                >
                  <option value="À froid">À froid</option>
                  <option value="2 phases">2 phases</option>
                  <option value="3 phases">3 phases</option>
                  <option value="Traditionnelle">Traditionnelle</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Type Récolte</label>
                <select
                  name="typeRecolte"
                  style={styles.select}
                  defaultValue={selectedProduct?.traceability?.typeRecolte}
                >
                  <option value="Manuelle">Manuelle</option>
                  <option value="Gaule">Gaule</option>
                  <option value="Mécanique">Mécanique</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Irrigation</label>
                <select
                  name="typeIrrigation"
                  style={styles.select}
                  defaultValue={selectedProduct?.traceability?.typeIrrigation}
                >
                  <option value="Sec">Sec</option>
                  <option value="Goutte-à-goutte">Goutte-à-goutte</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Stockage</label>
                <select
                  name="stockage"
                  style={styles.select}
                  defaultValue={selectedProduct?.traceability?.stockage?.[0]}
                >
                  <option value="Récipients Inox">Récipients Inox</option>
                  <option value="Verre foncé">Verre foncé</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Stabilité (Rancimat)</label>
                <select
                  name="stabilite"
                  style={styles.select}
                  defaultValue={
                    selectedProduct?.traceability?.stabiliteRancimat
                  }
                >
                  <option value="5 à 8 h : stabilité moyenne">5 à 8 h : stabilité moyenne</option>
                  <option value="8 à 15 h : bonne stabilité">8 à 15 h : bonne stabilité</option>
                  <option value="+15 h : excellente stabilité">+15 h : excellente stabilité</option>
                </select>
              </div>
            </div>
            <div style={styles.uploadSection}>
              <label style={styles.uploadLink}>
                 JOINDRE BULLETIN (TRAÇABILITÉ/STABILITÉ)
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "traca")}
                />
              </label>
              {fileNames["traca"] && (
                <span style={styles.fileName}>✓ {fileNames["traca"]}</span>
              )}
            </div>
          </div>

          <h2 style={styles.subTitle}>
            2. Analyses Physico-chimiques Obligatoires
          </h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Variété</label>
                <select
                  name="variety"
                  style={styles.select}
                  defaultValue={selectedProduct?.physicoChimique?.variety}
                >
                  <option value="Chemlali">Chemlali</option>
                  <option value="Chetoui">Chetoui</option>
                  <option value="Oueslati">Oueslati</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Classification</label>
                <select
                  name="classification"
                  style={styles.select}
                  defaultValue={
                    selectedProduct?.physicoChimique?.classification
                  }
                >
                  <option value="Vierge Extra">Vierge Extra</option>
                  <option value="Vierge">Vierge</option>
                  <option value="Lampante">Lampante</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Acidité (%)</label>
                <input
                  name="acidite"
                  type="number"
                  step="0.01"
                  style={styles.input}
                  defaultValue={selectedProduct?.physicoChimique?.aciditeLibre}
                />
              </div>
              <div>
                <label style={styles.label}>Indice Peroxyde</label>
                <input
                  name="peroxyde"
                  type="number"
                  style={styles.input}
                  defaultValue={
                    selectedProduct?.physicoChimique?.indicePeroxyde
                  }
                />
              </div>
              <div>
                <label style={styles.label}>K232</label>
                <input
                  name="k232"
                  type="number"
                  step="0.001"
                  style={styles.input}
                  defaultValue={
                    selectedProduct?.physicoChimique?.absorbanceUV?.k232
                  }
                />
              </div>
              <div>
                <label style={styles.label}>K270</label>
                <input
                  name="k270"
                  type="number"
                  step="0.001"
                  style={styles.input}
                  defaultValue={
                    selectedProduct?.physicoChimique?.absorbanceUV?.k270
                  }
                />
              </div>
            </div>
            <div style={styles.uploadSection}>
              <label style={styles.uploadLink}>
                 JOINDRE BULLETIN PHYSICO-CHIMIQUE
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "physico")}
                />
              </label>
              {fileNames["physico"] && (
                <span style={styles.fileName}>✓ {fileNames["physico"]}</span>
              )}
            </div>
          </div>

          <h2 style={styles.subTitle}>3. Pureté & Analyses Anti-Fraude</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Erythrodiol + Uvaol</label>
                <select
                  name="erythrodiol"
                  style={styles.select}
                  defaultValue={selectedProduct?.purete?.erythrodiolUvaol}
                >
                  <option value="< 3.5 %">&lt; 3.5 %</option>
                  <option value="≥ 3.5 %">&ge; 3.5 %</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Cires (Waxes)</label>
                <select
                  name="cires"
                  style={styles.select}
                  defaultValue={selectedProduct?.purete?.ciresWaxes}
                >
                  <option value="≤ 250 mg/kg">&le; 250 mg/kg</option>
                  <option value="> 250 mg/kg">&gt; 250 mg/kg</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Alkyl Esters</label>
                <select
                  name="alkylEsters"
                  style={styles.select}
                  defaultValue={selectedProduct?.purete?.alkylEsters}
                >
                  <option value="Qualité Supérieure (< 75 mg/kg)">Qualité Supérieure (&lt; 75 mg/kg)</option>
                  <option value="Standard (< 150 mg/kg)">Standard (&lt; 150 mg/kg)</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Éthyl esters (FAEE)</label>
                <select
                  name="ethylEsters"
                  style={styles.select}
                  defaultValue={selectedProduct?.purete?.ethylEstersFAEE}
                >
                  <option value="≤ 35 mg/kg">&le; 35 mg/kg</option>
                  <option value="> 35 mg/kg">&gt; 35 mg/kg</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Acide Oléique %</label>
                <input
                  name="oleic"
                  type="number"
                  step="0.1"
                  style={styles.input}
                  defaultValue={selectedProduct?.purete?.acideOleique}
                />
              </div>
              <div>
                <label style={styles.label}>Stérols Totaux</label>
                <input
                  name="sterols"
                  type="number"
                  style={styles.input}
                  defaultValue={selectedProduct?.purete?.sterolsTotaux}
                />
              </div>
            </div>
            <div style={styles.uploadSection}>
              <label style={styles.uploadLink}>
                 JOINDRE BULLETIN DE PURETÉ
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "purete")}
                />
              </label>
              {fileNames["purete"] && (
                <span style={styles.fileName}>✓ {fileNames["purete"]}</span>
              )}
            </div>
          </div>

          <h2 style={styles.subTitle}>4. Sécurité & Microbiologie</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Levures / Moisissures</label>
                <input
                  name="levures"
                  style={styles.input}
                  defaultValue={
                    selectedProduct?.securite?.microbiologie?.levuresMoisissures
                  }
                  placeholder="Absence"
                />
              </div>
              <div>
                <label style={styles.label}>Salmonella</label>
                <input
                  name="salmonella"
                  style={styles.input}
                  defaultValue={
                    selectedProduct?.securite?.microbiologie?.salmonella
                  }
                  placeholder="Absence"
                />
              </div>
              <div>
                <label style={styles.label}>E. coli</label>
                <input
                  name="ecoli"
                  style={styles.input}
                  defaultValue={selectedProduct?.securite?.microbiologie?.eColi}
                  placeholder="Absence"
                />
              </div>
            </div>
            <div style={styles.uploadSection}>
              <label style={styles.uploadLink}>
                 JOINDRE ANALYSES MICROBIO
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "microbio")}
                />
              </label>
              {fileNames["microbio"] && (
                <span style={styles.fileName}>✓ {fileNames["microbio"]}</span>
              )}
            </div>
          </div>

          <h2 style={styles.subTitle}>5. Logistique & Export</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Quantité (Litres)</label>
                <input
                  name="quantity"
                  type="number"
                  style={styles.input}
                  defaultValue={selectedProduct?.logistique?.totalQuantity}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Prix (&euro;/Litre)</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  style={styles.input}
                  defaultValue={selectedProduct?.logistique?.price}
                  required
                />
              </div>
              <div>
                <label style={styles.label}>Conditionnement</label>
                <select
                  name="packaging"
                  style={styles.select}
                  defaultValue={selectedProduct?.logistique?.packagingType}
                >
                  <option value="Vrac">Vrac</option>
                  <option value="Semi Vrac">Semi Vrac</option>
                  <option value="Bouteilles">Bouteilles</option>
                </select>
              </div>
            </div>
            <div className="row g-2 mt-2">
              {["Origine", "Bio", "Tech", "Sanitaire"].map((item) => (
                <div className="col-md-3" key={item}>
                  <div style={styles.uploadSection}>
                    <label style={styles.uploadLink}>
                      📎 CERTIF. {item.toUpperCase()}
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, item)}
                      />
                    </label>
                    {fileNames[item] && (
                      <span style={styles.fileName}>✓ {fileNames[item]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 style={styles.subTitle}>6. Normes & Certifications</h2>
          <div style={styles.card}>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {["ISO 22000", "HACCP", "BIO EU", "HALAL", "FDA"].map((c) => (
                <span
                  key={c}
                  style={{
                    ...styles.badge,
                    backgroundColor: selectedProduct?.certifications?.some((cert: any) => cert.type === c)
                      ? "#000"
                      : "transparent",
                    color: selectedProduct?.certifications?.some((cert: any) => cert.type === c)
                      ? "#fff"
                      : "#000",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="d-flex justify-content-end gap-3 mt-5">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-link text-dark text-decoration-none"
              style={styles.label}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-dark px-5"
              style={{ ...styles.label, color: "#fff", borderRadius: 0 }}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Chargement..."
                : selectedProduct
                  ? "Mettre à jour le lot"
                  : "Enregistrer le lot"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default InventoryView;