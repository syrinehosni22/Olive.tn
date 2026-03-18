import React, { useState, useEffect, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { updateUser } from '../../redux/slices/authSlice';
import { UserData } from '../../component/dashboard/user';

// --- Interfaces ---
interface SellerData { registrationNumber?: string; capacity?: number; }
interface User extends UserData {
  planId?: string;
  phone?: string;
  seller?: SellerData;
}

interface ProfileViewProps {
  userData: UserData; // Prop from ContentRenderer
}

const ProfileView: React.FC<ProfileViewProps> = ({ userData: propData }) => {
  const dispatch = useDispatch();
  
  // 1. Get data from Redux if available
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  // 2. Initialize state IMMEDIATELY with propData to avoid "loading" block
  // We use a function initializer to ensure this only runs once
  const [formData, setFormData] = useState<User | null>(() => {
    return (reduxUser as User) || (propData as User) || null;
  });

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Keep local state in sync if Redux or Props update externally
  useEffect(() => {
    if (reduxUser) {
      setFormData(reduxUser as User);
    } else if (propData) {
      setFormData(propData as User);
    }
  }, [reduxUser, propData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
    section?: 'seller'
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      if (section) {
        return {
          ...prev,
          [section]: { ...prev[section], [name]: value }
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/user/profile/update', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      const updatedData = await response.json();

      // Update Redux global state
      dispatch(updateUser(updatedData.user || formData));
      
      alert("Profil mis à jour !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // If we truly have no data from either Redux or Props, show loading
  if (!formData) return <div className="p-5 text-center">Chargement...</div>;

  return (
    <section className="container py-4">
      <form onSubmit={handleSave}>
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          {/* FIXED: Use formData, not props or userData */}
          <h2 style={{ fontFamily: 'serif' }}>Mon Profil ({formData.role})</h2>
          <span className="badge bg-dark">Plan: {formData.planId || 'Basic'}</span>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3 mb-5">
          <div className="col-md-6">
            <label className="form-label">Prénom</label>
            <input type="text" name="firstName" className="form-control" value={formData.firstName || ''} onChange={(e) => handleChange(e)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nom</label>
            <input type="text" name="name" className="form-control" value={formData.name || ''} onChange={(e) => handleChange(e)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Téléphone</label>
            <input type="text" name="phone" className="form-control" value={formData.phone || ''} onChange={(e) => handleChange(e)} />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control bg-light" value={formData.email} disabled />
          </div>
        </div>

        {formData.role === 'vendeur' && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">Détails Professionnels</div>
            <div className="card-body row g-3">
              <div className="col-md-6">
                <label className="form-label">Matricule RNE</label>
                <input 
                  type="text" 
                  name="registrationNumber" 
                  className="form-control" 
                  value={formData.seller?.registrationNumber || ''} 
                  onChange={(e) => handleChange(e, 'seller')} 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Capacité Production</label>
                <input 
                  type="number" 
                  name="capacity" 
                  className="form-control" 
                  value={formData.seller?.capacity || 0} 
                  onChange={(e) => handleChange(e, 'seller')} 
                />
              </div>
            </div>
          </div>
        )}

        <div className="text-end">
          <button type="submit" className="btn btn-dark btn-lg" disabled={isSaving}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProfileView;