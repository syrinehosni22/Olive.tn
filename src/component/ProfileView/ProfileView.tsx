import React, { useState, useEffect, ChangeEvent } from 'react';
import { connect } from 'react-redux';
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

// These are the props we expect from Redux via connect
interface StateProps {
  reduxUser: User | null;
}

interface DispatchProps {
  dispatchUpdateUser: (user: any) => void;
}

// Combined Props
type ProfileViewProps = StateProps & DispatchProps;

const ProfileView: React.FC<ProfileViewProps> = ({ reduxUser, dispatchUpdateUser }) => {
  // Initialize local state with Redux data (or propData as fallback)
  const [formData, setFormData] = useState<User | null>(reduxUser );
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync local state if Redux state changes (e.g., login status changes)
  useEffect(() => {
    if (!reduxUser) {
      setFormData(reduxUser);
    }
  }, [reduxUser]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>, section?: 'seller') => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (!prev) return null;
      if (section) {
        return { 
          ...prev, 
          [section]: { ...(prev.seller || {}), [name]: value } 
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
      
      // Call the prop passed by mapDispatchToProps
      dispatchUpdateUser(updatedData.user || formData);
      
      alert("Profil mis à jour !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) return <div className="p-5 text-center font-serif">Chargement...</div>;

  // --- Styles remain the same ---
  const inputStyle = { border: 'none', borderBottom: '1px solid #e0e0e0', borderRadius: '0', padding: '10px 0', backgroundColor: 'transparent', fontSize: '0.9rem' };
  const labelStyle = { fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#999', marginBottom: '0' };

  return (
    <section className="container py-5" style={{ maxWidth: '850px' }}>
      <form onSubmit={handleSave}>
        {/* Header Section */}
        <div className="mb-5 pb-4 border-bottom">
          <p className="text-uppercase tracking-widest text-muted mb-2" style={{ fontSize: '0.7rem' }}>
            Compte / {formData.role}
          </p>
          <div className="d-flex justify-content-between align-items-end">
            <h1 style={{ fontFamily: 'serif', fontSize: '2.8rem', margin: 0 }}>Mon Profil</h1>
            <div className="text-end">
              <span className="badge rounded-pill bg-light text-dark border px-3 py-2" style={{ fontSize: '0.7rem' }}>
                PLAN: {formData.planId || 'BASIC'}
              </span>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger rounded-0 border-0 small">{error}</div>}

        <div className="row g-5">
          <div className="col-md-6">
            <div className="form-group">
              <label style={labelStyle}>Prénom</label>
              <input type="text" name="firstName" className="form-control" style={inputStyle} value={formData.firstName || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label style={labelStyle}>Nom</label>
              <input type="text" name="name" className="form-control" style={inputStyle} value={formData.name || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label style={labelStyle}>Téléphone</label>
              <input type="text" name="phone" className="form-control" style={inputStyle} value={formData.phone || ''} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label style={labelStyle}>Email</label>
              <input type="email" className="form-control" style={{...inputStyle, color: '#ccc', cursor: 'not-allowed'}} value={formData.email} disabled />
            </div>
          </div>
        </div>

        {formData.role === 'vendeur' && (
          <div className="mt-5 pt-5">
            <h3 className="font-serif mb-4" style={{ fontSize: '1.5rem' }}>Détails Professionnels</h3>
            <div className="row g-5">
              <div className="col-md-6">
                <div className="form-group">
                  <label style={labelStyle}>Matricule RNE</label>
                  <input type="text" name="registrationNumber" className="form-control" style={inputStyle} value={formData.seller?.registrationNumber || ''} onChange={(e) => handleChange(e, 'seller')} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label style={labelStyle}>Capacité Production (L/an)</label>
                  <input type="number" name="capacity" className="form-control" style={inputStyle} value={formData.seller?.capacity || 0} onChange={(e) => handleChange(e, 'seller')} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 pt-5 d-flex justify-content-end">
          <button type="submit" className="btn btn-dark rounded-pill px-5 py-3 text-uppercase tracking-widest" disabled={isSaving}>
            {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </section>
  );
};

// --- Redux Connection ---

const mapStateToProps = (state: RootState): StateProps => ({
  reduxUser: state.user.userInfo as User | null,
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  dispatchUpdateUser: (data) => dispatch(updateUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);