import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '../../redux/store';
import { useChatSocket } from './useChatSocket';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { Conversation, Contact } from './types';

const API_BASE_URL = 'http://localhost:5000/api/messages';

const MessengerPage: React.FC<{ 
  selectedContact: Contact | null; 
  setTab: (t: string) => void; 
  setSelectedContact: (c: Contact) => void 
}> = ({ selectedContact, setTab, setSelectedContact }) => {
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [input, setInputValue] = useState("");
  const user = useSelector((state: RootState) => state.user);
  const currentUserId = user.id ? String(user.id) : null;
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChatSocket(
    currentUserId, 
    selectedContact?.id ? String(selectedContact.id) : null
  );

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/contacts/${currentUserId}`);
      if (Array.isArray(res.data)) setConversations(res.data);
    } catch (err) { console.error(err); }
  }, [currentUserId]);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Rafraîchir la sidebar quand un nouveau message arrive
  useEffect(() => {
    if (messages.length > 0) fetchConversations();
  }, [messages, fetchConversations]);

  // Scroll auto
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInputValue("");
    }
  };

  return (
    <div className="d-flex border shadow-sm overflow-hidden" style={{ height: '750px', backgroundColor: '#fff', borderRadius: '8px' }}>
      <ConversationList 
        conversations={conversations} 
        selectedId={selectedContact?.id} 
        onSelect={(c: any) => setSelectedContact({ id: c.id, name: c.name } as Contact)}
        onOpenContacts={() => setTab('contacts')}
      />

      {selectedContact && currentUserId ? (
        <ChatWindow 
          contactName={selectedContact.name}
          messages={messages}
          currentUserId={currentUserId}
          inputValue={input}
          setInputValue={setInputValue}
          onSend={handleSend}
          scrollRef={scrollRef}
        />
      ) : (
        <div className="flex-1 d-flex flex-column align-items-center justify-content-center text-muted bg-light">
          <h3 style={{ fontFamily: 'serif', color: '#ccc' }}>Messenger</h3>
          <p className="small">Sélectionnez une discussion pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default MessengerPage;