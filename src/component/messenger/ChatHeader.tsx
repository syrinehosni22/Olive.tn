import React from 'react';
import { Phone, Video, Info } from 'lucide-react';
import { Contact } from './types';

interface ChatHeaderProps {
  contact: Contact | null; // Updated to allow null
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  // Guard clause: returns nothing if contact is null
  if (!contact) return null;

  return (
    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
          {contact.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-bold text-gray-900 leading-tight">{contact.name}</h2>
          <p className="text-xs text-emerald-500 flex items-center">
            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5"></span> En ligne
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4 text-gray-400">
        <Phone size={18} className="hover:text-emerald-600 cursor-pointer transition-colors" />
        <Video size={18} className="hover:text-emerald-600 cursor-pointer transition-colors" />
        <Info size={18} className="hover:text-emerald-600 cursor-pointer transition-colors" />
      </div>
    </div>
  );
};