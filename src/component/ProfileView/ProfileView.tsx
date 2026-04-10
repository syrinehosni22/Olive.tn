import React, { useState, useEffect, ChangeEvent } from "react";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { updateUser } from "../../redux/slices/authSlice";

// --- Interfaces Synchronisées ---
interface User {
  id: string;
  _id?: string;
  role: "vendeur" | "acheteur" | "prestataire";
  email: string;
  firstName?: string;
  name?: string;
  phone?: string;
  companyName?: string;
  registrationNumber?: string;
  seller?: {
    region?: string;
    delegation?: string;
    producerName?: string;
    millName?: string;
    capacity?: number;
    altitude?: number;
  };
  buyer?: {
    buyerType?: string;
    searchRegion?: string;
    searchCapacity?: string;
  };
  provider?: {
    proEmail?: string;
    website?: string;
    serviceType?: string;
    instagram?: string;
    facebook?: string;
    linkedin?: string;
  };
}

interface Props {
  reduxUser: User | null;
  dispatchUpdateUser: (user: User) => void;
}

const ProfileView: React.FC<Props> = ({ reduxUser, dispatchUpdateUser }) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = reduxUser?.id || reduxUser?._id;
      try {
        const res = await fetch(`http://localhost:5000/api/user/profile/${userId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setFormData(data.user);
          dispatchUpdateUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (reduxUser?.id || reduxUser?._id) fetchProfile();
  }, [dispatchUpdateUser, reduxUser?.id, reduxUser?._id]);

  useEffect(() => {
    if (reduxUser && !formData) setFormData(reduxUser);
  }, [reduxUser, formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: "seller" | "buyer" | "provider") => {
    const { name, value } = e.target;
    if (!formData) return;

    if (section) {
      setFormData({
        ...formData,
        [section]: { ...(formData[section] || {}), [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = formData?.id || formData?._id;
    if (!formData || !userId) return;

    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: formData }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        dispatchUpdateUser(data.user);
        setTimeout(() => alert("Profil mis à jour !"), 100);
      }
    } catch (err) {
      alert("Erreur de connexion");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-5 text-center font-serif text-muted">Récupération...</div>;
  if (!formData) return <div className="p-5 text-center text-danger">Session expirée.</div>;

  const inputStyle = { border: "none", borderBottom: "1px solid #e0e0e0", borderRadius: "0", padding: "10px 0", marginBottom: "15px" };
  const labelStyle = { fontSize: "0.7rem", textTransform: "uppercase" as const, color: "#999", letterSpacing: "1px" };

  return (
    <div className="container py-5" style={{ maxWidth: "850px" }}>
      <form onSubmit={handleSave} className="bg-white p-4 shadow-sm border rounded">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="font-serif m-0">Mon Profil</h2>
          <span className="badge bg-light text-dark border px-3 py-2 text-uppercase">{formData.role}</span>
        </div>

        {/* --- SECTION COMMUNE --- */}
        <div className="row">
          <div className="col-md-6">
            <label style={labelStyle}>Prénom</label>
            <input type="text" name="firstName" className="form-control" style={inputStyle} value={formData.firstName || ""} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Nom</label>
            <input type="text" name="name" className="form-control" style={inputStyle} value={formData.name || ""} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Téléphone</label>
            <input type="text" name="phone" className="form-control" style={inputStyle} value={formData.phone || ""} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Email (Lecture seule)</label>
            <input type="email" className="form-control" style={{ ...inputStyle, color: "#aaa" }} value={formData.email} disabled />
          </div>
          <div className="col-12">
            <label style={labelStyle}>Nom de la Société / Entreprise</label>
            <input type="text" name="companyName" className="form-control" style={inputStyle} value={formData.companyName || ""} onChange={handleChange} />
          </div>
        </div>

        {/* --- ROLE: VENDEUR --- */}
        {formData.role === "vendeur" && (
          <div className="mt-5 pt-4 border-top">
            <h4 className="mb-4 font-serif">Détails Exploitation</h4>
            <div className="row">
              <div className="col-md-6">
                <label style={labelStyle}>Région</label>
                <select name="region" className="form-select shadow-none" style={inputStyle} value={formData.seller?.region || ""} onChange={(e) => handleChange(e, "seller")}>
                  <option value="">Choisir...</option>
                  <option value="Nord-ouest">Nord-ouest</option>
                  <option value="Centre">Centre</option>
                  <option value="Sud">Sud</option>
                  <option value="Sahel">Sahel</option>
                  <option value="Cap Bon">Cap Bon</option>
                </select>
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Délégation</label>
                <input type="text" name="delegation" className="form-control" style={inputStyle} value={formData.seller?.delegation || ""} onChange={(e) => handleChange(e, "seller")} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Nom du Producteur</label>
                <input type="text" name="producerName" className="form-control" style={inputStyle} value={formData.seller?.producerName || ""} onChange={(e) => handleChange(e, "seller")} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Nom du Moulin</label>
                <input type="text" name="millName" className="form-control" style={inputStyle} value={formData.seller?.millName || ""} onChange={(e) => handleChange(e, "seller")} />
              </div>
            </div>
          </div>
        )}

        {/* --- ROLE: ACHETEUR --- */}
        {formData.role === "acheteur" && (
          <div className="mt-5 pt-4 border-top">
            <h4 className="mb-4 font-serif">Profil Acheteur</h4>
            <div className="row">
              <div className="col-md-6">
                <label style={labelStyle}>Type d'entité</label>
                <select name="buyerType" className="form-select shadow-none" style={inputStyle} value={formData.buyer?.buyerType || ""} onChange={(e) => handleChange(e, "buyer")}>
                  <option value="">Choisir...</option>
                  <option value="Grossiste">Grossiste / Exportateur</option>
                  <option value="Particulier">Particulier</option>
                  <option value="Restaurant">CHR (Café, Hôtel, Resto)</option>
                </select>
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Besoin annuel estimé</label>
                <input type="text" name="searchCapacity" className="form-control" style={inputStyle} value={formData.buyer?.searchCapacity || ""} onChange={(e) => handleChange(e, "buyer")} />
              </div>
            </div>
          </div>
        )}

        {/* --- ROLE: PRESTATAIRE --- */}
        {formData.role === "prestataire" && (
          <div className="mt-5 pt-4 border-top">
            <h4 className="mb-4 font-serif">Services Professionnels</h4>
            <div className="row">
              <div className="col-md-6">
                <label style={labelStyle}>Email Pro</label>
                <input type="email" name="proEmail" className="form-control" style={inputStyle} value={formData.provider?.proEmail || ""} onChange={(e) => handleChange(e, "provider")} />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Site Web</label>
                <input type="url" name="website" className="form-control" style={inputStyle} value={formData.provider?.website || ""} onChange={(e) => handleChange(e, "provider")} />
              </div>
              <div className="col-md-12">
                <label style={labelStyle}>Type de Service</label>
                <input type="text" name="serviceType" className="form-control" style={inputStyle} value={formData.provider?.serviceType || ""} onChange={(e) => handleChange(e, "provider")} />
              </div>
              <div className="col-md-4">
                <label style={labelStyle}>LinkedIn</label>
                <input type="text" name="linkedin" className="form-control" style={inputStyle} value={formData.provider?.linkedin || ""} onChange={(e) => handleChange(e, "provider")} />
              </div>
              <div className="col-md-4">
                <label style={labelStyle}>Facebook</label>
                <input type="text" name="facebook" className="form-control" style={inputStyle} value={formData.provider?.facebook || ""} onChange={(e) => handleChange(e, "provider")} />
              </div>
              <div className="col-md-4">
                <label style={labelStyle}>Instagram</label>
                <input type="text" name="instagram" className="form-control" style={inputStyle} value={formData.provider?.instagram || ""} onChange={(e) => handleChange(e, "provider")} />
              </div>
            </div>
          </div>
        )}

        <button type="submit" className="btn btn-dark w-100 mt-5 py-3 text-uppercase fw-bold" disabled={isSaving}>
          {isSaving ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({ reduxUser: state.auth.user });
const mapDispatchToProps = (dispatch: any) => ({ dispatchUpdateUser: (user: User) => dispatch(updateUser(user)) });

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);