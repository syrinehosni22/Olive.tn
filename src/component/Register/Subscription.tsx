import React, { useState } from "react";
import axios from "axios";

interface Props {
  role: string;
  plan: any;
  onBack: () => void;
}

const SubscriptionForm: React.FC<Props> = ({ role, plan, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<any>({
    name: "",
    firstName: "",
    email: "",
    phone: "",
    companyName: "",
    registrationNumber: "", // Registre de Commerce / RNE
  });

  // Gestion des changements d'input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envoi des données (multipart pour gérer l'upload de fichier)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Ajout des informations textuelles
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    // Ajout des infos système
    data.append("role", role);
    data.append("planId", plan.id);

    // Ajout du fichier RNE si présent
    if (file) data.append("rneFile", file);

    try {
      // Requête pour l'inscription et la création de la session de paiement
      for (const [key, value] of data.entries()) {
        console.log(key, value);
      }
      const res = await axios.post(
        "http://localhost:5000/api/auth/register-with-payment",
        data,
      );

      // Redirection vers la passerelle de paiement (ex: Stripe, Flouci)
      if (res.data.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (err) {
      alert("Erreur lors de l'envoi du formulaire. Veuillez réessayer.");
    }
  };

  return (
    <div className="subscription-wrapper container-fluid py-5">
      <div className="row justify-content-center align-items-center w-100">
        {/* Côté Gauche : Le Formulaire (utilise Bootstrap pour la structure) */}
        <div className="col-md-6 px-lg-5">
          <button
            className="btn btn-outline-secondary btn-sm rounded-pill mb-4"
            onClick={onBack}
          >
            ← Modifier le plan ({plan.name})
          </button>

          <p className="marketplace-tagline">
            THE MARKETPLACE THAT REUNITES BEST OF TUNISIAN OLIVE OIL
          </p>

          <h2 className="role-main-title mb-4">
            Finaliser l'inscription {role.toUpperCase()}
          </h2>

          <form onSubmit={handleSubmit} className="premium-olive-form">
            {/* --- CHAMPS COMMUNS --- */}
            <h5 className="section-title">Informations de base</h5>
            <div className="row g-3">
              <div className="col-sm-6">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  required
                  onChange={handleChange}
                  className="olive-input"
                />
              </div>
              <div className="col-sm-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Nom"
                  required
                  onChange={handleChange}
                  className="olive-input"
                />
              </div>
            </div>
            <input
              type="email"
              name="email"
              placeholder="Adresse mail"
              required
              onChange={handleChange}
              className="olive-input"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Numéro de téléphone"
              required
              onChange={handleChange}
              className="olive-input"
            />

            {/* --- LOGIQUE VENDEUR --- */}
            {role === "vendeur" && (
              <>
                <h5 className="section-title mt-4">Détails de l'Agriculteur</h5>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Nom de la Société"
                  required
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="text"
                  name="registrationNumber"
                  placeholder="Registre de Commerce / RNE"
                  required
                  onChange={handleChange}
                  className="olive-input"
                />

                <div className="rne-upload-box mb-4">
                  <label htmlFor="rneFile" className="d-block mb-1 text-muted">
                    Joindre RNE (datant de moins de 3 mois) * :
                  </label>
                  <input
                    type="file"
                    name="rneFile"
                    accept=".pdf,.png,.jpg"
                    required
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="form-control-file"
                  />
                </div>

                <select
                  name="region"
                  required
                  onChange={handleChange}
                  className="olive-select"
                >
                  <option value="">Sélectionner une Région</option>
                  <option value="Nord-ouest">Nord-ouest</option>
                  <option value="Centre">Centre</option>
                  <option value="Sud">Sud</option>
                  <option value="Sahel">Sahel</option>
                  <option value="Cap Bon">Cap Bon</option>
                </select>
                <input
                  type="text"
                  name="delegation"
                  placeholder="Délégation"
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="text"
                  name="producerName"
                  placeholder="Nom du producteur"
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="text"
                  name="millName"
                  placeholder="Nom du moulin"
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacité annuelle (tonnes)"
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="text"
                  name="altitude"
                  placeholder="Altitude du verger"
                  onChange={handleChange}
                  className="olive-input"
                />
              </>
            )}

            {/* --- LOGIQUE ACHETEUR --- */}
            {role === "acheteur" && (
              <>
                <h5 className="section-title mt-4">Détails de l'Acheteur</h5>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Nom de la Société"
                  onChange={handleChange}
                  className="olive-input"
                />

                <select
                  name="buyerType"
                  required
                  onChange={handleChange}
                  className="olive-select"
                >
                  <option value="">Type d'acheteur</option>
                  <option value="Particulier">Particulier</option>
                  <option value="Grossiste">Grossiste</option>
                  <option value="Distributeur">Distributeur</option>
                  <option value="Courtier">Courtier</option>
                </select>

                <h6 className="search-pref mt-4">
                  Critères de recherche préférés :
                </h6>
                <select
                  name="searchRegion"
                  onChange={handleChange}
                  className="olive-select"
                >
                  <option value="">Région préférée</option>
                  <option value="Nord-ouest">Nord-ouest</option>
                  <option value="Centre">Centre</option>
                  <option value="Sud">Sud</option>
                  <option value="Sahel">Sahel</option>
                  <option value="Cap Bon">Cap Bon</option>
                </select>
                <input
                  type="text"
                  name="searchCapacity"
                  placeholder="Capacité annuelle recherchée (tonnes)"
                  onChange={handleChange}
                  className="olive-input"
                />
              </>
            )}

            {/* --- LOGIQUE PARTIE TIERCE --- */}
            {role === "prestataire" && (
              <>
                <h5 className="section-title mt-4">Détails du Prestataire</h5>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Nom de la Société"
                  required
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="email"
                  name="proEmail"
                  placeholder="Adresse mail professionnel"
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="url"
                  name="website"
                  placeholder="Site web (https://...)"
                  onChange={handleChange}
                  className="olive-input"
                />
                <input
                  type="text"
                  name="serviceType"
                  placeholder="Type de service"
                  required
                  onChange={handleChange}
                  className="olive-input"
                />

                <p className="mt-3 text-muted">Vos réseaux sociaux :</p>
                <div className="row g-2">
                  <div className="col-md-4">
                    {" "}
                    <input
                      type="text"
                      name="instagram"
                      placeholder="Instagram"
                      onChange={handleChange}
                      className="olive-input"
                    />{" "}
                  </div>
                  <div className="col-md-4">
                    {" "}
                    <input
                      type="text"
                      name="facebook"
                      placeholder="Facebook"
                      onChange={handleChange}
                      className="olive-input"
                    />{" "}
                  </div>
                  <div className="col-md-4">
                    {" "}
                    <input
                      type="text"
                      name="linkedin"
                      placeholder="LinkedIn"
                      onChange={handleChange}
                      className="olive-input"
                    />{" "}
                  </div>
                </div>
              </>
            )}

            {/* Le bouton style ovale "Créer un compte" de ton image */}
            <div className="mt-5">
              <button type="submit" className="btn-premium">
                Procéder au paiement ({plan.price})
              </button>
            </div>
          </form>
        </div>

        {/* Côté Droit : Le visuel premium (Inspiré de ton image) */}
        <div className="col-md-6 px-lg-5 text-center visual-section">
          <div className="premium-gold-frame shadow">
            <img
              src="assets/img/olive-flow.png"
              alt="Olive Oil"
              className="side-img img-fluid"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
