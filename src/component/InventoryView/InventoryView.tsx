import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useInventory } from './useInventory';
import ProductList from './ProductList';
import NewProductForm from './NewProductForm';

const styles = {

  headerTitle: { fontFamily: 'serif', fontSize: '2.5rem', fontWeight: '300' as const, color: '#000' },

  subTitle: { fontFamily: 'serif', fontSize: '1.4rem', marginBottom: '1.5rem', color: '#333' },

  label: { fontSize: '0.65rem', textTransform: 'uppercase' as const, letterSpacing: '1.5px', color: '#999', fontWeight: '600' },

  input: { border: 'none', borderBottom: '1px solid #e0e0e0', borderRadius: '0', padding: '12px 0', fontSize: '0.9rem', width: '100%', outline: 'none', backgroundColor: 'transparent' },

  card: { border: '1px solid #f2f2f2', borderRadius: '0', padding: '1.5rem', marginBottom: '1rem', backgroundColor: '#fff' },

  badge: { fontSize: '0.6rem', padding: '5px 12px', border: '1px solid #000', borderRadius: '20px', textTransform: 'uppercase' as const, letterSpacing: '1px', fontWeight: 'bold' }

};

const InventoryView = () => {
  const [view, setView] = useState<'list' | 'add'>('list');
  const sellerId = useSelector((state: RootState) => state.user.id);
  const { products, isLoading, refresh } = useInventory(sellerId);

  const handleSuccess = () => {
    refresh();
    setView('list');
  };

  return (
    <section className="container py-5" style={{ maxWidth: '1050px' }}>
      <header className="d-flex justify-content-between align-items-end mb-5 border-bottom pb-3">
        <div>
          <span style={styles.label}>Plateforme Vendeur</span>
          <h1 style={styles.headerTitle}>Stock & Produits</h1>
        </div>
        <div className="d-flex gap-4">
          <button onClick={() => setView('list')} className="btn btn-link text-decoration-none p-0" 
                  style={{ ...styles.label, color: view === 'list' ? '#000' : '#ccc' }}>
            Inventaire ({products.length})
          </button>
          <button onClick={() => setView('add')} className="btn btn-link text-decoration-none p-0" 
                  style={{ ...styles.label, color: view === 'add' ? '#000' : '#ccc' }}>
            + Ajouter un lot
          </button>
        </div>
      </header>

      {view === 'list' ? (
        <ProductList products={products} isLoading={isLoading} />
      ) : (
        <NewProductForm 
          onSuccess={handleSuccess} 
          onCancel={() => setView('list')}
          styles={styles} 
        />
      )}
    </section>
  );
};

export default InventoryView;

