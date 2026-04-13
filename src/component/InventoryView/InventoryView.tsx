import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useInventory } from "./useInventory"; 
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
  statusFlag: {
    fontSize: "0.55rem",
    padding: "3px 8px",
    letterSpacing: "1px",
    fontWeight: "bold" as const,
    textTransform: "uppercase" as const,
    display: "inline-block",
    border: "1px solid",
    borderRadius: "0px",
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
  adminTag: {
    fontSize: "0.6rem",
    padding: "4px 10px",
    backgroundColor: "#000",
    color: "#fff",
    marginLeft: "15px",
    letterSpacing: "1px",
    fontWeight: "bold" as const,
  },
  adminZone: {
    backgroundColor: "#fcfcfc",
    border: "1px solid #eee",
    padding: "2rem",
    marginTop: "10px",
    borderLeft: "4px solid #000",
  }
};

const InventoryView = () => {
  const [view, setView] = useState<"list" | "add">("list");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fileNames, setFileNames] = useState<{ [key: string]: string }>({});
  
  const [adminDecision, setAdminDecision] = useState<string>("");

  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = reduxUser?.role === "admin";
  const sellerId = reduxUser?.id || reduxUser?._id;

  const { products, isLoading, refresh } = useInventory(isAdmin ? "all" : (sellerId || ""));

  // --- FONCTION DE STYLE POUR LE FLAG (Réutilisable) ---
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Validé":
      case "Disponible":
        return { backgroundColor: "#f6fff8", color: "#2ecc71", borderColor: "#2ecc71" };
      case "Rejeté":
        return { backgroundColor: "#fff5f5", color: "#e74c3c", borderColor: "#e74c3c" };
      case "En attente de validation":
        return { backgroundColor: "#fffdf0", color: "#f1c40f", borderColor: "#f1c40f" };
      default:
        return { backgroundColor: "#f8f9fa", color: "#6c757d", borderColor: "#dee2e6" };
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFileNames((prev) => ({ ...prev, [fieldName]: e.target.files![0].name }));
    }
  };

  const saveProduct = async (payload: any) => {
    const response = await fetch("http://localhost:5000/api/products/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Échec");
    return response.json();
  };

  const updateProduct = async (productId: string, payload: any) => {
    const response = await fetch(`http://localhost:5000/api/products/edit/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error("Échec");
    return response.json();
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setAdminDecision(product.status || "En attente de validation");
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

    const payload = {
      sellerId: selectedProduct ? selectedProduct.sellerId : sellerId,
      status: isAdmin && selectedProduct ? formData.get("adminStatus") : (selectedProduct?.status || "En attente de validation"),
      validationDetails: isAdmin && selectedProduct ? {
        isValidated: formData.get("adminStatus") === "Validé",
        rejectionReason: formData.get("rejectionReason"),
        validatedAt: new Date(),
        validatedBy: sellerId
      } : selectedProduct?.validationDetails,
      traceability: {
        campagneOleicole: formData.get("campagne"),
        lotNumber: formData.get("lotNumber"),
        dateRecolte: formData.get("dateRecolte"),
        dateExtraction: formData.get("dateExtraction"),
        methodeExtraction: formData.get("methodeExtraction"),
        typeRecolte: formData.get("typeRecolte"),
        typeIrrigation: formData.get("typeIrrigation"),
        stockage: [formData.get("stockage")],
        stabiliteRancimat: formData.get("stabilite"),
      },
      physicoChimique: {
        variety: formData.get("variety"),
        classification: formData.get("classification"),
        aciditeLibre: Number(formData.get("acidite")),
        indicePeroxyde: Number(formData.get("peroxyde")),
        absorbanceUV: { k232: Number(formData.get("k232")), k270: Number(formData.get("k270")) },
        humiditeMatieresVolatiles: Number(formData.get("humidite")),
      },
      purete: {
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
        setMessage({ type: "success", text: "Mise à jour réussie !" });
      } else {
        await saveProduct(payload);
        setMessage({ type: "success", text: "Lot enregistré avec succès !" });
      }
      refresh();
      setTimeout(() => handleCancel(), 2000);
    } catch (error) {
      setMessage({ type: "error", text: "Erreur lors de l'opération." });
    } finally { setIsSubmitting(false); }
  };

  return (
    <section className="container py-5" style={{ maxWidth: "1100px" }}>
      <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
        <div>
          <div className="d-flex align-items-center">
            <span style={styles.label}>{isAdmin ? "Administration Centrale" : "Plateforme Vendeur"}</span>
            {isAdmin && <span style={styles.adminTag}>Supervision</span>}
          </div>
          <h1 style={styles.headerTitle}>{isAdmin ? "Tous les Stocks" : "Stock & Produits"}</h1>
        </div>
        <div className="d-flex gap-4">
          <button onClick={handleCancel} className="btn btn-link text-decoration-none p-0" style={{ ...styles.label, color: view === "list" ? "#000" : "#ccc" }}>
            {isAdmin ? "Inventaire Global" : "Mon Inventaire"} ({products.length})
          </button>
          {!isAdmin && (
            <button onClick={() => { setSelectedProduct(null); setFileNames({}); setView("add"); }} className="btn btn-link text-decoration-none p-0" style={{ ...styles.label, color: view === "add" && !selectedProduct ? "#000" : "#ccc" }}>
              + Ajouter un lot
            </button>
          )}
        </div>
      </header>

      {message && <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"} rounded-0 mb-4`} style={styles.label}>{message.text}</div>}

      {view === "list" ? (
        <ProductList 
          products={products} 
          isLoading={isLoading} 
          onEdit={handleEdit} 
          getStatusStyle={getStatusStyle} // On passe la fonction de style à la liste
        />
      ) : (
        <form className="fade-in pb-5" onSubmit={handleSubmit}>
          <div className="d-flex align-items-center">
            <h2 style={styles.subTitle}>
              {selectedProduct ? `Édition du lot : ${selectedProduct.traceability?.lotNumber}` : "1. Traçabilité & Extraction"}
            </h2>
            {selectedProduct && (
              <span style={{ ...styles.statusFlag, ...getStatusStyle(selectedProduct.status), marginLeft: "20px", marginBottom: "8px" }}>
                {selectedProduct.status}
              </span>
            )}
          </div>

          {/* --- SECTION 1 --- */}
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Campagne Oléicole</label><input name="campagne" style={styles.input} defaultValue={selectedProduct?.traceability?.campagneOleicole} required /></div>
              <div><label style={styles.label}>Numéro de lot</label><input name="lotNumber" style={styles.input} defaultValue={selectedProduct?.traceability?.lotNumber} required /></div>
              <div><label style={styles.label}>Date de récolte</label><input name="dateRecolte" type="date" style={styles.input} defaultValue={selectedProduct?.traceability?.dateRecolte?.split("T")[0]} /></div>
              <div><label style={styles.label}>Extraction</label>
                <select name="methodeExtraction" style={styles.select} defaultValue={selectedProduct?.traceability?.methodeExtraction}>
                  <option value="À froid">À froid</option><option value="2 phases">2 phases</option><option value="3 phases">3 phases</option><option value="Traditionnelle">Traditionnelle</option>
                </select>
              </div>
              <div><label style={styles.label}>Type Récolte</label>
                <select name="typeRecolte" style={styles.select} defaultValue={selectedProduct?.traceability?.typeRecolte}>
                  <option value="Manuelle">Manuelle</option><option value="Gaule">Gaule</option><option value="Mécanique">Mécanique</option>
                </select>
              </div>
              <div><label style={styles.label}>Irrigation</label>
                <select name="typeIrrigation" style={styles.select} defaultValue={selectedProduct?.traceability?.typeIrrigation}>
                  <option value="Sec">Sec</option><option value="Goutte-à-goutte">Goutte-à-goutte</option>
                </select>
              </div>
              <div><label style={styles.label}>Stockage</label>
                <select name="stockage" style={styles.select} defaultValue={selectedProduct?.traceability?.stockage?.[0]}>
                  <option value="Récipients Inox">Récipients Inox</option><option value="Verre foncé">Verre foncé</option>
                </select>
              </div>
              <div><label style={styles.label}>Stabilité (Rancimat)</label>
                <select name="stabilite" style={styles.select} defaultValue={selectedProduct?.traceability?.stabiliteRancimat}>
                  <option value="5 à 8 h : stabilité moyenne">5 à 8 h : stabilité moyenne</option><option value="8 à 15 h : bonne stabilité">8 à 15 h : bonne stabilité</option><option value="+15 h : excellente stabilité">+15 h : excellente stabilité</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- SECTION 2 --- */}
          <h2 style={styles.subTitle}>2. Analyses Physico-chimiques Obligatoires</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Variété</label>
                <select name="variety" style={styles.select} defaultValue={selectedProduct?.physicoChimique?.variety}>
                  <option value="Chemlali">Chemlali</option><option value="Chetoui">Chetoui</option><option value="Oueslati">Oueslati</option>
                </select>
              </div>
              <div><label style={styles.label}>Classification</label>
                <select name="classification" style={styles.select} defaultValue={selectedProduct?.physicoChimique?.classification}>
                  <option value="Vierge Extra">Vierge Extra</option><option value="Vierge">Vierge</option><option value="Lampante">Lampante</option>
                </select>
              </div>
              <div><label style={styles.label}>Acidité (%)</label><input name="acidite" type="number" step="0.01" style={styles.input} defaultValue={selectedProduct?.physicoChimique?.aciditeLibre} /></div>
              <div><label style={styles.label}>Indice Peroxyde</label><input name="peroxyde" type="number" style={styles.input} defaultValue={selectedProduct?.physicoChimique?.indicePeroxyde} /></div>
              <div><label style={styles.label}>K232</label><input name="k232" type="number" step="0.001" style={styles.input} defaultValue={selectedProduct?.physicoChimique?.absorbanceUV?.k232} /></div>
              <div><label style={styles.label}>K270</label><input name="k270" type="number" step="0.001" style={styles.input} defaultValue={selectedProduct?.physicoChimique?.absorbanceUV?.k270} /></div>
            </div>
          </div>

          {/* --- SECTION 3 --- */}
          <h2 style={styles.subTitle}>3. Pureté & Anti-Fraude</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div>
                <label htmlFor="purete-erythrodiol" style={styles.label}>Erythrodiol + Uvaol</label>
                <select id="purete-erythrodiol" name="erythrodiol" style={styles.select} defaultValue={selectedProduct?.purete?.erythrodiolUvaol}>
                  <option value="< 3.5 %">{"< 3.5 %"}</option>
                  <option value="≥ 3.5 %">{"≥ 3.5 %"}</option>
                </select>
              </div>
              <div>
                <label htmlFor="purete-cires" style={styles.label}>Cires (Waxes)</label>
                <select id="purete-cires" name="cires" style={styles.select} defaultValue={selectedProduct?.purete?.ciresWaxes}>
                  <option value="≤ 250 mg/kg">{"≤ 250 mg/kg"}</option>
                  <option value="> 250 mg/kg">{"> 250 mg/kg"}</option>
                </select>
              </div>
              <div><label htmlFor="purete-oleic" style={styles.label}>Acide Oléique %</label><input id="purete-oleic" name="oleic" type="number" step="0.1" style={styles.input} defaultValue={selectedProduct?.purete?.acideOleique} /></div>
              <div><label htmlFor="purete-sterols" style={styles.label}>Stérols Totaux</label><input id="purete-sterols" name="sterols" type="number" style={styles.input} defaultValue={selectedProduct?.purete?.sterolsTotaux} /></div>
            </div>
          </div>

          {/* --- SECTION 4 --- */}
          <h2 style={styles.subTitle}>4. Logistique & Export</h2>
          <div style={styles.card}>
            <div style={styles.grid}>
              <div><label style={styles.label}>Quantité (Litres)</label><input name="quantity" type="number" style={styles.input} defaultValue={selectedProduct?.logistique?.totalQuantity} required /></div>
              <div><label style={styles.label}>Prix (€/Litre)</label><input name="price" type="number" step="0.01" style={styles.input} defaultValue={selectedProduct?.logistique?.price} required /></div>
              <div><label style={styles.label}>Conditionnement</label><select name="packaging" style={styles.select} defaultValue={selectedProduct?.logistique?.packagingType}><option value="Vrac">Vrac</option><option value="Bouteilles">Bouteilles</option></select></div>
            </div>
          </div>

          {/* --- SECTION 5 : VALIDATION ADMIN --- */}
          {isAdmin && selectedProduct && (
            <>
              <h2 style={styles.subTitle}>5. Validation Administrative</h2>
              <div style={styles.adminZone}>
                <div style={styles.grid}>
                  <div>
                    <label style={styles.label}>Décision Finale</label>
                    <select 
                      name="adminStatus" 
                      style={styles.select} 
                      value={adminDecision}
                      onChange={(e) => setAdminDecision(e.target.value)}
                    >
                      <option value="En attente de validation">En attente de validation</option>
                      <option value="Validé">Approuver / Valider le lot</option>
                      <option value="Rejeté">Rejeter / Refuser le lot</option>
                      <option value="Disponible">Mettre en ligne (Disponible)</option>
                    </select>
                  </div>
                  {adminDecision === "Rejeté" && (
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={styles.label}>Motif du rejet (Sera envoyé au vendeur)</label>
                      <input 
                        name="rejectionReason" 
                        placeholder="Ex: Analyses physico-chimiques incohérentes..."
                        style={styles.input}
                        defaultValue={selectedProduct.validationDetails?.rejectionReason}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <div className="d-flex justify-content-end gap-3 mt-5">
            <button type="button" onClick={handleCancel} className="btn btn-link text-dark text-decoration-none" style={styles.label}>Annuler</button>
            <button type="submit" className="btn btn-dark px-5" style={{ ...styles.label, color: "#fff", borderRadius: 0 }} disabled={isSubmitting}>
              {isSubmitting ? "Chargement..." : (isAdmin && selectedProduct ? "Confirmer la décision" : (selectedProduct ? "Mettre à jour" : "Enregistrer le lot"))}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

export default InventoryView;