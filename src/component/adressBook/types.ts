export interface Contact {
  id: string;
  title: string;
  description: string;
  badge: string;
}

export interface AddressCategory {
  title: string;
  icon: string;
  contacts: Contact[];
}
 
export const ADDRESS_DATA: AddressCategory[] = [
  {
    title: "Fournisseurs & Services techniques",
    icon: "🚜",
    contacts: [
      { id: "plants-oliviers", title: "Plants d’oliviers certifiés", description: "Pépinières agréées, variétés locales & export. Spécialiste des variétés Chemlali et Chetoui.", badge: "Végétal" },
      { id: "irrigation-pompage", title: "Irrigation & Pompage", description: "Maintenance systèmes goutte-à-goutte et installation de pompes solaires.", badge: "Technique" },
      { id: "engrais-organiques", title: "Engrais Organiques", description: "Amendements et nutrition du sol certifiés pour l'agriculture biologique.", badge: "Intrants" }
    ]
  },
  {
    title: "Transformation & Conditionnement",
    icon: "🫒",
    contacts: [
      { id: "unites-trituration", title: "Unités de Trituration", description: "Moulins à huile haute performance (Extraction à froid à deux phases).", badge: "Usine" },
      { id: "silos-stockage", title: "Silos & Stockage", description: "Cuvisterie inox alimentaire avec système de conservation sous azote.", badge: "Équipement" },
      { id: "laboratoire-analyses", title: "Laboratoire d'Analyses", description: "Analyses physico-chimiques (Acidité, Peroxyde) et panel test sensoriel.", badge: "Qualité" }
    ]
  }
];