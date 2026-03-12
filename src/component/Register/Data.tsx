import React from 'react';
import { 
  User, 
  Store, 
  Truck, 
  CheckCircle, 
  Search, 
  Star, 
  Globe, 
  Percent, 
  ShieldCheck,
  Mail,
  MessageSquare,
  BarChart3,
  Handshake,
  Share2,
  FileUp,
  MousePointerClick,
  ShoppingCart,
  Users
} from 'lucide-react';
import { DetailItem, ComparisonRow } from "./types";

/**
 * COULEURS PAR RÔLE
 */
export const ROLE_COLORS = {
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
 * 0. COMPOSANTS ICÔNES
 */
const Icons = {
  Acheteur: () => <User size={24} />,
  Vendeur: () => <Store size={24} />,
  Prestataire: () => <Truck size={24} />,
  Check: () => <CheckCircle size={24} />,
  Search: () => <Search size={24} />,
  Star: () => <Star size={24} />,
  Globe: () => <Globe size={24} />,
  Percent: () => <Percent size={24} />,
  Shield: () => <ShieldCheck size={24} />,
  Mail: () => <Mail size={24} />,
  Message: () => <MessageSquare size={24} />,
  Chart: () => <BarChart3 size={24} />,
  Handshake: () => <Handshake size={24} />,
  Truck: () => <Truck size={24} />,
  Ecosystem: () => <Users size={24} />,
  FileUp: () => <FileUp size={24} />,
  Postulate: () => <MousePointerClick size={24} />,
  Cart: () => <ShoppingCart size={24} />,
};

/**
 * 1. SUMMARY CARDS DATA (Aperçu rapide sur les cartes du haut)
 */
export const SUMMARY_CARDS: Record<string, { classic: DetailItem[], premium: DetailItem[] }> = {
  acheteur: {
    classic: [
      { icon: <Icons.Percent />, label: "Sans commissions" },
      { icon: <Icons.Handshake />, label: "Direct producteur" }
    ],
    premium: [
      { icon: <Icons.Search />, label: "Recherche Avancée" },
      { icon: <Icons.Truck />, label: "Transitaire de Confiance" }
    ]
  },
  vendeur: {
    classic: [
      { icon: <Icons.Globe />, label: "Visibilité mondiale" },
      { icon: <Icons.Check />, label: "Profil de base" }
    ],
    premium: [
      { icon: <Icons.Star />, label: "Mise en avant" },
      { icon: <Icons.Chart />, label: "Statistiques d'export" }
    ]
  },
  prestataire: {
    classic: [
      { icon: <Icons.Postulate />, label: "Postuler aux offres" },
      { icon: <Icons.Check />, label: "Contact direct" }
    ],
    premium: [
      { icon: <Icons.Ecosystem />, label: "Publication de services" },
      { icon: <Icons.Shield />, label: "Badge de Confiance" }
    ]
  }
};

/**
 * 2. DETAILED SECTIONS DATA (Contenu détaillé par rôle)
 */
export const DETAILED_PLANS: Record<string, { classic: DetailItem[], premium: DetailItem[] }> = {
  acheteur: {
    classic: [
      { 
        icon: <Icons.Percent />, 
        title: "Améliorez vos marges bénéficiaires Sans commissions", 
        desc: "Vous pouvez acheter autant de lots que vous souhaitez sans commission." 
      },
      { 
        icon: <Icons.Handshake />, 
        title: "Achetez des lots d'huile d'olive directement du producteur", 
        desc: "Accédez directement aux offres des producteurs, avec la quantité, le prix, la qualité et les paramètres souhaités." 
      },
      { 
        icon: <Icons.Globe />, 
        title: "Accès direct au Marché Tunisien", 
        desc: "Explorez l'évolution du marché Tunisien au jour le jour." 
      }
    ],
    premium: [
      { 
        icon: <Icons.Search />, 
        title: "Recherche Avancée de lots d'huile d'olive", 
        desc: "Faites votre recherche en précisant la quantité, la qualité et le prix souhaités ou en vous basant sur d'autres paramètres plus spécifiques." 
      },
      { 
        icon: <Icons.Globe />, 
        title: "Accès direct au Marché Tunisien", 
        desc: "Explorez l'évolution du marché Tunisien au jour le jour." 
      },
      { 
        icon: <Icons.Mail />, 
        title: "Recevez des alertes pour les offres", 
        desc: "Recevez les dernières offres du marché de l'huile d'olive directement dans votre boîte de réception." 
      },
      { 
        icon: <Icons.Message />, 
        title: "Publiez vos besoins spécifiques", 
        desc: "Publiez vos demandes spécifiques d'huile d'olive pour vous connecter efficacement avec des fournisseurs." 
      },
      { 
        icon: <Icons.Truck />, 
        title: "Transitaire de Confiance", 
        desc: "Rentrez en contact avec un transitaire ou une société de transport de confiance assurant un service rapide à un prix intéressant." 
      },
      { 
        icon: <Icons.Message />, 
        title: "Négociez directement sur la plateforme", 
        desc: "Ouvrez des discussions et dialoguez directement avec les vendeurs pour négocier les termes, les prix et conclure des accords." 
      }
    ]
  },
  vendeur: {
    classic: [
      { 
        icon: <Icons.Percent />, 
        title: "Améliorez vos marges bénéficiaires Sans commissions", 
        desc: "Vous pouvez vendre autant de lots que vous souhaitez sans commission." 
      },
      { 
        icon: <Icons.Handshake />, 
        title: "Vendez des lots d'huile d'olive directement à l'acheteur", 
        desc: "Accédez directement aux demandes avec la quantité, le prix, la qualité et les paramètres souhaités." 
      },
      { 
        icon: <Icons.Ecosystem />, 
        title: "Renforcez votre ecosystème", 
        desc: "Accédez à un carnet d'adresses de parties tierces de confiance exerçant dans le domaine de l'huile d'olive pour vous faciliter les tâches de tous les jours." 
      },
      { 
        icon: <Icons.Globe />, 
        title: "Accès direct au Marché Tunisien", 
        desc: "Explorez l'évolution du marché Tunsien au jour le jour." 
      }
    ],
    premium: [
      { 
        icon: <Icons.Cart />, 
        title: "Publiez vos offres de lots d'huile d'olive", 
        desc: "Mettez vos lots d'huile d'olive en vente en précisant la quantité, la qualité et le prix demandé en téléchargeant les papiers officiels pour une meilleure crédibilité." 
      },
      { 
        icon: <Icons.Globe />, 
        title: "Accès direct au Marché Tunisien", 
        desc: "Explorez l'évolution du marché Tunsien au jour le jour." 
      },
      { 
        icon: <Icons.Mail />, 
        title: "Recevez des alertes pour les demandes", 
        desc: "Recevez les dernières demandes du marché international de l'huile d'olive directement dans votre boîte de réception." 
      },
      { 
        icon: <Icons.Ecosystem />, 
        title: "Renforcez votre ecosystème", 
        desc: "Accédez à un carnet d'adresses de parties tierces de confiance exerçant dans le domaine de l'huile d'olive pour vous faciliter les tâches de tous les jours ou bien publiez une offre de service." 
      },
      { 
        icon: <Icons.Truck />, 
        title: "Transitaire de Confiance", 
        desc: "Rentrez en contact avec un transitaire ou une société de transport de confiance assurant un service rapide à un prix intéressant." 
      },
      { 
        icon: <Icons.Message />, 
        title: "Négociez directement sur la plateforme", 
        desc: "Ouvrez des discussions et dialoguez directement avec les acheteurs pour négocier les termes, les prix et conclure des accords rapidement." 
      }
    ]
  },
  prestataire: {
    classic: [
      { 
        icon: <Icons.Postulate />, 
        title: "Postuler pour un service", 
        desc: "" 
      }
    ],
    premium: [
      { 
        icon: <Icons.Postulate />, 
        title: "Postulez pour un service", 
        desc: "" 
      },
      { 
        icon: <Icons.Ecosystem />, 
        title: "Publiez un service", 
        desc: "" 
      },
      { 
        icon: <Icons.Mail />, 
        title: "Recevez des alertes pour les demandes de services", 
        desc: "" 
      },
      { 
        icon: <Icons.Message />, 
        title: "Rentrez en contact direct avec le demandeur de service", 
        desc: "" 
      }
    ]
  }
};

/**
 * 3. COMPARISON TABLE DATA
 */
export const COMPARISON_DATA: Record<string, ComparisonRow[]> = {
  acheteur: [
    { feature: "Accès catalogue", classic: true, premium: true },
    { feature: "Alertes email", classic: false, premium: true },
    { feature: "Négociation directe", classic: false, premium: true },
    { feature: "Documents douaniers", classic: null, premium: true }
  ],
  vendeur: [
    { feature: "Vitrine basique", classic: true, premium: true },
    { feature: "Statistiques clics", classic: false, premium: true },
    { feature: "Badge certifié", classic: false, premium: true }
  ],
  prestataire: [
    { feature: "Contact simple", classic: true, premium: true },
    { feature: "Badge confiance", classic: false, premium: true },
    { feature: "Priorité annuaire", classic: false, premium: true }
  ]
};