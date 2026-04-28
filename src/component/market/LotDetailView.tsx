import React from "react";
import { 
  ArrowLeft, Droplet, Package, Beaker, MessageSquare, 
  ShieldCheck, Microscope, Thermometer, Truck, FileText, Globe, 
  Search, ClipboardCheck, Award, AlertTriangle, ShieldAlert,
  Zap, Info, ExternalLink, CheckCircle2, FlaskConical, Layout,
  Scale, ShieldHalf, Biohazard, Activity, Calendar, Wind
} from "lucide-react";
import DivAnimateYAxis from "../utils/DivAnimateYAxis";
import { API_BASE_URL } from "../../config/api";

interface LotDetailViewProps {
  lot: any;
  onBack: () => void;
  onContactSelect?: (contact: any, messageContext?: string) => void;
}

const LotDetailView: React.FC<LotDetailViewProps> = ({ lot, onBack, onContactSelect }) => {
  
  const formatFileUrl = (path: string) => {
    if (!path) return null;
    if (path.startsWith("data:") || path.startsWith("http")) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const openFile = (fileUrl: string) => {
    if (!fileUrl) return;
    const fullUrl = formatFileUrl(fileUrl);
    if (fullUrl) window.open(fullUrl, "_blank");
  };

  const formatDate = (date: any) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const handleNegotiate = () => {
    const contactPayload = {
      id: lot.sellerId,
      firstName: "Vendeur", 
      name: `Lot #${lot.traceability?.lotNumber}`,
      companyName: lot.sellerName || "Producteur Olive Tn",
      email: lot.sellerEmail,
    };
    const messageContext = `Bonjour, je souhaite négocier le lot ${lot.traceability?.lotNumber} (${lot.physicoChimique?.variety}). Quantité : ${lot.logistique?.totalQuantity}L au prix de ${lot.logistique?.price}€/L.`;
    if (onContactSelect) onContactSelect(contactPayload, messageContext);
  };

  const DetailItem = ({ icon: Icon, label, value, color = "text-muted" }: any) => (
    <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-light">
      <span className={`${color} d-flex align-items-center gap-2 small fw-bold text-uppercase`} style={{ letterSpacing: '0.5px', fontSize: '0.6rem' }}>
        <Icon size={12} /> {label}
      </span>
      <span className="fw-bold text-end" style={{ fontSize: '0.85rem' }}>{value || "—"}</span>
    </div>
  );

  const DocumentBadge = ({ label, fileUrl, icon: Icon = FileText }: { label: string, fileUrl?: string, icon?: any }) => (
    <div 
      onClick={() => fileUrl && openFile(fileUrl)}
      className={`d-flex align-items-center justify-content-between p-3 mb-2 border ${fileUrl ? 'border-dark cursor-pointer' : 'border-light opacity-50'}`}
      style={{ cursor: fileUrl ? 'pointer' : 'default', transition: '0.2s', backgroundColor: fileUrl ? '#fff' : '#fafafa' }}
    >
      <div className="d-flex align-items-center gap-3">
        <Icon size={18} className={fileUrl ? 'text-dark' : 'text-muted'} />
        <div>
          <p className="mb-0 fw-bold" style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}>{label.toUpperCase()}</p>
          <p className="mb-0 text-muted" style={{ fontSize: '0.55rem' }}>{fileUrl ? 'Consulter le document' : 'Non fourni'}</p>
        </div>
      </div>
      {fileUrl && <ExternalLink size={12} className="text-muted" />}
    </div>
  );

  return (
    <div className="container mt-4 pb-5" style={{ maxWidth: "1200px" }}>
      <button className="btn btn-link text-decoration-none mb-4 d-flex align-items-center gap-2 p-0 text-dark fw-bold" onClick={onBack} style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
        <ArrowLeft size={18} /> RETOUR AU MARCHÉ
      </button>

      <div className="row g-5">
        <div className="col-lg-4">
          <DivAnimateYAxis className="sticky-top" style={{ top: "20px" }}>
            <div className="card border-0 shadow-sm overflow-hidden mb-4 rounded-0">
              <div className="bg-light d-flex align-items-center justify-content-center border-bottom" style={{ height: "320px", position: 'relative' }}>
                 {lot.verification?.isAnalysisValidated && (
                   <div className="position-absolute top-0 end-0 m-3 badge bg-success rounded-0 d-flex align-items-center gap-2 py-2 px-3 shadow-sm" style={{zIndex: 10}}>
                     <ShieldCheck size={14}/> ANALYSES VALIDÉES
                   </div>
                 )}
                 {lot.logistique?.photosProduit?.[0] ? (
                    <img src={formatFileUrl(lot.logistique.photosProduit[0]) || ""} alt="Produit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                 ) : (
                    <Droplet size={100} className="text-success opacity-25" />
                 )}
              </div>
              
              <div className="p-4 bg-white">
                <div className="mb-4">
                  <span className="badge bg-dark rounded-0 mb-2" style={{ fontSize: '0.6rem' }}>{lot.physicoChimique?.classification || 'HUILE D\'OLIVE'}</span>
                  <h5 className="fw-bold mb-1" style={{ fontFamily: 'serif', fontSize: '2.2rem' }}>{lot.physicoChimique?.variety}</h5>
                  <p className="text-muted small">Lot n° {lot.traceability?.lotNumber} • {lot.traceability?.campagneOleicole}</p>
                </div>

                <div className="p-3 bg-light mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted small fw-bold">PRIX INDICATIF</span>
                    <span className="fs-2 fw-bold text-dark">{lot.logistique?.price} {lot.logistique?.currency || '€'}<small className="fs-6 text-muted">/L</small></span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: '0.6rem' }}>Volume total : <strong>{lot.logistique?.totalQuantity} L</strong></p>
                </div>

                <button onClick={handleNegotiate} className="btn btn-dark w-100 py-3 d-flex align-items-center justify-content-center gap-2 rounded-0 mb-3 shadow-sm fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '1.5px' }}>
                  <MessageSquare size={18} /> CONTACTER L'EXPORTATEUR
                </button>

                {lot.verification?.isSellerVerified && (
                  <div className="d-flex align-items-center gap-2 p-2 border border-success text-success justify-content-center" style={{ fontSize: '0.6rem', fontWeight: '800' }}>
                    <ShieldCheck size={14} /> EXPORTATEUR VÉRIFIÉ
                  </div>
                )}
              </div>
            </div>
          </DivAnimateYAxis>
        </div>

        <div className="col-lg-8">
          <DivAnimateYAxis>
            <h1 className="mb-5" style={{ fontFamily: 'serif', fontWeight: '300', fontSize: '2.5rem' }}>Dossier Technique Export</h1>

            {/* 1. TRAÇABILITÉ & RÉCOLTE */}
            <section className="mb-5">
              <h5 className="section-title"><Globe size={18} /> 1. TRAÇABILITÉ & RÉCOLTE</h5>
              <div className="card rounded-0 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-6 border-end">
                    <DetailItem icon={Calendar} label="Campagne" value={lot.traceability?.campagneOleicole} />
                    <DetailItem icon={Activity} label="Date de Récolte" value={formatDate(lot.traceability?.dateRecolte)} />
                    <DetailItem icon={Zap} label="Date d'Extraction" value={formatDate(lot.traceability?.dateExtraction)} />
                    <DetailItem icon={ClipboardCheck} label="Type de Récolte" value={lot.traceability?.typeRecolte} />
                  </div>
                  <div className="col-md-6">
                    <DetailItem icon={Droplet} label="Irrigation" value={lot.traceability?.typeIrrigation} />
                    <DetailItem icon={Wind} label="Extraction" value={lot.traceability?.methodeExtraction} />
                    <DetailItem icon={Package} label="Filtration" value={lot.traceability?.filtration} />
                    <DetailItem icon={FlaskConical} label="Stabilité Rancimat" value={lot.traceability?.stabiliteRancimat} />
                  </div>
                </div>
                <div className="p-3 bg-light border-top border-bottom">
                    <div className="row g-3">
                        <div className="col-6"><DetailItem icon={Thermometer} label="Temp. Stockage" value={lot.traceability?.stockage?.temperature} /></div>
                        <div className="col-6"><DetailItem icon={ShieldCheck} label="Récipient" value={lot.traceability?.stockage?.recipients} /></div>
                    </div>
                </div>
                <div className="p-2 border-top">
                  <DocumentBadge label="Bulletin de Traçabilité" fileUrl={lot.traceability?.fileUrlTraceabilite} />
                </div>
              </div>
            </section>

            {/* 2. ANALYSES PHYSICO-CHIMIQUES */}
            <section className="mb-5">
              <h5 className="section-title"><Microscope size={18} /> 2. ANALYSES CHIMIQUES (COI)</h5>
              <div className="card rounded-0 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-6 border-end">
                    <DetailItem icon={Microscope} label="Acidité Libre" value={lot.physicoChimique?.aciditeLibre ? `${lot.physicoChimique.aciditeLibre}%` : null} />
                    <DetailItem icon={ShieldAlert} label="Indice Peroxyde" value={lot.physicoChimique?.indicePeroxyde} />
                    <DetailItem icon={Activity} label="Impuretés Insolubles" value={lot.physicoChimique?.impuretesInsolubles} />
                  </div>
                  <div className="col-md-6">
                    <DetailItem icon={Zap} label="K232" value={lot.physicoChimique?.absorbanceUV?.k232} />
                    <DetailItem icon={Zap} label="K270" value={lot.physicoChimique?.absorbanceUV?.k270} />
                    <DetailItem icon={Zap} label="Delta K" value={lot.physicoChimique?.absorbanceUV?.deltaK} />
                  </div>
                </div>
                <div className="p-2 border-top">
                  <DocumentBadge label="Bulletin d'analyse COI" fileUrl={lot.physicoChimique?.fileUrlAnalyse} icon={Beaker} />
                </div>
              </div>
            </section>

            {/* 3. ORGANOLEPTIQUE */}
            <section className="mb-5">
              <h5 className="section-title"><Award size={18} /> 3. PROFIL ORGANOLEPTIQUE</h5>
              <div className="card rounded-0 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-6 border-end">
                    <DetailItem icon={AlertTriangle} label="Médiane Défauts" value={lot.organoleptique?.medianeDefauts} />
                    <DetailItem icon={Droplet} label="Médiane Fruité" value={lot.organoleptique?.medianeFruite} />
                  </div>
                  <div className="col-md-6 p-3 bg-light">
                    <p className="small fw-bold text-muted text-uppercase mb-2" style={{ fontSize: '0.55rem' }}>Attributs Positifs</p>
                    <div className="d-flex gap-1 flex-wrap">
                      {lot.organoleptique?.attributsPositifs?.map((a: any, i: number) => (
                        <span key={i} className="badge bg-white text-dark border rounded-0" style={{ fontSize: '0.6rem' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-2 border-top">
                  <DocumentBadge label="Rapport Panel Test" fileUrl={lot.organoleptique?.fileUrlPanelTest} />
                </div>
              </div>
            </section>

            {/* 4. PURETÉ */}
            <section className="mb-5">
              <h5 className="section-title"><Scale size={18} /> 4. PURETÉ & COMPOSITION</h5>
              <div className="card rounded-0 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-6 border-end">
                    <DetailItem icon={FileText} label="Acide Oléique" value={lot.purete?.acidesGras?.oleique ? `${lot.purete.acidesGras.oleique}%` : null} />
                    <DetailItem icon={ShieldHalf} label="Polyphénols" value={lot.purete?.polyphenolsTotaux} />
                    <DetailItem icon={Award} label="Stérols Totaux" value={lot.purete?.sterols?.totaux} />
                  </div>
                  <div className="col-md-6">
                    <DetailItem icon={FlaskConical} label="Éthyl Esters" value={lot.purete?.ethylEstersFAEE} />
                    <DetailItem icon={Thermometer} label="Point de Fumée" value={lot.purete?.pointFumee} />
                    <DetailItem icon={Info} label="Tocophérols" value={lot.purete?.tocopherols} />
                  </div>
                </div>
                <div className="p-2 border-top">
                  <DocumentBadge label="Bulletin de Pureté" fileUrl={lot.purete?.fileUrlPurete} />
                </div>
              </div>
            </section>

            {/* 5. SÉCURITÉ */}
            <section className="mb-5">
              <h5 className="section-title"><Biohazard size={18} /> 5. SÉCURITÉ & CONTAMINANTS</h5>
              <div className="card rounded-0 border-0 shadow-sm p-3">
                 <div className="d-flex justify-content-between border-bottom pb-2 mb-3">
                    <span className="small fw-bold text-muted">PESTICIDES</span>
                    <span className={lot.securite?.pesticides ? "text-danger fw-bold small" : "text-success fw-bold small"}>
                        {lot.securite?.pesticides ? "DÉTECTÉS" : "NON DÉTECTÉS"}
                    </span>
                 </div>
                 <div className="row g-3 text-center">
                    <div className="col-4">
                        <p className="text-muted mb-0" style={{fontSize: '0.5rem'}}>SALMONELLA</p>
                        <p className="fw-bold small mb-0">{lot.securite?.microbiologie?.salmonella || "ABSENCE"}</p>
                    </div>
                    <div className="col-4">
                        <p className="text-muted mb-0" style={{fontSize: '0.5rem'}}>E. COLI</p>
                        <p className="fw-bold small mb-0">{lot.securite?.microbiologie?.eColi || "ABSENCE"}</p>
                    </div>
                    <div className="col-4">
                        <p className="text-muted mb-0" style={{fontSize: '0.5rem'}}>MÉTAUX LOURDS</p>
                        <p className="fw-bold small mb-0 text-success">CONFORME</p>
                    </div>
                 </div>
                 <div className="p-2 mt-3 border-top">
                  <DocumentBadge label="Certificat Contaminants" fileUrl={lot.securite?.fileUrlSecurite} icon={ShieldAlert} />
                </div>
              </div>
            </section>

            {/* 6. LOGISTIQUE */}
            <section className="mb-5">
              <h5 className="section-title"><Truck size={18} /> 6. LOGISTIQUE & EXPORT</h5>
              <div className="card rounded-0 border-0 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-6 border-end">
                    <DetailItem icon={Package} label="Packaging" value={lot.logistique?.packagingType} />
                    <DetailItem icon={Layout} label="Détail" value={lot.logistique?.packagingDetail} />
                    <DetailItem icon={Scale} label="MOQ" value={lot.logistique?.moq ? `${lot.logistique.moq} L` : "N/A"} />
                  </div>
                  <div className="col-md-6">
                    <DetailItem icon={Globe} label="Incoterm" value={lot.logistique?.incoterm} />
                    <DetailItem icon={Truck} label="Port de Départ" value={lot.logistique?.port} />
                    <DetailItem icon={Activity} label="Disponibilité" value="Immédiate" />
                  </div>
                </div>
              </div>
            </section>

            {/* 7. DOCUMENTS EXPORT */}
            <section className="mb-5">
              <h5 className="section-title"><FileText size={18} /> 7. CERTIFICATS D'EXPORTATION</h5>
              <div className="row g-2">
                <div className="col-md-6"><DocumentBadge label="Certificat Origine" fileUrl={lot.documentsExport?.certificatOrigine} /></div>
                <div className="col-md-6"><DocumentBadge label="Certificat BIO" fileUrl={lot.documentsExport?.certificatBio} /></div>
                <div className="col-md-6"><DocumentBadge label="Analyse Sanitaire" fileUrl={lot.documentsExport?.certificatSanitaire} /></div>
                <div className="col-md-6"><DocumentBadge label="Phytosanitaire" fileUrl={lot.documentsExport?.certificatPhytosanitaire} /></div>
                <div className="col-md-6"><DocumentBadge label="COA" fileUrl={lot.documentsExport?.coa} /></div>
                <div className="col-md-6"><DocumentBadge label="Fiche Technique" fileUrl={lot.documentsExport?.ficheTechnique} /></div>
              </div>
            </section>

            <style>{`
              .section-title {
                font-size: 0.75rem; letter-spacing: 1.5px; font-weight: 800;
                display: flex; align-items: center; gap: 12px;
                border-bottom: 2px solid #000; padding-bottom: 12px;
                margin-bottom: 20px; text-transform: uppercase;
              }
              .cursor-pointer:hover { background-color: #f8f9fa !important; border-color: #000 !important; }
            `}</style>

            <footer className="mt-5 pt-5 text-center border-top">
              <p style={{ fontSize: '0.5rem', color: '#bbb', letterSpacing: '4px', textTransform: 'uppercase' }}>
                Olive Tn — Dossier Export Certifié — 2026 — Zynex Solution
              </p>
            </footer>
          </DivAnimateYAxis>
        </div>
      </div>
    </div>
  );
};

export default LotDetailView;