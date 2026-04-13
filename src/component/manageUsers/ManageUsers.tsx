import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit2, Trash2, Loader2, ArrowLeft } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "vendeur" | "acheteur" | "prestataire" | "admin";
  status: "active" | "pending" | "suspended";
  firstName?: string;
  phone?: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<User | null>(null);

  const API_URL = "http://localhost:5000/api/user";
  const authHeader = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

  // --- REPRODUCTION EXACTE DES STYLES DU PROFILEVIEW ---
  const inputStyle = { 
    border: "none", 
    borderBottom: "1px solid #e0e0e0", 
    borderRadius: "0", 
    padding: "10px 0", 
    marginBottom: "15px", 
    backgroundColor: "transparent",
    fontSize: "0.9rem"
  };

  const labelStyle = { 
    fontSize: "0.65rem", 
    textTransform: "uppercase" as const, 
    color: "#999", 
    letterSpacing: "1.5px", 
    fontWeight: "600" as const 
  };

  const badgeStyle = {
    borderRadius: "0",
    letterSpacing: "1px",
    fontSize: "0.6rem",
    padding: "5px 10px"
  };

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/`, authHeader);
      setUsers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;
    try {
      await axios.patch(`${API_URL}/${editForm._id}/status`, editForm, authHeader);
      setUsers(users.map(u => u._id === editForm._id ? editForm : u));
      setIsEditing(false);
    } catch (err) { alert("Erreur de mise à jour"); }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-5 text-center font-serif" style={{ color: "#999" }}>Synchronisation...</div>;

  // --- VUE FORMULAIRE (ONGLET ÉDITION) ---
  if (isEditing && editForm) {
    return (
      <div className="container py-5" style={{ maxWidth: "850px" }}>
        <form onSubmit={handleSave} className="bg-white p-5 shadow-sm border-0 animate-in fade-in">
          <button 
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn btn-link text-dark p-0 mb-4 text-decoration-none d-flex align-items-center gap-2"
            style={labelStyle}
          >
            <ArrowLeft size={12} /> Retour à la liste
          </button>

          <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
            <div>
              <span style={labelStyle}>Administration système</span>
              <h2 className="font-serif m-0" style={{ fontSize: "2rem" }}>Modifier le membre</h2>
            </div>
            <span className="badge bg-dark text-white px-3 py-2 text-uppercase" style={badgeStyle}>
              {editForm.role}
            </span>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <label style={labelStyle}>Nom complet</label>
              <input 
                type="text" 
                className="form-control shadow-none" 
                style={inputStyle} 
                value={editForm.name} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
              />
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>Email (Lecture seule)</label>
              <input 
                type="email" 
                className="form-control" 
                style={{ ...inputStyle, color: "#ccc", cursor: "not-allowed" }} 
                value={editForm.email} 
                disabled 
              />
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>Attribuer un rôle</label>
              <select 
                className="form-select shadow-none" 
                style={inputStyle} 
                value={editForm.role} 
                onChange={(e) => setEditForm({...editForm, role: e.target.value as any})}
              >
                <option value="vendeur">Vendeur</option>
                <option value="acheteur">Acheteur</option>
                <option value="prestataire">Prestataire</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <div className="col-md-6">
              <label style={labelStyle}>Statut du compte</label>
              <select 
                className="form-select shadow-none" 
                style={inputStyle} 
                value={editForm.status} 
                onChange={(e) => setEditForm({...editForm, status: e.target.value as any})}
              >
                <option value="active">Actif</option>
                <option value="pending">En attente</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-dark w-100 mt-5 py-3 text-uppercase fw-bold shadow-none" 
            style={{ borderRadius: "0", letterSpacing: "2px" }}
          >
            Enregistrer les modifications
          </button>
        </form>
      </div>
    );
  }

  // --- VUE TABLEAU (ONGLET LISTE) ---
  return (
    <div className="container py-5" style={{ maxWidth: "850px" }}>
      <div className="bg-white p-5 shadow-sm border-0">
        <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
          <div>
            <span style={labelStyle}>Base de données</span>
            <h2 className="font-serif m-0" style={{ fontSize: "2rem" }}>Utilisateurs</h2>
          </div>
          <div className="d-flex align-items-center" style={{ borderBottom: "1px solid #e0e0e0" }}>
             <Search size={14} className="text-muted me-2" />
             <input 
               type="text" 
               placeholder="RECHERCHER..." 
               className="form-control border-0 shadow-none p-0"
               style={{ ...labelStyle, width: "150px", backgroundColor: "transparent" }}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-borderless m-0">
            <thead>
              <tr className="border-bottom">
                <th className="ps-0 py-3" style={labelStyle}>Membre</th>
                <th className="py-3 text-center" style={labelStyle}>Rôle</th>
                <th className="py-3 text-end pe-0" style={labelStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-bottom align-middle">
                  <td className="ps-0 py-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-dark text-white d-flex align-items-center justify-content-center me-3" style={{ width: "30px", height: "30px", fontSize: "0.7rem", fontWeight: "bold" }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="d-flex flex-col gap-4">
                        <span className="text-dark fw-bold" style={{ fontSize: "0.85rem" }}>{user.name}</span>
                        <span className="text-muted" style={{ fontSize: "0.7rem" }}>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center">
                    <span style={{ ...labelStyle, color: user.role === 'admin' ? '#000' : '#aaa' }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 text-end pe-0">
                    <button 
                      onClick={() => { setEditForm(user); setIsEditing(true); }}
                      className="btn btn-link text-dark p-1 me-2 shadow-none"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={async () => {
                        if(confirm("Supprimer ?")) {
                          await axios.delete(`${API_URL}/${user._id}`, authHeader);
                          setUsers(users.filter(u => u._id !== user._id));
                        }
                      }}
                      className="btn btn-link text-muted p-1 shadow-none hover-danger"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;