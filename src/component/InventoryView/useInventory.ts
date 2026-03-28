import { useState, useEffect, useCallback } from 'react';

export const useInventory = (sellerId: string | null) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    if (!sellerId) return;
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/seller/${sellerId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erreur chargement stock:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, refresh: fetchProducts };
};