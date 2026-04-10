export interface Contact {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id?: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string; // ID de l'interlocuteur
  name: string;
  lastMessage: string;
  updatedAt: string;
  isOnline: boolean;
}