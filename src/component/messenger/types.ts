export interface Contact {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
}

export interface Message {
  id?: string | number;
  sender: 'me' | 'them';
  text: string;
  time: string;
  receiverId?: string | number;
}