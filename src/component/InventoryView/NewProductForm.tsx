import React, { useState } from 'react';
import { connect } from 'react-redux';

// 1. Définition des options
const PACKAGING_OPTIONS: Record<string, string[]> = {
  'Bouteilles': ['Bouteille en Verre de 250ml', '500ml', '750ml', '1L', '3L', '5L'],
  'Semi Vrac': ['IBC', 'Fûts et Bidons'],
  'Vrac': ['USA Standard', 'USA Bio', 'UE Standard', 'UE Bio']
};

// 2. Types pour TypeScript et Redux
interface OwnProps {
  onSuccess: () => void;
  onCancel: () => void;
  styles: any;
}

interface StateProps {
  sellerId: string;
}

type Props = OwnProps & StateProps;

const NewProductForm: React.FC<Props> = ({ sellerId, onSuccess, onCancel, styles }) => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  
  // État pour les 5 documents demandés
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({
    certificatOrigine: null,
    certificatBio: null,
    ficheTechnique: null,
    ficheSecurite: null,
    certificatSanitaire: null,
  });

  // État du formulaire (Tous vos champs d'origine conservés)
  const [formData, setFormData] = useState({
    variety: 'Chemlali',
    classification: 'Vierge Extra',
    totalQuantity: '',
    minOrderQuantity: '',
    price: '',
    acidity: '',
    packagingType: 'Bouteilles',
    packagingDetail: 'Bouteille 750ml',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sellerId) {
      alert("Erreur: ID vendeur introuvable. Veuillez vous reconnecter.");
      return;
    }

    setLoading(true);
    const dataToSend = new FormData();
      console.log("id",sellerId)

    // Ajout de tous les champs au FormData
    dataToSend.append('sellerId', sellerId);
    dataToSend.append('variety', formData.variety);
    dataToSend.append('classification', formData.classification);
    dataToSend.append('totalQuantity', formData.totalQuantity);
    dataToSend.append('minOrderQuantity', formData.minOrderQuantity || "0");
    dataToSend.append('price', formData.price);
    dataToSend.append('acidity', formData.acidity || "0");
    dataToSend.append('packagingType', formData.packagingType);
    dataToSend.append('packagingDetail', formData.packagingDetail);

    // PHOTOS : Uniquement si le produit est conditionné (Non Vrac)
    if (formData.packagingType !== 'Vrac' && images) {
      Array.from(images).forEach((file) => {
        dataToSend.append('photos', file);
      });
    }

    // DOCUMENTS : Ajout des fichiers techniques
    Object.entries(documents).forEach(([key, file]) => {
      if (file) {
        dataToSend.append(key, file); 
      }
    });

    try {
      const res = await fetch('http://localhost:5000/api/products/add', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: dataToSend
      });

      if (res.ok) {
        alert("Produit ajouté avec succès !");
        onSuccess();
      } else {
        const result = await res.json();
        alert(`Erreur: ${result.error || "Vérifiez les champs"}`);
      }
    } catch (error) {
      alert("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-in">
      <h3 style={styles.subTitle}>Détails du nouveau lot</h3>

      {/* LIGNE 1 : Variété, Quantité, Min Order */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <label style={styles.label}>Variété</label>
          <select 
            style={styles.input} 
            value={formData.variety} 
            onChange={(e) => setFormData({...formData, variety: e.target.value})}
          >
            <option value="Chemlali">Chemlali</option>
            <option value="Chetoui">Chetoui</option>
            <option value="Oueslati">Oueslati</option>
          </select>
        </div>
        <div className="col-md-4">
          <label style={styles.label}>Quantité Totale (L)</label>
          <input type="number" required style={styles.input} value={formData.totalQuantity} onChange={(e) => setFormData({...formData, totalQuantity: e.target.value})} />
        </div>
        <div className="col-md-4">
          <label style={styles.label}>Min. Commande (L)</label>
          <input type="number" style={styles.input} value={formData.minOrderQuantity} onChange={(e) => setFormData({...formData, minOrderQuantity: e.target.value})} />
        </div>
      </div>

      {/* LIGNE 2 : Packaging Type & Detail */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <label style={styles.label}>Type de Conditionnement</label>
          <select
            style={styles.input}
            value={formData.packagingType}
            onChange={(e) => setFormData({
              ...formData, 
              packagingType: e.target.value, 
              packagingDetail: PACKAGING_OPTIONS[e.target.value][0]
            })}
          >
            {Object.keys(PACKAGING_OPTIONS).map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label style={styles.label}>Format Spécifique</label>
          <select
            style={styles.input}
            value={formData.packagingDetail}
            onChange={(e) => setFormData({...formData, packagingDetail: e.target.value})}
          >
            {PACKAGING_OPTIONS[formData.packagingType].map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION NOUVELLE : DOCUMENTS À TÉLÉCHARGER */}
      <div className="p-4 bg-light mb-4 rounded border">
        <h3 style={styles.subTitle}>Documents techniques (PDF/JPG)</h3>
        <div className="row g-3">
          {[
            { key: 'certificatOrigine', label: 'Certificat d’origine' },
            { key: 'certificatBio', label: 'Certificat BIO' },
            { key: 'ficheTechnique', label: 'Fiche technique' },
            { key: 'ficheSecurite', label: 'Fiche de sécurité' },
            { key: 'certificatSanitaire', label: 'Certificat sanitaire' },
          ].map((doc) => (
            <div className="col-md-6" key={doc.key}>
              <label className="form-label small fw-bold text-muted">{doc.label}</label>
              <input
                type="file"
                className="form-control form-control-sm"
                onChange={(e) => setDocuments({...documents, [doc.key]: e.target.files ? e.target.files[0] : null})}
              />
            </div>
          ))}
        </div>
      </div>

      {/* SECTION CONDITIONNELLE : PHOTOS PRODUIT */}
      {formData.packagingType !== 'Vrac' && (
        <div className="p-4 bg-light mb-5 rounded border border-primary shadow-sm">
          <h3 style={styles.subTitle}>Photos du produit (Packaging)</h3>
          <p className="small text-muted mb-2">Obligatoire pour le format {formData.packagingType}</p>
          <input
            type="file"
            multiple
            accept="image/*"
            className="form-control"
            required={formData.packagingType !== 'Vrac'}
            onChange={(e) => setImages(e.target.files)}
          />
        </div>
      )}

      {/* LIGNE 3 : Prix, Acidité, Classification */}
      <div className="row g-4 mb-5">
          <div className="col-md-4">
            <label style={styles.label}>Prix (€/L)</label>
            <input type="number" required step="0.01" style={styles.input} value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="col-md-4">
            <label style={styles.label}>Acidité (%)</label>
            <input type="number" step="0.01" style={styles.input} value={formData.acidity} onChange={(e) => setFormData({...formData, acidity: e.target.value})} />
          </div>
          <div className="col-md-4">
            <label style={styles.label}>Classification</label>
            <select style={styles.input} value={formData.classification} onChange={(e) => setFormData({...formData, classification: e.target.value})}>
                <option value="Vierge Extra">Vierge Extra</option>
                <option value="Vierge">Vierge</option>
            </select>
          </div>
      </div>

      {/* BOUTONS ACTIONS */}
      <div className="d-flex justify-content-end gap-3 pt-4 border-top">
        <button type="button" onClick={onCancel} className="btn btn-outline-secondary rounded-pill px-5">Annuler</button>
        <button type="submit" disabled={loading} className="btn btn-dark rounded-pill px-5 py-3 text-uppercase fw-bold">
          {loading ? 'Envoi en cours...' : 'Publier le lot'}
        </button>
      </div>
    </form>
  );
};

// 4. Mapping Redux
const mapStateToProps = (state: any): StateProps => ({
  sellerId: state.user.id
});

// 5. Exportation avec connect Typé
export default connect<StateProps, {}, OwnProps>(mapStateToProps)(NewProductForm);