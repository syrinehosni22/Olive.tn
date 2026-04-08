import React, { useState, useEffect, ChangeEvent } from "react";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";
import { updateUser } from "../../redux/slices/authSlice";

// --- Interfaces ---
interface SellerData {
  brandName?: string;
  producerType?: "Producteur" | "Collecteur" | "Moulin" | "Exportateur";
  region?: string;
  delegation?: string;
  millName?: string;
  millType?: "Traditionnel" | "Chaine Continue" | "Super-Presse";
  capacity?: number;
  altitude?: number;
  taxId?: string;
}

interface User {
  id: string;
  role: "vendeur" | "acheteur" | "prestataire";
  email: string;
  firstName?: string;
  name?: string;
  phone?: string;
  companyName?: string;
  registrationNumber?: string;
  planId?: string;
  seller?: SellerData;
}

interface Props {
  reduxUser: User | null;
  dispatchUpdateUser: (user: User) => void;
}

const ProfileView: React.FC<Props> = ({ reduxUser, dispatchUpdateUser }) => {
  const [formData, setFormData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Fetch Profile on Mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/user/profile/" + reduxUser?.id,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
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

    if (reduxUser?.id) fetchProfile();
  }, [dispatchUpdateUser, reduxUser?.id]);

  // Sync state if Redux changes (protection contre le premier rendu)
  useEffect(() => {
    if (reduxUser && !formData) {
      setFormData(reduxUser);
    }
  }, [reduxUser, formData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: "seller",
  ) => {
    const { name, value } = e.target;
    if (!formData) return;

    if (section === "seller") {
      setFormData({
        ...formData,
        seller: { ...(formData.seller || {}), [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    // 1. BLOCAGE IMMEDIAT
    e.preventDefault();
    e.stopPropagation();

    // 2. VERIFICATION DE L'ID (On teste id et _id pour être sûr)
    const userId = formData?.id || (formData as any)?._id;

    if (!formData || !userId) {
      console.error("ID manquant, impossible de sauvegarder", formData);
      return;
    }

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
        // 3. MISE À JOUR REDUX
        dispatchUpdateUser(data.user);

        // 4. L'ALERTE (ne rafraîchit pas car preventDefault a bloqué l'événement)
        setTimeout(() => {
          alert("Profil mis à jour !");
        }, 100);
      } else {
        alert(data.message || "Erreur serveur");
      }
    } catch (err) {
      console.error("Erreur Fetch:", err);
      alert("Erreur de connexion au serveur");
    } finally {
      setIsSaving(false);
    }
  };
  if (isLoading)
    return (
      <div className="p-5 text-center font-serif text-muted">
        Récupération de votre profil...
      </div>
    );
  if (!formData)
    return (
      <div className="p-5 text-center text-danger">
        Session expirée ou utilisateur introuvable.
      </div>
    );

  const inputStyle = {
    border: "none",
    borderBottom: "1px solid #e0e0e0",
    borderRadius: "0",
    padding: "10px 0",
    marginBottom: "15px",
  };
  const labelStyle = {
    fontSize: "0.7rem",
    textTransform: "uppercase" as const,
    color: "#999",
    letterSpacing: "1px",
  };

  return (
    <div className="container py-5" style={{ maxWidth: "850px" }}>
      <form
        onSubmit={handleSave}
        className="bg-white p-4 shadow-sm border rounded"
      >
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="font-serif m-0">Mon Profil</h2>
          <span className="badge bg-light text-dark border px-3 py-2">
            {formData.role}
          </span>
        </div>

        <div className="row">
          <div className="col-md-6">
            <label style={labelStyle}>Prénom</label>
            <input
              type="text"
              name="firstName"
              className="form-control"
              style={inputStyle}
              value={formData.firstName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Nom</label>
            <input
              type="text"
              name="name"
              className="form-control"
              style={inputStyle}
              value={formData.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Téléphone</label>
            <input
              type="text"
              name="phone"
              className="form-control"
              style={inputStyle}
              value={formData.phone || ""}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label style={labelStyle}>Email (Lecture seule)</label>
            <input
              type="email"
              className="form-control"
              style={{ ...inputStyle, color: "#aaa" }}
              value={formData.email}
              disabled
            />
          </div>
        </div>

        {formData.role === "vendeur" && (
          <div className="mt-5 pt-4 border-top">
            <h4 className="mb-4 font-serif" style={{ color: "#2c3e50" }}>
              Spécifications Vendeur
            </h4>
            <div className="row">
              <div className="col-md-6">
                <label style={labelStyle}>Marque</label>
                <input
                  type="text"
                  name="brandName"
                  className="form-control"
                  style={inputStyle}
                  value={formData.seller?.brandName || ""}
                  onChange={(e) => handleChange(e, "seller")}
                />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Type</label>
                <select
                  name="producerType"
                  className="form-select shadow-none"
                  style={inputStyle}
                  value={formData.seller?.producerType || ""}
                  onChange={(e) => handleChange(e, "seller")}
                >
                  <option value="">Choisir...</option>
                  <option value="Producteur">Producteur</option>
                  <option value="Moulin">Moulin</option>
                  <option value="Exportateur">Exportateur</option>
                </select>
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Capacité (L)</label>
                <input
                  type="number"
                  name="capacity"
                  className="form-control"
                  style={inputStyle}
                  value={formData.seller?.capacity || ""}
                  onChange={(e) => handleChange(e, "seller")}
                />
              </div>
              <div className="col-md-6">
                <label style={labelStyle}>Système</label>
                <select
                  name="millType"
                  className="form-select shadow-none"
                  style={inputStyle}
                  value={formData.seller?.millType || ""}
                  onChange={(e) => handleChange(e, "seller")}
                >
                  <option value="">Choisir...</option>
                  <option value="Chaine Continue">Chaine Continue</option>
                  <option value="Traditionnel">Traditionnel</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-dark w-100 mt-5 py-3 text-uppercase fw-bold"
          disabled={isSaving}
        >
          {isSaving ? "Mise à jour..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  reduxUser: state.user.userInfo,
});

const mapDispatchToProps = (dispatch: any) => ({
  dispatchUpdateUser: (user: User) => dispatch(updateUser(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
