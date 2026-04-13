import React from "react";
import { 
  ArrowLeft, Droplet, Package, Beaker, MessageSquare, 
  ShieldCheck, Microscope, Thermometer, Truck, FileText, Globe 
} from "lucide-react";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";
import { useNavigate } from "react-router-dom";

interface LotDetailViewProps {
  lot: any;
  onBack: () => void;
  // Ajout de la prop onContactSelect pour suivre la logique AddressBook
  onContactSelect?: (contact: any, messageContext?: string) => void;
}

const LotDetailView: React.FC<LotDetailViewProps> = ({ lot, onBack, onContactSelect }) => {
  const navigate = useNavigate();

  // --- LOGIQUE DE SÉLECTION DU CONTACT (Même que AddressBook) ---
  const handleNegotiate = () => {
    const contactPayload = {
      id: lot.sellerId,
      // On simule une structure Provider/User pour la messagerie
      firstName: "Vendeur", 
      name: `Lot #${lot.traceability?.lotNumber}`,
      companyName: lot.sellerName || "Producteur Olive Tn",
      email: lot.sellerEmail,
    };

    const messageContext = `Bonjour, je souhaite négocier le lot ${lot.traceability?.lotNumber} (${lot.physicoChimique?.variety}). Quantité : ${lot.logistique?.totalQuantity}L au prix de ${lot.logistique?.price}€/L.`;

    if (onContactSelect) {
      // Si on utilise une fonction de callback (logique interne au Dashboard)
      onContactSelect(contactPayload, messageContext);
    }
  };

  const DetailItem = ({ icon: Icon, label, value, color = "text-muted" }: any) => (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
      <span className={`${color} d-flex align-items-center gap-2 small fw-bold text-uppercase`} style={{ letterSpacing: '0.5px' }}>
        <Icon size={16} /> {label}
      </span>
      <span className="fw-bold">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="container mt-4 pb-5" style={{ maxWidth: "1200px" }}>
      <button 
        className="btn btn-link text-decoration-none mb-4 d-flex align-items-center gap-2 p-0 text-dark fw-bold" 
        onClick={onBack}
        style={{ fontSize: '0.7rem', letterSpacing: '1px' }}
      >
        <ArrowLeft size={18} /> RETOUR AU MARCHÉ
      </button>

      <div className="row g-4">
        {/* COLONNE GAUCHE : VISUEL & PRIX */}
        <div className="col-lg-4">
          <DivAnimateYAxis className="sticky-top" style={{ top: "20px" }}>
            <div className="card border-0 shadow-sm overflow-hidden mb-4" style={{ borderRadius: '0' }}>
              {lot.image ? (
                <img src={lot.image} alt="Produit" className="img-fluid" />
              ) : (
                <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: "300px" }}>
                  <Droplet size={80} className="text-success opacity-25" />
                </div>
              )}
              <div className="p-4 bg-white border-top border-5 border-dark">
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#999', fontWeight: '600' }}>Expertise Tunisienne</span>
                <h5 className="fw-bold mb-1" style={{ fontFamily: 'serif', fontSize: '1.5rem' }}>{lot.physicoChimique?.variety}</h5>
                <p className="text-muted small mb-3">Référence Lot : {lot.traceability?.lotNumber}</p>
                
                <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                  <span className="text-muted small fw-bold">PRIX UNITAIRE</span>
                  <span className="fs-3 fw-bold text-dark">{lot.logistique?.price} €<small className="fs-6 text-muted">/L</small></span>
                </div>

                <button 
                  onClick={handleNegotiate}
                  className="btn btn-dark w-100 mt-4 py-3 d-flex align-items-center justify-content-center gap-2 rounded-0 shadow-sm"
                  style={{ fontSize: '0.7rem', letterSpacing: '1.5px', fontWeight: 'bold' }}
                >
                  <MessageSquare size={18} /> NÉGOCIER AVEC LE VENDEUR
                </button>
                <p className="text-center text-muted mt-3" style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>
                  Ouverture d'une ligne directe certifiée
                </p>
              </div>
            </div>
          </DivAnimateYAxis>
        </div>

        {/* COLONNE DROITE : CAHIER DES CHARGES TECHNIQUE */}
        <div className="col-lg-8">
          <DivAnimateYAxis>
            <h1 className="mb-4" style={{ fontFamily: 'serif', fontWeight: '300' }}>Spécifications du Lot</h1>
            
            {/* 1. TRAÇABILITÉ */}
            <section className="mb-5">
              <h5 className="pb-2 mb-3 fw-bold d-flex align-items-center gap-2 border-bottom" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                <Globe size={18} className="text-dark" /> 1. TRAÇABILITÉ & EXTRACTION
              </h5>
              <div className="card border-0 shadow-sm rounded-0">
                <DetailItem icon={Truck} label="Campagne" value={lot.traceability?.campagneOleicole} />
                <DetailItem icon={Thermometer} label="Méthode d'Extraction" value={lot.traceability?.methodeExtraction} />
                <DetailItem icon={Droplet} label="Type d'Irrigation" value={lot.traceability?.typeIrrigation} />
                <DetailItem icon={Package} label="Mode de Stockage" value={lot.traceability?.stockage?.[0]} />
                <DetailItem icon={ShieldCheck} label="Stabilité Rancimat" value={lot.traceability?.stabiliteRancimat} />
              </div>
            </section>

            {/* 2. ANALYSE PHYSICO-CHIMIQUE */}
            <section className="mb-5">
              <h5 className="pb-2 mb-3 fw-bold d-flex align-items-center gap-2 border-bottom" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                <Beaker size={18} className="text-dark" /> 2. ANALYSES PHYSICO-CHIMIQUES
              </h5>
              <div className="card border-0 shadow-sm rounded-0">
                <DetailItem icon={ShieldCheck} label="Classification" value={lot.physicoChimique?.classification} color="text-dark" />
                <DetailItem icon={Microscope} label="Acidité Libre" value={`${lot.physicoChimique?.aciditeLibre}%`} />
                <DetailItem icon={Microscope} label="Indice Peroxyde" value={lot.physicoChimique?.indicePeroxyde} />
                <div className="p-3 bg-light-subtle small text-muted border-top border-light">
                  <strong>Spectrophotométrie UV :</strong> K232: {lot.physicoChimique?.absorbanceUV?.k232} | K270: {lot.physicoChimique?.absorbanceUV?.k270}
                </div>
              </div>
            </section>

            {/* 3. PURETÉ */}
            <section className="mb-5">
              <h5 className="pb-2 mb-3 fw-bold d-flex align-items-center gap-2 border-bottom" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                <ShieldCheck size={18} className="text-dark" /> 3. PURETÉ & ANTI-FRAUDE
              </h5>
              <div className="card border-0 shadow-sm rounded-0">
                <DetailItem icon={FileText} label="Alkyl Esters" value={lot.purete?.alkylEsters} />
                <DetailItem icon={FileText} label="Cires (Waxes)" value={lot.purete?.ciresWaxes} />
                <DetailItem icon={FileText} label="Erythrodiol + Uvaol" value={lot.purete?.erythrodiolUvaol} />
                <DetailItem icon={FileText} label="Acide Oléique" value={`${lot.purete?.acideOleique}%`} />
              </div>
            </section>

            {/* 4. LOGISTIQUE */}
            <section className="mb-5">
              <h5 className="pb-2 mb-3 fw-bold d-flex align-items-center gap-2 border-bottom" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                <Package size={18} className="text-dark" /> 4. LOGISTIQUE & VOLUME
              </h5>
              <div className="card border-0 shadow-sm rounded-0">
                <DetailItem icon={Package} label="Disponibilité" value={`${lot.logistique?.totalQuantity} Litres`} />
                <DetailItem icon={Truck} label="Conditionnement" value={lot.logistique?.packagingType} />
              </div>
            </section>

            {/* FOOTER ZYNEX */}
            <footer className="mt-5 pt-4 text-center">
               <p style={{ fontSize: '0.55rem', color: '#ccc', letterSpacing: '3px', textTransform: 'uppercase' }}>
                 Certifié par Zynex Solution — Olive Tn Platform
               </p>
            </footer>
          </DivAnimateYAxis>
        </div>
      </div>
    </div>
  );
};

export default LotDetailView;