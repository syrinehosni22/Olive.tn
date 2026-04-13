import React from 'react';

// Récupération des styles cohérents avec InventoryView
const styles = {
  card: { border: '1px solid #f2f2f2', borderRadius: '0', padding: '1.5rem', marginBottom: '1rem', backgroundColor: '#fff' },
  badge: { fontSize: '0.6rem', padding: '5px 12px', border: '1px solid #000', borderRadius: '20px', textTransform: 'uppercase' as const, letterSpacing: '1px', fontWeight: 'bold' as const },
  label: { fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#999', fontWeight: '600' },
  // Style de base pour le flag dynamique
  statusFlag: {
    fontSize: "0.55rem",
    padding: "3px 8px",
    letterSpacing: "1px",
    fontWeight: "bold" as const,
    textTransform: "uppercase" as const,
    display: "inline-block",
    border: "1px solid",
    borderRadius: "0px",
  },
};

interface ProductListProps {
  products: any[];
  isLoading: boolean;
  onEdit: (product: any) => void;
  // Ajout de la prop de style dynamique
  getStatusStyle: (status: string) => { 
    backgroundColor: string; 
    color: string; 
    borderColor: string; 
  };
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading, onEdit, getStatusStyle }) => {
  if (isLoading) return <div className="text-center py-5" style={styles.label}>Chargement de l'inventaire...</div>;
  
  if (products.length === 0) return (
    <div className="text-center py-5 text-muted shadow-sm bg-light" style={{ border: '1px dashed #ccc' }}>
      Aucun lot enregistré en stock.
    </div>
  );

  return (
    <div className="animate-in">
      {products.map((product) => (
        <div 
          key={product._id} 
          style={styles.card} 
          className="d-flex justify-content-between align-items-center shadow-sm hover-shadow transition"
        >
          <div className="d-flex align-items-center gap-4">
            {/* Icône ou miniature */}
            <div style={{ width: '60px', height: '80px', backgroundColor: '#fcfcfc', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
              🫒
            </div>

            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span style={styles.badge}>{product.physicoChimique?.classification || 'Huile'}</span>
                
                {/* --- LE FLAG DE VALIDATION DYNAMIQUE --- */}
                <span style={{ 
                  ...styles.statusFlag, 
                  ...getStatusStyle(product.status || 'En attente de validation') 
                }}>
                  {product.status || 'En attente'}
                </span>
              </div>
              
              <h4 className="font-serif mt-1 mb-0" style={{ fontWeight: '400' }}>
                {product.physicoChimique?.variety} — {product.traceability?.methodeExtraction || 'Extraite à froid'}
              </h4>
              
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                Campagne: <strong>{product.traceability?.campagneOleicole}</strong> | 
                Lot: <strong>{product.traceability?.lotNumber}</strong>
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-5">
            {/* Informations Stock */}
            <div className="text-end">
                <div style={styles.label}>Volume Disponible</div>
                <div className="fw-bold" style={{ fontSize: '1.1rem' }}>{product.logistique?.totalQuantity?.toLocaleString()} L</div>
            </div>

            {/* Informations Prix */}
            <div className="text-end">
                <div style={styles.label}>Prix Unitaire</div>
                <div className="fw-bold" style={{ color: '#2ecc71' }}>{product.logistique?.price} €/L</div>
            </div>

            {/* Bouton Éditer */}
            <button 
              onClick={() => onEdit(product)}
              className="btn btn-sm btn-dark rounded-0 px-4 py-2"
              style={{ ...styles.label, color: '#fff', letterSpacing: '1px' }}
            >
              Éditer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;