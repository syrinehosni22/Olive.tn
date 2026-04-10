import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useChatSocket = (userId: string | null, contactId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;
    socket.current = io("http://localhost:5000");
    socket.current.emit("addUser", userId);

    socket.current.on("getMessage", (data) => {
      // On affiche seulement si ça vient du contact actuellement ouvert
      if (String(data.senderId) === String(contactId)) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => { socket.current?.disconnect(); };
  }, [userId, contactId]);

  useEffect(() => {
    if (userId && contactId) {
      fetch(`http://localhost:5000/api/messages/history/${userId}/${contactId}`)
        .then(res => res.json())
        .then(data => setMessages(Array.isArray(data) ? data : []));
    }
  }, [userId, contactId]);

  const sendMessage = useCallback((text: string) => {
    console.log(contactId,userId)
    if (socket.current && contactId && userId) {
      const msg = { senderId: userId, receiverId: contactId, text, createdAt: new Date().toISOString() };
      socket.current.emit("sendMessage", msg);
      setMessages((prev) => [...prev, msg]); // Mise à jour locale immédiate
    }
  }, [userId, contactId]);

  return { messages, sendMessage };
};