import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Users } from 'lucide-react'; // Ajout de Users
import { useChatSocket } from './useChatSocket';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { Contact } from './types';

interface MessengerPageProps {
  selectedContact: Contact | null;
  setTab: (tab: string) => void;
}

const MessengerPage: React.FC<MessengerPageProps> = ({ selectedContact, setTab }) => {
  const [input, setInput] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage } = useChatSocket(selectedContact);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex h-[600px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {selectedContact ? (
          <>
            <ChatHeader contact={selectedContact} />
            <MessageList messages={messages} scrollRef={scrollRef} />
            
            <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-3">
              <button type="button" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              />
              <button 
                type="submit" 
                disabled={!input.trim()}
                className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          /* Écran vide / Sélection de contact */
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Vos messages</h3>
            <p className="text-gray-500 mb-6 max-w-xs">
              Sélectionnez un contact dans votre carnet d'adresses pour commencer à discuter.
            </p>
            <button
              onClick={() => setTab('contacts')} // Redirige vers l'onglet contacts
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
            >
              Ouvrir le carnet d'adresses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessengerPage;