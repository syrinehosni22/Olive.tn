import { 
  User, 
  ShoppingBasket, 
  CircleDollarSign, 
  Package, 
  Store, 
  Truck, 
  MessageSquare, 
  BookUser, 
  FilePlus,      // Pour publier une offre (Acheteur)
  ClipboardList, // Pour consulter les appels d'offres (Vendeur)
  LucideIcon 
} from 'lucide-react';

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  label: string;
}

export interface RoleConfig {
  title: string;
  primaryColor: string;
  menu: MenuItem[];
}

export const ROLE_THEMES: Record<string, RoleConfig> = {
  vendeur: {
    title: "Compte Vendeur",
    primaryColor: "#848681",
    menu: [
      { id: 'profile', icon: User, label: 'Profil' },
      { id: 'inventory', icon: ShoppingBasket, label: 'Mes Huiles' },
      // NOUVEAU : Permet au vendeur de voir ce que les acheteurs recherchent
      { id: 'marketRequests', icon: ClipboardList, label: 'Appels d’offres' }, 
      { id: 'addressBook', icon: BookUser, label: 'Carnet d’adresses' },
      { id: 'messages', icon: MessageSquare, label: 'Messages' },
      { id: 'sales', icon: CircleDollarSign, label: 'Ventes' },
    ]
  },
  acheteur: {
    title: "Compte Acheteur",
    primaryColor: "#A3AC95",
    menu: [
      { id: 'profile', icon: User, label: 'Profil' },
      { id: 'market', icon: Store, label: 'Marché' },
      // NOUVEAU : Permet à l'acheteur de publier son besoin technique
      { id: 'publishOffer', icon: FilePlus, label: 'Publier une Offre' }, 
      { id: 'messages', icon: MessageSquare, label: 'Messages' },
      { id: 'orders', icon: Package, label: 'Commandes' },
    ]
  },
  prestataire: {
    title: "Service Pro",
    primaryColor: "#E0DEB3",
    menu: [
      { id: 'profile', icon: User, label: 'Profil' },
      { id: 'services', icon: Truck, label: 'Services' },
      { id: 'messages', icon: MessageSquare, label: 'Messages' },
    ]
  },
  admin: {
    title: "Administration Centrale",
    primaryColor: "#0f172a", // Navy sombre pour marquer l'autorité
    menu: [
      { id: 'profile', icon: User, label: 'Mon Profil' },
      { id: 'manageUsers', icon: BookUser, label: 'Utilisateurs' },
      { id: 'inventory', icon: Package, label: 'Tous les Lots' }, // Voir tout l'inventaire
      { id: 'marketRequests', icon: ClipboardList, label: 'Toutes les Demandes' }, // Voir tous les buy requests
      { id: 'messages', icon: MessageSquare, label: 'Support Client' },
    ]
  }
};