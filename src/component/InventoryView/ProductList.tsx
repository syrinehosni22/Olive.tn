import React from 'react';

const styles = { /* Copy your styles here or use a shared styles file */ };

interface ProductListProps {
  products: any[];
  isLoading: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, isLoading }) => {
  if (isLoading) return <div className="text-center py-5">Chargement...</div>;
  if (products.length === 0) return <div className="text-center py-5 text-muted italic">Aucun produit en stock.</div>;

  return (
    <div className="animate-in">
      {products.map((product) => (
        <div key={product._id} style={styles.card} className="d-flex justify-content-between align-items-center shadow-sm">
          <div className="d-flex align-items-center gap-4">
            <div style={{ width: '60px', height: '80px', backgroundColor: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🫒</div>
            <div>
              <span style={styles.badge}>{product.classification || 'Vierge Extra'}</span>
              <h4 className="font-serif mt-1 mb-0">{product.variety} - {product.harvestType}</h4>
              <small className="text-muted">Campagne: {product.harvestYear} | Lot: {product.lotNumber || 'N/A'}</small>
            </div>
          </div>
          <div className="text-end px-3">
             <div style={styles.label}>Stock</div>
             <div className="fw-bold">{product.totalQuantity} L</div>
          </div>
          <button className="btn btn-sm btn-dark rounded-pill px-4">Éditer</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;