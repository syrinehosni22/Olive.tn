export interface Contact {
  id: string;
  title: string;
  description: string;
  badge: string;
}


 
export interface Provider {
  id: string;
  name: string;
  location: string;
  description: string;
  email?: string;
  experience?: number;
  // Ajoutez d'autres champs spécifiques au prestataire ici
}

export interface Service {
  id: string;
  title: string;
  description:string;
  providers: Provider[]; // C'est ici que l'on gère "plusieurs personnes"
}

export interface AddressCategory {
  id: string;
  title: string;
  services: Service[]; // C'est cette propriété qui manquait
}
export const ADDRESS_DATA: AddressCategory[] = [
  {
    id: "cat-fournisseurs",
    title: "Fournisseurs & Services techniques",
    services: [
      { 
        id: "plants-oliviers", 
        title: "Plants d’oliviers certifiés", 
        description: "Pépinières agréées, variétés locales & export. Spécialiste des variétés Chemlali et Chetoui.",
        providers: [
          { id: "p1", name: "Pépinière El Khadhra", location: "Sfax", description: "Expert en plants certifiés depuis 1995.", experience: 28 },
          { id: "p2", name: "BioPlant Sahel", location: "Sousse", description: "Spécialiste variétés export et résistance aux maladies.", experience: 12 }
        ]
      },
      { 
        id: "irrigation-pompage", 
        title: "Irrigation & Pompage", 
        description: "Maintenance systèmes goutte-à-goutte et installation de pompes solaires.",
        providers: [
          { id: "p3", name: "SolarAgri", location: "Kairouan", description: "Installation de pompes solaires haute performance.", experience: 8 }
        ]
      },
      { 
        id: "engrais-organiques", 
        title: "Engrais Organiques", 
        description: "Amendements et nutrition du sol certifiés pour l'agriculture biologique.",
        providers: [
          { id: "p4", name: "FertileSol", location: "Béja", description: "Production de compost et engrais organiques locaux.", experience: 15 }
        ]
      }
    ]
  },
  {
    id: "cat-transformation",
    title: "Transformation & Conditionnement",
    services: [
      { 
        id: "unites-trituration", 
        title: "Unités de Trituration", 
        description: "Moulins à huile haute performance (Extraction à froid à deux phases).",
        providers: [
          { id: "p5", name: "TechnoHuile", location: "Tunis", description: "Installation et maintenance de moulins italiens.", experience: 20 }
        ]
      },
      { 
        id: "silos-stockage", 
        title: "Silos & Stockage", 
        description: "Cuvisterie inox alimentaire avec système de conservation sous azote.",
        providers: [
          { id: "p6", name: "InoxPro", location: "Sfax", description: "Fabrication de cuves inox sur mesure.", experience: 10 }
        ]
      },
      { 
        id: "laboratoire-analyses", 
        title: "Laboratoire d'Analyses", 
        description: "Analyses physico-chimiques (Acidité, Peroxyde) et panel test sensoriel.",
        providers: [
          { id: "p7", name: "LaboQualité Sud", location: "Zarzis", description: "Certification ISO et panel de dégustation agréé.", experience: 7 }
        ]
      }
    ]
  }
];