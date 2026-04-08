import React, { RefObject } from 'react';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
  scrollRef: RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, scrollRef }) => (
  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
    {messages.map((msg, index) => (
      <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
        <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
          msg.sender === 'me' 
            ? 'bg-emerald-600 text-white rounded-tr-none' 
            : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
        }`}>
          <p className="text-sm">{msg.text}</p>
          <p className={`text-[10px] mt-1 ${msg.sender === 'me' ? 'text-emerald-100' : 'text-gray-400'}`}>
            {msg.time}
          </p>
        </div>
      </div>
    ))}
  </div>
);