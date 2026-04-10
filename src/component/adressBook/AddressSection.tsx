import React from 'react';
import { AddressCategory } from './types'; 

interface AddressSectionProps {
  category: AddressCategory;
  onProviderClick: (id: string) => void;
}

const styles = {
  sectionTitle: { 
    fontFamily: 'serif', 
    fontSize: '1.1rem', 
    marginBottom: '2rem', 
    color: '#000', 
    borderBottom: '1px solid #000', 
    paddingBottom: '8px', 
    textTransform: 'uppercase' as const, 
    letterSpacing: '1px' 
  },
  serviceLabel: { 
    fontSize: '0.65rem', 
    textTransform: 'uppercase' as const, 
    letterSpacing: '1.5px', 
    color: '#999', 
    fontWeight: '600', 
    display: 'block', 
    marginBottom: '15px' 
  },
  card: { 
    width: '100%',
    textAlign: 'left' as const,
    padding: '20px', 
    backgroundColor: '#fff', 
    border: '1px solid #f2f2f2', 
    borderRadius: '0', 
    transition: 'all 0.3s ease',
    outline: 'none',
    cursor: 'pointer'
  },
  providerName: { 
    display: 'block', 
    fontSize: '0.9rem', 
    fontWeight: '700', 
    color: '#000',
    marginBottom: '4px'
  },
  providerMeta: { 
    display: 'block', 
    fontSize: '0.7rem', 
    color: '#999', 
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  }
};

export const AddressSection: React.FC<AddressSectionProps> = ({ category, onProviderClick }) => {
  return (
    <section className="mb-5">
      {/* Titre de la Catégorie (ex: Logistique, Conseil...) */}
      <h2 style={styles.sectionTitle}>
        {category.title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.services.map((service) => (
          <div key={service.id} className="mb-4">
            {/* Label du Service (ex: Transport, Juridique...) */}
            <span style={styles.serviceLabel}>
              {service.title}
            </span>
            
            <ul className="list-unstyled p-0 m-0">
              {service.providers.map((provider) => (
                <li key={provider.id} className="mb-3">
                  <button
                    onClick={() => onProviderClick(provider.id)}
                    style={styles.card}
                    className="provider-card-hover" // Optionnel: pour un hover CSS personnalisé
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#f2f2f2';
                    }}
                  >
                    <span style={styles.providerName}>
                      {provider.name}
                    </span>
                    <span style={styles.providerMeta}>
                      {provider.location} • {provider.experience} ans exp.
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};