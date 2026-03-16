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
    name: "",
    firstName: "",
    email: "",
    password: "", // Added password field
    phone: "",
    companyName: "",
    // Seller specific
    registrationNumber: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();

    // Append all fields to FormData
    // Your backend logic expects these at the top level of req.body to then destructure
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
      alert(err.response?.data?.message || "Erreur lors de l'envoi du formulaire.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-wrapper container-fluid py-5">
      <div className="row justify-content-center align-items-center w-100">
        <div className="col-md-6 px-lg-5">
          <button className="btn btn-outline-secondary btn-sm rounded-pill mb-4" onClick={onBack}>
            ← Modifier le plan ({plan.name})
          </button>

          <h2 className="role-main-title mb-4">Finaliser l'inscription {role.toUpperCase()}</h2>

          <form onSubmit={handleSubmit} className="premium-olive-form">
            <h5 className="section-title">Informations de Connexion</h5>
            <div className="row g-3 mb-3">
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

            {/* --- SELLER LOGIC --- */}
            {role === "vendeur" && (
              <>
                <h5 className="section-title mt-4">Détails de l'Exploitation</h5>
                <input type="text" name="companyName" placeholder="Nom de la Société" required onChange={handleChange} className="olive-input" />
                <input type="text" name="registrationNumber" placeholder="Registre de Commerce / RNE" required onChange={handleChange} className="olive-input" />
                
                <div className="rne-upload-box mb-3 p-3 border rounded bg-light">
                  <label className="small text-muted mb-2 d-block">Document RNE (PDF, JPG) *</label>
                  <input type="file" accept=".pdf,.png,.jpg" required onChange={(e) => setFile(e.target.files?.[0] || null)} className="form-control-file" />
                </div>

                <div className="row g-2">
                  <div className="col-md-6">
                    <select name="region" required onChange={handleChange} className="olive-select">
                      <option value="">Région</option>
                      <option value="Sahel">Sahel</option>
                      <option value="Sfax">Sfax</option>
                      <option value="Nord">Nord</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="delegation" placeholder="Délégation" onChange={handleChange} className="olive-input" />
                  </div>
                  <div className="col-md-6">
                    <input type="number" name="capacity" placeholder="Capacité (tonnes)" onChange={handleChange} className="olive-input" />
                  </div>
                  <div className="col-md-6">
                    <input type="text" name="altitude" placeholder="Altitude" onChange={handleChange} className="olive-input" />
                  </div>
                </div>
              </>
            )}

            {/* --- BUYER LOGIC --- */}
            {role === "acheteur" && (
              <>
                <h5 className="section-title mt-4">Profil Acheteur</h5>
                <input type="text" name="companyName" placeholder="Nom de la Société (Optionnel)" onChange={handleChange} className="olive-input" />
                <select name="buyerType" required onChange={handleChange} className="olive-select">
                  <option value="">Type d'entité</option>
                  <option value="Grossiste">Grossiste / Exportateur</option>
                  <option value="Particulier">Particulier</option>
                  <option value="Restaurant">CH R</option>
                </select>
                <input type="text" name="searchCapacity" placeholder="Besoin annuel estimé" onChange={handleChange} className="olive-input" />
              </>
            )}

            {/* --- PROVIDER LOGIC --- */}
            {role === "prestataire" && (
              <>
                <h5 className="section-title mt-4">Services Professionnels</h5>
                <input type="text" name="companyName" placeholder="Nom de l'entreprise" required onChange={handleChange} className="olive-input" />
                <input type="text" name="serviceType" placeholder="Domaine (Transport, Packaging...)" required onChange={handleChange} className="olive-input" />
                <input type="url" name="website" placeholder="Site Web (URL)" onChange={handleChange} className="olive-input" />
                <div className="row g-2 mt-2">
                  <div className="col-4"><input type="text" name="linkedin" placeholder="LinkedIn" onChange={handleChange} className="olive-input" /></div>
                  <div className="col-4"><input type="text" name="facebook" placeholder="Facebook" onChange={handleChange} className="olive-input" /></div>
                  <div className="col-4"><input type="text" name="instagram" placeholder="Instagram" onChange={handleChange} className="olive-input" /></div>
                </div>
              </>
            )}

            <div className="mt-5">
              <button type="submit" className="btn-premium w-100" disabled={loading}>
                {loading ? "Traitement..." : `S'inscrire et Payer (${plan.price})`}
              </button>
            </div>
          </form>
        </div>

        <div className="col-md-6 d-none d-md-block px-lg-5 text-center visual-section">
          <div className="premium-gold-frame shadow">
            <img src="assets/img/olive-flow.png" alt="Olive Oil" className="side-img img-fluid" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;