import React from 'react';
import { 
  Truck, CheckCircle, Search, Star, Globe, 
  Percent, ShieldCheck, Mail, MessageSquare, BarChart3, 
  Handshake, Users, MousePointerClick, ShoppingCart 
} from 'lucide-react';
// Ensure these types are exported from your types.ts file
import { DetailItem, ComparisonRow, RoleType } from "./types";

/**
 * ICON MAPPING
 */
const Icons = {
  Percent: <Percent size={24} />,
  Handshake: <Handshake size={24} />,
  Search: <Search size={24} />,
  Truck: <Truck size={24} />,
  Globe: <Globe size={24} />,
  Star: <Star size={24} />,
  Chart: <BarChart3 size={24} />,
  Check: <CheckCircle size={24} />,
  Postulate: <MousePointerClick size={24} />,
  Ecosystem: <Users size={24} />,
  Shield: <ShieldCheck size={24} />,
  Mail: <Mail size={24} />,
  Message: <MessageSquare size={24} />,
  Cart: <ShoppingCart size={24} />,
};

/**
 * COULEURS PAR RÔLE
 * Using Record<RoleType, ...> ensures that if you add a role to RoleType, 
 * TS will remind you to add colors here.
 */
export const ROLE_COLORS: Record<RoleType, { selection: string; classique: string; premium: string }> = {
  acheteur: {
    selection: "#E5E5E5",
    classique: "#F8F9FA",
    premium: "#E9EBE9"
  },
  vendeur: {
    selection: "#7A8271",
    classique: "#7A8271",
    premium: "#5F6658"
  },
  prestataire: {
    selection: "#D4C000",
    classique: "#D4C000",
    premium: "#D6D7B1"
  }
};

/**
 * 1. SUMMARY CARDS DATA
 */
export const SUMMARY_CARDS: Record<RoleType, { classic: DetailItem[], premium: DetailItem[] }> = {
  acheteur: {
    classic: [
      { icon: Icons.Percent, label: "Sans commissions", title: "", description: "" },
      { icon: Icons.Handshake, label: "Direct producteur", title: "", description: "" }
    ],
    premium: [
      { icon: Icons.Search, label: "Recherche Avancée", title: "", description: "" },
      { icon: Icons.Truck, label: "Transitaire de Confiance", title: "", description: "" }
    ]
  },
  vendeur: {
    classic: [
      { icon: Icons.Globe, label: "Visibilité mondiale", title: "", description: "" },
      { icon: Icons.Check, label: "Profil de base", title: "", description: "" }
    ],
    premium: [
      { icon: Icons.Star, label: "Mise en avant", title: "", description: "" },
      { icon: Icons.Chart, label: "Statistiques d'export", title: "", description: "" }
    ]
  },
  prestataire: {
    classic: [
      { icon: Icons.Postulate, label: "Postuler aux offres", title: "", description: "" },
      { icon: Icons.Check, label: "Contact direct", title: "", description: "" }
    ],
    premium: [
      { icon: Icons.Ecosystem, label: "Publication de services", title: "", description: "" },
      { icon: Icons.Shield, label: "Badge de Confiance", title: "", description: "" }
    ]
  }
};

/**
 * 2. DETAILED SECTIONS DATA
 */
export const DETAILED_PLANS: Record<RoleType, { classic: DetailItem[], premium: DetailItem[] }> = {
  acheteur: {
    classic: [
      { 
        icon: Icons.Percent, 
        title: "Améliorez vos marges bénéficiaires Sans commissions", 
        description: "Vous pouvez acheter autant de lots que vous souhaitez sans commission.",
        label: "Sans commission"
      },
      { 
        icon: Icons.Handshake, 
        title: "Achetez des lots d'huile d'olive directement du producteur", 
        description: "Accédez directement aux offres des producteurs, avec la quantité, le prix, la qualité et les paramètres souhaités.",
        label: "Direct producteur"
      },
      { 
        icon: Icons.Globe, 
        title: "Accès direct au Marché Tunisien", 
        description: "Explorez l'évolution du marché Tunisien au jour le jour.",
        label: "Marché Tunisien"
      }
    ],
    premium: [
      { 
        icon: Icons.Search, 
        title: "Recherche Avancée de lots d'huile d'olive", 
        description: "Faites votre recherche en précisant la quantité, la qualité et le prix souhaités.",
        label: "Recherche Avancée"
      },
      { 
        icon: Icons.Mail, 
        title: "Recevez des alertes pour les offres", 
        description: "Recevez les dernières offres directement dans votre boîte de réception.",
        label: "Alertes"
      },
      { 
        icon: Icons.Truck, 
        title: "Transitaire de Confiance", 
        description: "Rentrez en contact avec un transitaire assurant un service rapide.",
        label: "Logistique"
      }
    ]
  },
  vendeur: {
    classic: [
      { 
        icon: Icons.Percent, 
        title: "Améliorez vos marges bénéficiaires Sans commissions", 
        description: "Vous pouvez vendre autant de lots que vous souhaitez sans commission.",
        label: "Sans commission"
      }
    ],
    premium: [
        { 
            icon: Icons.Cart, 
            title: "Publiez vos offres de lots d'huile d'olive", 
            description: "Mettez vos lots d'huile d'olive en vente avec documents officiels.",
            label: "Vente directe"
        }
    ]
  },
  prestataire: {
    classic: [
      { 
        icon: Icons.Postulate, 
        title: "Postuler pour un service", 
        description: "Répondez aux appels d'offres des utilisateurs.",
        label: "Postuler"
      }
    ],
    premium: [
      { 
        icon: Icons.Ecosystem, 
        title: "Publiez un service", 
        description: "Devenez visible dans l'annuaire des prestataires.",
        label: "Visibilité"
      }
    ]
  }
};

/**
 * 3. COMPARISON DATA
 */
export const COMPARISON_DATA: Record<RoleType, ComparisonRow[]> = {
  acheteur: [
    { feature: "Accès catalogue", classic: true, premium: true },
    { feature: "Alertes email", classic: false, premium: true },
    { feature: "Négociation directe", classic: false, premium: true }
  ],
  vendeur: [
    { feature: "Vitrine basique", classic: true, premium: true },
    { feature: "Statistiques clics", classic: false, premium: true }
  ],
  prestataire: [
    { feature: "Contact simple", classic: true, premium: true },
    { feature: "Badge confiance", classic: false, premium: true }
  ]
};