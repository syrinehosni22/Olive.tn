import React, { useState } from 'react';
import { Search, Users } from 'lucide-react';
import { Conversation } from './types';

const ConversationList: React.FC<{ conversations: Conversation[], selectedId?: any, onSelect: any, onOpenContacts: any }> = 
({ conversations, selectedId, onSelect, onOpenContacts }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: '350px' }} className="border-right d-flex flex-column bg-white h-100">
      <div className="p-4 border-bottom">
        <div className="d-flex justify-content-between mb-3 align-items-center">
          <h2 style={{ fontFamily: 'serif', fontSize: '1.4rem', margin: 0 }}>Messages</h2>
          <Users size={18} className="text-muted" style={{ cursor: 'pointer' }} onClick={onOpenContacts} />
        </div>
        <div className="d-flex align-items-center bg-[#f9f9f9] rounded px-3 py-2">
          <Search size={14} className="text-muted me-2" />
          <input 
            className="w-100 border-0 bg-transparent" 
            style={{ fontSize: '0.8rem', outline: 'none' }}
            placeholder="Rechercher un contact..." 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {filtered.map(c => (
          <div 
            key={c.id} 
            onClick={() => onSelect(c)} 
            className={`p-3 border-bottom d-flex gap-3 align-items-center ${String(selectedId) === String(c.id) ? 'bg-light border-left border-dark' : ''}`} 
            style={{ cursor: 'pointer' }}
          >
            <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              {c.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="d-flex justify-content-between align-items-baseline">
                <span className="fw-bold small">{c.name}</span>
                <small className="text-muted" style={{ fontSize: '0.6rem' }}>
                  {c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </small>
              </div>
              <p className="text-muted small m-0 text-truncate">{c.lastMessage || "Nouveau contact"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ConversationList;