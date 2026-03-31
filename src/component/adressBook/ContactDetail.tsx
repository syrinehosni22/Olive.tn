import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ADDRESS_DATA } from './types';
// Import your ADDRESS_DATA from wherever it's stored
// import { ADDRESS_DATA } from './AddressBook'; 

const ContactDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 1. Flatten the nested data to find the specific contact
  const allContacts = ADDRESS_DATA.flatMap(category => 
    category.contacts.map(contact => ({ ...contact, categoryTitle: category.title }))
  );
  
  const contact = allContacts.find(c => c.id === id);

  // 2. Handle the "Not Found" case
  if (!contact) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">Contact non trouvé</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-olive-700 underline">
          Retour à l'annuaire
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6 lg:p-12">
      <div className="mx-auto max-w-3xl bg-white shadow-sm border p-8">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-olive-700"
        >
          ← Retour
        </button>

        <span className="text-xs font-bold uppercase tracking-widest text-olive-600">
          {contact.categoryTitle}
        </span>
        
        <h1 className="mt-2 font-serif text-4xl font-black text-gray-900">
          {contact.title}
        </h1>

        <div className="mt-4 inline-block px-3 py-1 rounded-md bg-gray-100 text-[10px] font-bold uppercase text-gray-600">
          {contact.badge}
        </div>

        <div className="mt-8 border-t pt-8">
          <h2 className="text-lg font-bold text-gray-800">Description</h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            {contact.description}
          </p>
        </div>

        {/* Placeholder for more info (Phone, Email, Map, etc.) */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="p-4 bg-gray-50 border rounded">
            <p className="text-xs font-bold text-gray-400 uppercase">Contact Direct</p>
            <p className="mt-1 font-medium text-gray-900">+216 -- --- ---</p>
          </div>
          <div className="p-4 bg-gray-50 border rounded">
            <p className="text-xs font-bold text-gray-400 uppercase">Localisation</p>
            <p className="mt-1 font-medium text-gray-900">Tunis, Tunisie</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;