import React from 'react';
// Importez vos types selon votre structure
import { AddressCategory } from './types'; 

interface AddressSectionProps {
  category: AddressCategory; // On définit explicitement qu'on reçoit l'objet category
  onProviderClick: (id: string) => void;
}

export const AddressSection: React.FC<AddressSectionProps> = ({ category, onProviderClick }) => {
  return (
    <section className="mb-12">
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-emerald-100">
        {category.title}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.services.map((service) => (
          <div key={service.id} className="space-y-4">
            <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">
              {service.title}
            </h3>
            
            {/* Liste des prestataires pour ce service */}
            <ul className="space-y-2">
              {service.providers.map((provider) => (
                <li key={provider.id}>
                  <button
                    onClick={() => onProviderClick(provider.id)}
                    className="w-full text-left p-4 bg-white border border-gray-100 hover:border-emerald-500 hover:shadow-md transition-all group"
                  >
                    <span className="block font-bold text-gray-900 group-hover:text-emerald-800">
                      {provider.name}
                    </span>
                    <span className="text-xs text-gray-500 italic">
                      {provider.location}
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