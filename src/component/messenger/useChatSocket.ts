import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Contact, Message } from './types';

const SOCKET_URL = "http://localhost:4000";

export const useChatSocket = (selectedContact: Contact | null) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const s: Socket = io(SOCKET_URL);
    setSocket(s);

    s.on('receive_message', (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && selectedContact) {
      socket.emit('join_room', selectedContact.id);
      // Optional: setMessages([]) or fetchHistory(selectedContact.id)
    }
  }, [socket, selectedContact]);

  const sendMessage = (text: string) => {
    if (socket && selectedContact) {
      const messageData: Message = {
        sender: 'me',
        text,
        receiverId: selectedContact.id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      socket.emit('send_message', messageData);
      setMessages((prev) => [...prev, messageData]);
    }
  };

  return { messages, sendMessage };
};