import React from 'react';
import { Send, Paperclip, MoreVertical } from 'lucide-react';
import { Message } from './types';

interface ChatProps {
  contactName: string;
  messages: Message[];
  currentUserId: string;
  inputValue: string;
  setInputValue: (v: string) => void;
  onSend: (e: React.FormEvent) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const ChatWindow: React.FC<ChatProps> = ({ contactName, messages, currentUserId, inputValue, setInputValue, onSend, scrollRef }) => (
  <div className="d-flex flex-column flex-1 h-100 bg-white">
    <header className="p-3 border-bottom d-flex justify-content-between align-items-center">
      <div>
        <h3 className="h6 mb-0" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>{contactName}</h3>
        <span style={{ fontSize: '0.6rem', color: '#2ecc71', fontWeight: 'bold' }}>● EN LIGNE</span>
      </div>
      <MoreVertical size={18} className="text-muted" />
    </header>

    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 bg-[#fcfcfc]">
      {messages.map((msg, i) => {
        const isMine = String(msg.senderId) === currentUserId;
        return (
          <div key={i} className={`d-flex flex-column ${isMine ? 'align-items-end' : 'align-items-start'} mb-3`}>
            <div style={{ 
              padding: '10px 16px', maxWidth: '75%', fontSize: '0.85rem',
              backgroundColor: isMine ? '#000' : '#fff',
              color: isMine ? '#fff' : '#000',
              border: isMine ? 'none' : '1px solid #eee',
              borderRadius: isMine ? '12px 12px 0 12px' : '12px 12px 12px 0'
            }}>
              {msg.text}
            </div>
            <small className="text-muted mt-1" style={{ fontSize: '0.55rem' }}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </small>
          </div>
        );
      })}
    </div>

    <form onSubmit={onSend} className="p-3 border-top d-flex align-items-center gap-2">
      <Paperclip size={20} className="text-muted" />
      <input 
        className="flex-1 border-0 outline-none" 
        style={{ fontSize: '0.9rem' }}
        placeholder="Écrire un message..." 
        value={inputValue} 
        onChange={e => setInputValue(e.target.value)} 
      />
      <button type="submit" disabled={!inputValue.trim()} className="btn btn-dark btn-sm px-4">ENVOYER</button>
    </form>
  </div>
);
export default ChatWindow;