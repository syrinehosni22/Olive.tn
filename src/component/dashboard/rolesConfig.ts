import { User, ShoppingBasket, CircleDollarSign, Package, Store, Truck, MessageSquare, LucideIcon } from 'lucide-react';

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
    primaryColor: "#C2C2C2",
    menu: [
      { id: 'profile', icon: User, label: 'Profil' },
      { id: 'inventory', icon: ShoppingBasket, label: 'Mes Huiles' },
      { id: 'sales', icon: CircleDollarSign, label: 'Ventes' },
    ]
  },
  acheteur: {
    title: "Compte Acheteur",
    primaryColor: "#A3AC95",
    menu: [
      { id: 'profile', icon: User, label: 'Profil' },
      { id: 'market', icon: Store, label: 'Marché' },
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
  }
};