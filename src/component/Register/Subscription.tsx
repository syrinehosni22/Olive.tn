import React, { useState } from "react";
import axios from "axios";

interface Props {
  role: string;
  plan: any;
  onBack: () => void;
}

const SubscriptionForm: React.FC<Props> = ({ role, plan, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    // Auth & Common
    firstName: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
    registrationNumber: "",
    
    // Seller specific
    region: "",
    delegation: "",
    producerName: "",
    millName: "",
    capacity: "",
    altitude: "",
    
    // Buyer specific
    buyerType: "",
    searchRegion: "",
    searchCapacity: "",
    
    // Provider specific
    proEmail: "",
    website: "",
    serviceType: "",
    instagram: "",
    facebook: "",
    linkedin: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    data.append("role", role);
    data.append("planId", plan.id);
    if (file) data.append("rneFile", file);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register-with-payment",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err: any) {
      alert(
        err.response?.data?.message || "Erreur lors de l'envoi du formulaire."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-wrapper container-fluid py-5">
      <div className="row justify-content-center align-items-start w-100">
        <div className="col-md-7 px-lg-5">
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill mb-4"
            onClick={onBack}
          >
            ← Modifier le plan ({plan.name})
          </button>

          <h2 className="role-main-title mb-4 text-capitalize">
            Finaliser l'inscription {role}
          </h2>

          <form onSubmit={handleSubmit} className="premium-olive-form">
            {/* SECTION 1: AUTHENTICATION */}
            <h5 className="section-title">Informations de Connexion</h5>
            <div className="row g-3 mb-4">
              <div className="col-sm-6">
                <input type="text" name="firstName" placeholder="Prénom" required onChange={handleChange} className="olive-input" />
              </div>
              <div className="col-sm-6">
                <input type="text" name="name" placeholder="Nom" required onChange={handleChange} className="olive-input" />
              </div>
              <div className="col-sm-6">
                <input type="email" name="email" placeholder="Adresse mail" required onChange={handleChange} className="olive-input" />
              </div>
              <div className="col-sm-6">
                <input type="password" name="password" placeholder="Mot de passe" required onChange={handleChange} className="olive-input" />
              </div>
              <div className="col-sm-12">
                <input type="tel" name="phone" placeholder="Numéro de téléphone" required onChange={handleChange} className="olive-input" />
              </div>
            </div>

            {/* SECTION 2: SELLER SPECIFIC */}
            {role === "vendeur" && (
              <>
                <h5 className="section-title mt-4">Détails de l'Exploitation</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input type="text" name="companyName" placeholder="Nom de la Société" required onChange={handleChange} className="olive-input" />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="registrationNumber" placeholder="Registre de Commerce / RNE" required onChange={handleChange} className="olive-input" />
                  </div>
                  
                  <div className="col-12">
                    <div className="rne-upload-box p-3 border rounded bg-light">
                      <label className="small text-muted mb-2 d-block">
                        Joindre le registre de commerce ou RNE (moins de 3 mois) *
                      </label>
                      <input type="file" accept=".pdf,.png,.jpg" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="form-control-file" />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <select name="region" required onChange={handleChange} className="olive-select">
                      <option value="">Sélectionner la Région</option>
                      <option value="Nord-ouest">Nord-ouest</option>
                      <option value="Centre">Centre</option>
                      <option value="Sud">Sud</option>
                      <option value="Sahel">Sahel</option>
                      <option value="Cap Bon">Cap Bon</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="delegation" placeholder="Délégation" onChange={handleChange} className="olive-input" />
                  </div>

                  <div className="col-md-6">
                    <input type="text" name="producerName" placeholder="Nom du producteur" onChange={handleChange} className="olive-input" />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="millName" placeholder="Nom du moulin" onChange={handleChange} className="olive-input" />
                  </div>

                  <div className="col-md-6">
                    <input type="number" name="capacity" placeholder="Capacité annuelle (tonnes)" onChange={handleChange} className="olive-input" />
                  </div>
                  <div className="col-md-6">
                    <input type="number" name="altitude" placeholder="Altitude du verger (mètres)" onChange={handleChange} className="olive-input" />
                  </div>
                </div>
              </>
            )}

            {/* SECTION 2: BUYER SPECIFIC */}
            {role === "acheteur" && (
              <>
                <h5 className="section-title mt-4">Profil Acheteur</h5>
                <input type="text" name="companyName" placeholder="Nom de la Société (Optionnel)" onChange={handleChange} className="olive-input mb-3" />
                <select name="buyerType" required onChange={handleChange} className="olive-select mb-3">
                  <option value="">Type d'entité</option>
                  <option value="Grossiste">Grossiste / Exportateur</option>
                  <option value="Particulier">Particulier</option>
                  <option value="Restaurant">CHR (Café, Hôtel, Resto)</option>
                </select>
                <input type="text" name="searchCapacity" placeholder="Besoin annuel estimé" onChange={handleChange} className="olive-input" />
              </>
            )}

            {/* SECTION 2: PROVIDER SPECIFIC */}
            {role === "prestataire" && (
              <>
                <h5 className="section-title mt-4">Services Professionnels</h5>
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <input type="text" name="companyName" placeholder="Nom de la Société" required onChange={handleChange} className="olive-input" />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="registrationNumber" placeholder="Registre de Commerce" required onChange={handleChange} className="olive-input" />
                  </div>
                </div>
                <input type="email" name="proEmail" placeholder="Adresse mail professionnel" required onChange={handleChange} className="olive-input mb-3" />
                
                <select name="serviceType" required onChange={handleChange} className="olive-select mb-3">
                  <option value="">Sélectionnez votre type de service</option>
                  
                  <optgroup label="1. Fournisseurs & Services techniques">
                    <option value="plants_oliviers">Fournisseur de plants d’oliviers certifiés</option>
                    <option value="engrais_organiques">Fournisseur d’engrais organiques et amendements</option>
                    <option value="produits_phytosanitaires">Fournisseur de produits phytosanitaires homologués</option>
                    <option value="reparation_agricole">Entreprises de réparation/mécanique agricole</option>
                    <option value="equipements_irrigation">Fournisseur d’équipements d’irrigation (pompes, goutte-à-goutte)</option>
                    <option value="taille_mecanique">Technicien en conduite mécanique de taille</option>
                  </optgroup>

                  <optgroup label="2. Services agricoles & Conseils techniques">
                    <option value="conseil_agricole">Centre de conseil agricole (Ministère/Équivalent)</option>
                    <option value="ingenieur_agronome">Ingénieur agronome spécialisé en oléiculture</option>
                    <option value="tech_irrigation_fert">Technicien en irrigation et fertilisation</option>
                    <option value="labo_analyse_sol">Laboratoire d’analyse de sol</option>
                    <option value="centre_formation_agri">Centre de formation agricole</option>
                    <option value="experts_conduite_vergers">Experts en conduite de vergers (taille, fertilisation, lutte)</option>
                  </optgroup>

                  <optgroup label="3. Coopératives & Groupements">
                    <option value="cooperative_locale">Coopérative locale d’agriculteurs oléicoles</option>
                    <option value="federation_regionale">Fédération régionale des oléiculteurs</option>
                    <option value="groupement_achat">Groupement d’achat collectif (intrants, matériel)</option>
                    <option value="reseau_echange_pratiques">Réseau d’oléiculteurs pour échanges de bonnes pratiques</option>
                  </optgroup>

                  <optgroup label="4. Transformation & Conditionnement">
                    <option value="moulin_huile">Usine/installation de trituration (moulin à huile)</option>
                    <option value="stockage_silo">Fournisseur de silo / cuves de stockage alimentaire</option>
                    <option value="packaging_etiquettes">Fournisseur d’étiquettes et packaging</option>
                    <option value="conseil_qualite">Entreprises de conseils en qualité (ISO, HVE, BIO)</option>
                    <option value="labo_analyse_huile">Laboratoire d’analyses d’huile d’olive (qualité, polyphénols)</option>
                  </optgroup>

                  <optgroup label="5. Distribution & Commercialisation">
                    <option value="acheteurs_locaux">Acheteurs locaux (marchés, grossistes)</option>
                    <option value="industrie_agro">Industrie agroalimentaire utilisant de l’huile d’olive</option>
                    <option value="distributeurs_spec">Distributeurs nationaux (magasins bio, épiceries fines)</option>
                    <option value="vente_en_ligne">Plateformes de vente en ligne</option>
                    <option value="export_import">Exportateurs / importateurs</option>
                    <option value="agents_commerciaux">Agents commerciaux</option>
                  </optgroup>

                  <optgroup label="6. Institutions & Administrations">
                    <option value="direction_agri">Direction régionale de l’agriculture</option>
                    <option value="office_national_huile">Office national de l’huile d’olive</option>
                    <option value="chambre_agri">Chambre d’agriculture</option>
                    <option value="services_douaniers">Services douaniers (pour exportation)</option>
                    <option value="banque_agri">Banque / conseiller financier agricole</option>
                    <option value="assurance_agri">Assurance agricole (récolte, matériel)</option>
                  </optgroup>

                  <optgroup label="7. Consultants & Services spécialisés">
                    <option value="expert_bio">Expert en certification biologique (BIO)</option>
                    <option value="conseiller_marketing">Conseiller en marketing agricole</option>
                    <option value="comptable_agri">Comptable / fiscaliste spécialisé agriculteurs</option>
                    <option value="avocat_rural">Avocat en droit rural et foncier</option>
                    <option value="formateur_gestion">Formateur en gestion d’exploitation agricole</option>
                  </optgroup>

                  <optgroup label="8. Réseaux & Organisations professionnelles">
                    <option value="syndicat_agri">Syndicat des agriculteurs</option>
                    <option value="association_producteurs">Associations de producteurs d’huile d’olive</option>
                    <option value="reseau_export">Réseaux d’exportation</option>
                    <option value="club_entrepreneurs">Clubs d’entrepreneurs agricoles</option>
                  </optgroup>
                </select>
                
                <input type="url" name="website" placeholder="Site Web (URL)" onChange={handleChange} className="olive-input mb-3" />
                
                <div className="row g-2">
                  <div className="col-4"><input type="text" name="linkedin" placeholder="LinkedIn" onChange={handleChange} className="olive-input" /></div>
                  <div className="col-4"><input type="text" name="facebook" placeholder="Facebook" onChange={handleChange} className="olive-input" /></div>
                  <div className="col-4"><input type="text" name="instagram" placeholder="Instagram" onChange={handleChange} className="olive-input" /></div>
                </div>
              </>
            )}

            <div className="mt-5">
              <button
                type="submit"
                className="btn-premium w-100"
                disabled={loading}
              >
                {loading
                  ? "Traitement..."
                  : `S'inscrire et Payer (${plan.price})`}
              </button>
            </div>
          </form>
        </div>

        {/* VISUAL SIDEBAR */}
        <div className="col-md-5 d-none d-md-block px-lg-5 text-center sticky-top" style={{ top: "2rem" }}>
          <div className="premium-gold-frame shadow">
            <img
              src="assets/img/olive-flow.png"
              alt="Olive Oil"
              className="side-img img-fluid"
            />
          </div>
          <div className="mt-4 p-3 bg-white rounded shadow-sm">
            <h6 className="text-gold">Récapitulatif</h6>
            <p className="small mb-1">Plan sélectionné : <strong>{plan.name}</strong></p>
            <p className="small">Prix : <strong>{plan.price}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;