import React, { useState, useMemo } from 'react';
import { ADDRESS_DATA } from './types'; 
import { AddressSection } from './AddressSection';

interface AddressBookProps {
  onContactSelect?: (contact: any) => void;
}

export const AddressBook: React.FC<AddressBookProps> = ({ onContactSelect }) => {
  // On stocke l'ID du prestataire sélectionné
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Recherche du prestataire dans la structure profonde
  const selectedProvider = useMemo(() => {
    if (!selectedProviderId) return null;

    for (const category of ADDRESS_DATA) {
      for (const service of category.services) { // On descend d'un niveau (le service)
        const provider = service.providers.find(p => p.id === selectedProviderId);
        if (provider) {
          return { 
            ...provider, 
            serviceTitle: service.title,
            categoryTitle: category.title 
          };
        }
      }
    }
    return null;
  }, [selectedProviderId]);

  // --- VUE DÉTAILLÉE DU PRESTATAIRE ---
  if (selectedProvider) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-10 lg:px-12 animate-in fade-in duration-500">
        <div className="mx-auto max-w-3xl">
          <button 
            onClick={() => setSelectedProviderId(null)} 
            className="group mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors"
          >
            <span className="text-lg">←</span> Retour aux services
          </button>

          <article className="bg-white shadow-sm border border-gray-200 rounded-sm overflow-hidden">
            <div className="h-1.5 w-full bg-emerald-800"></div>
            <div className="p-8 lg:p-12">
              <div className="flex justify-between items-start">
                <span className="text-emerald-800 font-bold text-xs uppercase tracking-widest">
                  {selectedProvider.categoryTitle} / {selectedProvider.serviceTitle}
                </span>
              </div>
              
              <h1 className="font-serif text-4xl font-black mt-4 mb-2 text-gray-900">
                {selectedProvider.name} {/* Nom de la personne ou entreprise */}
              </h1>
              
              <div className="prose prose-slate max-w-none mt-6">
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  { selectedProvider.description}
                </p>
              </div>

              {/* Infos spécifiques au prestataire (ex: Localisation, prix) */}
              <div className="bg-gray-50 p-4 rounded-md mb-8 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-gray-400 uppercase text-[10px] font-bold">Localisation</span>
                  <span className="font-medium text-gray-900">{selectedProvider.location}</span>
                </div>
                <div>
                  <span className="block text-gray-400 uppercase text-[10px] font-bold">Expérience</span>
                  <span className="font-medium text-gray-900">{selectedProvider.experience} ans</span>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900">Contacter {selectedProvider.name}</h4>
                  <p className="text-gray-500 text-sm">Ce prestataire recevra vos coordonnées par email.</p>
                </div>
                
                <button 
                  onClick={() => {
                    if (onContactSelect) {
                      onContactSelect({
                        providerId: selectedProvider.id,
                        name: selectedProvider.name,
                        service: selectedProvider.serviceTitle,
                        email: selectedProvider.email
                      });
                    }
                  }}
                  className="w-full sm:w-auto bg-emerald-800 text-white hover:bg-emerald-900 px-8 py-4 text-sm font-bold uppercase tracking-widest transition-all"
                >
                  Envoyer un message
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // --- VUE LISTE ---
  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 bg-white p-12 shadow-sm border-t-4 border-emerald-800 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-5xl font-black uppercase text-gray-900">Annuaire des Prestataires</h1>
            <p className="text-gray-500 mt-2 font-medium">Trouvez l'expert adapté à vos besoins oléicoles</p>
          </div>
        </header>

        <div className="space-y-12">
          {ADDRESS_DATA.map((category, index) => (
            <AddressSection 
              key={index} 
              category={category}
              onProviderClick={(id) => setSelectedProviderId(id)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};