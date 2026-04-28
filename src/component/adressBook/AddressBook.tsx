import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, Briefcase, X, ArrowRight, Settings, Globe, Linkedin, Facebook, Instagram } from 'lucide-react';
import { API_BASE_URL } from "../../config/api";

// Interface alignée sur la structure d'objet imbriqué du backend
interface Provider {
  _id: string;
  firstName: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  role: string;
  // Les données spécifiques sont dans l'objet provider
  provider: {
    serviceType: string;
    proEmail: string;
    website?: string;
    region?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface AddressBookProps {
  onContactSelect?: (contact: any) => void;
}

export const AddressBook: React.FC<AddressBookProps> = ({ onContactSelect }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/user/providers`);
        setProviders(response.data);
      } catch (err) {
        console.error("Erreur chargement prestataires:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProviders();
  }, []);

  // --- FILTRAGE MULTI-CRITÈRES (Recherche dans les sous-objets) ---
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const searchContent = `
        ${p.companyName} 
        ${p.firstName} 
        ${p.name} 
        ${p.provider?.region || ''} 
        ${p.provider?.serviceType || ''}
      `.toLowerCase();
      return searchContent.includes(searchTerm.toLowerCase());
    });
  }, [providers, searchTerm]);

  // Regroupement par type de service (accès via p.provider.serviceType)
  const categorizedProviders = useMemo(() => {
    return filteredProviders.reduce((acc: { [key: string]: Provider[] }, provider) => {
      const category = provider.provider?.serviceType || "Expertise Générale";
      if (!acc[category]) acc[category] = [];
      acc[category].push(provider);
      return acc;
    }, {});
  }, [filteredProviders]);

  const selectedProvider = useMemo(() => {
    return providers.find(p => p._id === selectedProviderId) || null;
  }, [selectedProviderId, providers]);

  const styles = {
    headerTitle: { fontFamily: 'serif', fontSize: '2.5rem', fontWeight: '300' as const, color: '#000' },
    subTitle: { fontFamily: 'serif', fontSize: '1.1rem', marginBottom: '1.5rem', marginTop: '2.5rem', color: '#000', borderBottom: '1px solid #000', paddingBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '10px' },
    label: { fontSize: '0.6rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#999', fontWeight: '700', display: 'block', marginBottom: '5px' },
    card: { border: '1px solid #f2f2f2', borderRadius: '0', padding: '1.5rem', backgroundColor: '#fff', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative' as const },
    buttonPrimary: { border: 'none', backgroundColor: '#000', color: '#fff', fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', fontWeight: '600', padding: '15px 40px', cursor: 'pointer', borderRadius: '0' },
    searchBar: { position: 'relative' as const, marginBottom: '50px', borderBottom: '2px solid #000' },
    typeBadge: { fontSize: '0.55rem', padding: '3px 8px', backgroundColor: '#000', color: '#fff', fontWeight: 'bold' as const, position: 'absolute' as const, top: '0', right: '0', textTransform: 'uppercase' as const }
  };

  if (loading) return <div className="container py-5 text-center small fw-bold tracking-widest text-uppercase">Chargement de l'annuaire...</div>;

  // --- VUE DÉTAILLÉE (FICHE EXPERT) ---
  if (selectedProvider) {
    return (
      <section className="container py-5 fade-in" style={{ maxWidth: '1100px' }}>
        <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
          <div>
            <span style={styles.label}>Profil Expert Certifié</span>
            <h1 style={styles.headerTitle}>{selectedProvider.companyName || `${selectedProvider.firstName} ${selectedProvider.name}`}</h1>
          </div>
          <button onClick={() => setSelectedProviderId(null)} className="btn btn-link text-dark fw-bold text-decoration-none small pb-2">← Retour à l'annuaire</button>
        </header>

        <div style={{ border: '1px solid #f2f2f2', padding: '3rem', backgroundColor: '#fff' }}>
          <div className="mb-5">
             <span className="badge bg-dark rounded-0 px-3 py-2 text-uppercase mb-3" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
                {selectedProvider.provider?.serviceType?.replace(/_/g, ' ')}
             </span>
          </div>

          <div className="row g-5 mb-5 pb-5 border-bottom">
            <div className="col-md-4 border-end">
               <span style={styles.label}>Domaine d'Expertise</span>
               <div className="d-flex align-items-center gap-2 mt-1">
                  <Settings size={16} className="text-muted" />
                  <span className="fw-bold text-uppercase" style={{ fontSize: '0.9rem' }}>
                    {selectedProvider.provider?.serviceType?.replace(/_/g, ' ')}
                  </span>
               </div>
            </div>
            
            <div className="col-md-4 border-end">
               <span style={styles.label}>Responsable Officiel</span>
               <span className="d-block fw-bold" style={{ fontSize: '0.9rem' }}>{selectedProvider.firstName} {selectedProvider.name}</span>
            </div>

            <div className="col-md-4">
               <span style={styles.label}>Siège / Région</span>
               <span className="d-block fw-bold" style={{ fontSize: '0.9rem' }}>
                <MapPin size={14} className="me-1 text-muted"/> 
                {selectedProvider.provider?.region || "Tunisie (National)"}
               </span>
            </div>
          </div>

          <div className="row g-5 mb-5">
             <div className="col-md-4">
                <span style={styles.label}>Email de contact</span>
                <span className="d-block fw-bold" style={{ fontSize: '0.9rem' }}>{selectedProvider.provider?.proEmail || selectedProvider.email}</span>
             </div>
             <div className="col-md-4">
                <span style={styles.label}>Téléphone</span>
                <span className="d-block fw-bold" style={{ fontSize: '0.9rem' }}>{selectedProvider.phone}</span>
             </div>
             {selectedProvider.provider?.website && (
               <div className="col-md-4">
                  <span style={styles.label}>Présence Web</span>
                  <a href={selectedProvider.provider.website} target="_blank" rel="noreferrer" className="text-dark fw-bold d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                    <Globe size={14}/> Visiter le site web
                  </a>
               </div>
             )}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
            <div className="d-flex gap-3">
              {selectedProvider.provider?.linkedin && <Linkedin size={18} className="text-muted cursor-pointer" />}
              {selectedProvider.provider?.facebook && <Facebook size={18} className="text-muted cursor-pointer" />}
              {selectedProvider.provider?.instagram && <Instagram size={18} className="text-muted cursor-pointer" />}
            </div>
            <button onClick={() => onContactSelect && onContactSelect(selectedProvider)} style={styles.buttonPrimary}>
              Démarrer une conversation
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container py-5" style={{ maxWidth: '1100px' }}>
      <header className="mb-5">
        <span style={styles.label}>Réseau de confiance — Olive Tn</span>
        <h1 style={styles.headerTitle} className="mb-4">Annuaire des Experts</h1>
        
        <div style={styles.searchBar} className="d-flex align-items-center">
          <Search size={20} className="me-3 text-muted" />
          <input 
            type="text" 
            placeholder="RECHERCHER PAR TYPE, SOCIÉTÉ, RESPONSABLE OU RÉGION..." 
            style={{ border: 'none', outline: 'none', padding: '15px 0', fontSize: '0.85rem', letterSpacing: '1px', flex: 1, textTransform: 'uppercase' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && <X size={18} className="ms-2 cursor-pointer" onClick={() => setSearchTerm("")} style={{ cursor: 'pointer' }} />}
        </div>
      </header>

      <div className="fade-in">
        {Object.entries(categorizedProviders).map(([categoryName, providersList]) => (
          <div key={categoryName} className="mb-5">
            <h3 style={styles.subTitle}>
              <Briefcase size={18} className="text-muted" />
              {categoryName.replace(/_/g, ' ')}
            </h3>
            
            <div className="row g-4">
              {providersList.map((p) => (
                <div className="col-md-4" key={p._id}>
                  <div 
                    style={styles.card} 
                    className="h-100 hover-border-dark shadow-sm-hover border"
                    onClick={() => setSelectedProviderId(p._id)}
                  >
                    <div style={styles.typeBadge}>
                      {p.provider?.serviceType?.replace(/_/g, ' ')}
                    </div>

                    <span style={styles.label}>{p.provider?.region || 'National'}</span>
                    <h4 style={{ fontSize: '1.1rem', margin: '15px 0', fontWeight: '700', fontFamily: 'serif', minHeight: '50px' }}>
                      {p.companyName || `${p.firstName} ${p.name}`}
                    </h4>
                    
                    <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                      <span className="small text-muted fw-bold" style={{ fontSize: '0.5rem', letterSpacing: '1px' }}>VOIR LA FICHE EXPERT</span>
                      <ArrowRight size={14} className="text-dark" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(categorizedProviders).length === 0 && (
          <div className="text-center py-5 border bg-light">
            <p className="text-muted small text-uppercase tracking-widest">Aucun résultat pour "{searchTerm}"</p>
            <button onClick={() => setSearchTerm("")} className="btn btn-dark btn-sm rounded-0 px-4 mt-2">Réinitialiser</button>
          </div>
        )}
      </div>

      <style>{`
        .hover-border-dark:hover {
          border-color: #000 !important;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08) !important;
        }
        .fade-in { animation: fadeIn 0.4s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </section>
  );
};

export default AddressBook;