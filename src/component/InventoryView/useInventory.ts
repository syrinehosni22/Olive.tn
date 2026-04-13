import { useState, useEffect, useCallback } from 'react';

export const useInventory = (sellerId: string | null) => {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    // On ne fait rien si sellerId est null ou undefined
    if (!sellerId) return;

    try {
      setIsLoading(true);

      // --- LOGIQUE DYNAMIQUE DE L'URL ---
      // Si sellerId est "all", on appelle la route globale /api/products/
      // Sinon, on appelle la route spécifique au vendeur
      const url = sellerId === "all" 
        ? `http://localhost:5000/api/products/` 
        : `http://localhost:5000/api/products/seller/${sellerId}`;

      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      // On s'assure que data est bien un tableau avant de mettre à jour le state
      setProducts(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error("Erreur chargement stock:", error);
      setProducts([]); // Reset en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  }, [sellerId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, refresh: fetchProducts };
};