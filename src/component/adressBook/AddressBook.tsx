import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

interface Provider {
  id: string; // Identifiant unique (mappé depuis _id si nécessaire)
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

  // --- 1. CHARGEMENT DES DONNÉES DEPUIS LE BACKEND ---
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        // Appel à votre API Express
        const response = await axios.get("http://localhost:5000/api/user/providers");
        
        // Formatage pour garantir l'utilisation de 'id' au lieu de '_id'
        const formattedData = response.data.map((p: any) => ({
          ...p,
          id: p.id || p._id 
        }));
        
        setProviders(formattedData);
      } catch (err) {
        console.error("Erreur lors de la récupération des prestataires:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // --- 2. ORGANISATION PAR CATÉGORIES (serviceType) ---
  const categorizedProviders = useMemo(() => {
    return providers.reduce((acc: { [key: string]: Provider[] }, provider) => {
      const category = provider.serviceType || "Autres Services";
      if (!acc[category]) acc[category] = [];
      acc[category].push(provider);
      return acc;
    }, {});
  }, [providers]);

  // --- 3. GESTION DU PRÉSTATAIRE SÉLECTIONNÉ (DÉTAIL) ---
  const selectedProvider = useMemo(() => {
    return providers.find(p => p.id === selectedProviderId) || null;
  }, [selectedProviderId, providers]);

  // --- DESIGN SYSTEM (STRICTEMENT IDENTIQUE) ---
  const styles = {
    headerTitle: { fontFamily: 'serif', fontSize: '2.5rem', fontWeight: '300' as const, color: '#000' },
    subTitle: { fontFamily: 'serif', fontSize: '1.1rem', marginBottom: '1.5rem', marginTop: '2.5rem', color: '#000', borderBottom: '1px solid #000', paddingBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '1px' },
    label: { fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#999', fontWeight: '600', display: 'block', marginBottom: '8px' },
    card: { border: '1px solid #f2f2f2', borderRadius: '0', padding: '1.5rem', marginBottom: '1rem', backgroundColor: '#fff', cursor: 'pointer', transition: '0.3s' },
    buttonPrimary: { border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', fontWeight: '600', padding: '15px 40px', cursor: 'pointer', borderRadius: '0' },
    buttonLink: { background: 'none', border: 'none', color: '#999', fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', fontWeight: '600', cursor: 'pointer', padding: '0', textDecoration: 'none' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    description: { fontSize: '0.9rem', lineHeight: '1.8', color: '#444', fontStyle: 'italic' as const, marginBottom: '30px' }
  };

  if (loading) return <div className="container py-5 text-center">Chargement de l'annuaire certifié...</div>;

  // --- VUE DÉTAILLÉE (FICHE PRESTATAIRE) ---
  if (selectedProvider) {
    return (
      <section className="container py-5" style={{ maxWidth: '1100px' }}>
        <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
          <div>
            <span style={styles.label}>Expertise Oléicole / {(selectedProvider.serviceType || "Service").replace(/_/g, ' ')}</span>
            <h1 style={styles.headerTitle}>{selectedProvider.companyName || `${selectedProvider.firstName} ${selectedProvider.name}`}</h1>
          </div>
          <button onClick={() => setSelectedProviderId(null)} style={styles.buttonLink} className="pb-2 hover:text-dark">
            ← Retour
          </button>
        </header>

        <div className="fade-in pb-5">
          <h2 style={styles.subTitle}>Profil du prestataire</h2>
          <div style={{ border: '1px solid #f2f2f2', padding: '2rem', backgroundColor: '#fff' }}>
            <p style={styles.description}>
              {/* Note: Si vous ajoutez un champ description plus tard, il s'affichera ici */}
              "Prestataire certifié disponible sur la plateforme Olive Tn pour accompagner votre développement oléicole."
            </p>

            <div style={{ ...styles.grid, borderTop: '1px solid #f2f2f2', borderBottom: '1px solid #f2f2f2', padding: '25px 0', margin: '25px 0' }}>
              <div>
                <span style={styles.label}>Contact Direct</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{selectedProvider.firstName} {selectedProvider.name}</span>
              </div>
              <div>
                <span style={styles.label}>Localisation</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{selectedProvider.region || "Toute la Tunisie"}</span>
              </div>
              <div>
                <span style={styles.label}>Email Professionnel</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{selectedProvider.proEmail || selectedProvider.email}</span>
              </div>
              {selectedProvider.website && (
                <div>
                  <span style={styles.label}>Site Web</span>
                  <a href={selectedProvider.website} target="_blank" rel="noreferrer" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#000' }}>Visiter le site</a>
                </div>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <div style={{ maxWidth: '500px' }}>
                <span style={styles.label}>Mise en relation</span>
                <p style={{ fontSize: '0.7rem', color: '#999', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  En cliquant, une demande de contact sera initiée avec cet expert.
                </p>
              </div>
              
              <button 
                onClick={() => onContactSelect && onContactSelect(selectedProvider)}
                style={styles.buttonPrimary}
              >
                Envoyer un message
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- VUE LISTE (ANNUAIRE COMPLET) ---
  return (
    <section className="container py-5" style={{ maxWidth: '1100px' }}>
      <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
        <div>
          <span style={styles.label}>Plateforme B2B — Olive Tn</span>
          <h1 style={styles.headerTitle}>Annuaire des Experts</h1>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ ...styles.label, color: '#999', margin: 0 }}>
            Sélection certifiée des prestataires
          </p>
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
                  key={p.id} 
                  style={styles.card} 
                  className="provider-card-hover shadow-sm-hover"
                  onClick={() => setSelectedProviderId(p.id)}
                >
                  <span style={styles.label}>{p.region || 'National'}</span>
                  <h4 style={{ fontSize: '1.1rem', margin: '10px 0', fontWeight: '500', minHeight: '2.4em' }}>
                    {p.companyName || `${p.firstName} ${p.name}`}
                  </h4>
                  <p style={{ fontSize: '0.7rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0' }}>
                    Voir la fiche expert →
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-5 pt-5 border-top text-center">
        <p style={{ ...styles.label, color: '#ccc', letterSpacing: '4px', marginTop: '40px' }}>
          Zynex Solution — Olive Tn Excellence
        </p>
      </footer>
    </section>
  );
};

export default AddressBook;