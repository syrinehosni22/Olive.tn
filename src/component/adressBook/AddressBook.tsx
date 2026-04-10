import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

interface Provider {
  _id: string; // ou id selon votre backend
  firstName: string;
  name: string;
  companyName: string;
  serviceType: string;
  email: string;
  proEmail: string;
  phone: string;
  website?: string;
  region?: string;
}

interface AddressBookProps {
  onContactSelect?: (contact: any) => void;
}

export const AddressBook: React.FC<AddressBookProps> = ({ onContactSelect }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // 1. Fetch des données depuis le backend
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        // On récupère uniquement les utilisateurs ayant le rôle 'prestataire'
        const response = await axios.get("http://localhost:5000/api/user/providers");
        setProviders(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des prestataires:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // 2. Organisation des données par catégories (serviceType)
  const categorizedProviders = useMemo(() => {
    return providers.reduce((acc: { [key: string]: Provider[] }, provider) => {
      const category = provider.serviceType || "Autres Services";
      if (!acc[category]) acc[category] = [];
      acc[category].push(provider);
      return acc;
    }, {});
  }, [providers]);

  // 3. Gestion du prestataire sélectionné (Vue Détail)
  const selectedProvider = useMemo(() => {
    return providers.find(p => p._id === selectedProviderId) || null;
  }, [selectedProviderId, providers]);

  const styles = {
    headerTitle: { fontFamily: 'serif', fontSize: '2.5rem', fontWeight: '300' as const, color: '#000' },
    subTitle: { fontFamily: 'serif', fontSize: '1.1rem', marginBottom: '1.5rem', marginTop: '2.5rem', color: '#000', borderBottom: '1px solid #000', paddingBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '1px' },
    label: { fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#999', fontWeight: '600', display: 'block', marginBottom: '8px' },
    card: { border: '1px solid #f2f2f2', borderRadius: '0', padding: '1.5rem', marginBottom: '1rem', backgroundColor: '#fff', cursor: 'pointer', transition: '0.3s' },
    buttonPrimary: { border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', fontWeight: '600', padding: '15px 40px', cursor: 'pointer', borderRadius: '0' },
    buttonLink: { background: 'none', border: 'none', color: '#999', fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', fontWeight: '600', cursor: 'pointer', padding: '0', textDecoration: 'none' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }
  };

  if (loading) return <div className="container py-5 text-center">Chargement de l'annuaire...</div>;

  // --- VUE DÉTAILLÉE ---
  if (selectedProvider) {
    return (
      <section className="container py-5" style={{ maxWidth: '1100px' }}>
        <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
          <div>
            <span style={styles.label}>Prestataire / {selectedProvider.serviceType}</span>
            <h1 style={styles.headerTitle}>{selectedProvider.companyName || `${selectedProvider.firstName} ${selectedProvider.name}`}</h1>
          </div>
          <button onClick={() => setSelectedProviderId(null)} style={styles.buttonLink}>← Retour</button>
        </header>

        <div className="fade-in pb-5">
          <div style={{ border: '1px solid #f2f2f2', padding: '2rem' }}>
            <h2 style={styles.subTitle}>Informations Professionnelles</h2>
            <div style={styles.grid}>
              <div>
                <span style={styles.label}>Contact</span>
                <p>{selectedProvider.firstName} {selectedProvider.name}</p>
              </div>
              <div>
                <span style={styles.label}>Email Pro</span>
                <p>{selectedProvider.proEmail || selectedProvider.email}</p>
              </div>
              <div>
                <span style={styles.label}>Localisation</span>
                <p>{selectedProvider.region || "Non spécifiée"}</p>
              </div>
              {selectedProvider.website && (
                <div>
                  <span style={styles.label}>Site Web</span>
                  <p><a href={selectedProvider.website} target="_blank" rel="noreferrer" style={{color: '#000'}}>{selectedProvider.website}</a></p>
                </div>
              )}
            </div>
            
            <div className="mt-5 pt-4 border-top">
              <button 
                style={styles.buttonPrimary}
                onClick={() => onContactSelect && onContactSelect(selectedProvider)}
              >
                Contacter l'expert
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- VUE LISTE ---
  return (
    <section className="container py-5" style={{ maxWidth: '1100px' }}>
      <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
        <div>
          <span style={styles.label}>Plateforme B2B — Olive Tn</span>
          <h1 style={styles.headerTitle}>Annuaire des Experts</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>
            {Object.keys(categorizedProviders).length} Domaines d'expertise
          </span>
        </div>
      </header>

      <div className="fade-in">
        {Object.entries(categorizedProviders).map(([categoryName, providersList]) => (
          <div key={categoryName} className="mb-5">
            <h3 style={styles.subTitle}>{categoryName.replace(/_/g, ' ')}</h3>
            <div style={styles.grid}>
              {providersList.map((p) => (
                <div 
                  key={p._id} 
                  style={styles.card} 
                  className="provider-card-hover"
                  onClick={() => setSelectedProviderId(p._id)}
                >
                  <span style={styles.label}>{p.region || 'National'}</span>
                  <h4 style={{ fontSize: '1.1rem', margin: '10px 0', fontWeight: '500' }}>
                    {p.companyName || `${p.firstName} ${p.name}`}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0' }}>
                    Expert en {categoryName.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-5 pt-5 border-top text-center">
        <p style={{ ...styles.label, color: '#ccc', letterSpacing: '4px' }}>
          Zynex Solution — Olive Tn Excellence
        </p>
      </footer>
    </section>
  );
};
export default AddressBook;