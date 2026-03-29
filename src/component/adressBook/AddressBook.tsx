import React, { useState, useMemo } from 'react';
import { ADDRESS_DATA } from './types';
import { AddressSection } from './AddressSection';

export const AddressBook: React.FC = () => {
  // 1. Track the selected ID in local state instead of the URL
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 2. Find the contact based on state
   const selectedContact = useMemo(() => {
    if (!selectedId) return null;
    for (const category of ADDRESS_DATA) {
      const contact = category.contacts.find(c => c.id === selectedId);
      if (contact) return { ...contact, categoryTitle: category.title, icon: category.icon };
    }
    return null;
  }, [selectedId]);

  // --- DETAIL VIEW ---
  if (selectedContact) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] px-6 py-10 lg:px-12 animate-in fade-in duration-500">
        <div className="mx-auto max-w-3xl">
          <button 
            onClick={() => setSelectedId(null)} // Reset state to go back to list
            className="group mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900"
          >
            <span className="text-lg">←</span> Retour à l'annuaire
          </button>

          <article className="bg-white shadow-sm border border-gray-200 rounded-sm flex p-4 ">
            <div className="h-1.5 w-full bg-emerald-800"></div>
            <div className="p-8 lg:p-12">
               {/* ... (Keep your existing Header and Content here) ... */}
               <h1 className="font-serif text-4xl font-black">{selectedContact.title}</h1>
               <p className="text-gray-600 mt-4">{selectedContact.description}</p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="min-h-screen bg-[#F9FAFB] px-6 py-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16 bg-white p-12 shadow-sm border-t-4 border-emerald-800">
          <h1 className="font-serif text-4xl font-black uppercase">Carnet d'Adresses</h1>
        </header>

        <div className="space-y-6">
          {ADDRESS_DATA.map((category, index) => (
            <AddressSection 
              key={index} 
              {...category} 
              onContactClick={(id) => setSelectedId(id)} // Pass the setter down
            />
          ))}
        </div>
      </div>
    </div>
  );
};