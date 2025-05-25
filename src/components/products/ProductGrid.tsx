import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductStore } from '../../stores/productStore';
import ProductCard from './ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProductGrid = () => {
  const { products, isLoading, error, fetchProducts, fetchProductsByCategory, searchProducts } = useProductStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const search = queryParams.get('search');
    
    const loadProducts = async () => {
      try {
        if (category) {
          await fetchProductsByCategory(category);
        } else if (search) {
          await searchProducts(search);
        } else {
          await fetchProducts();
        }
      } catch (err) {
        setErrorMessage('Failed to load products. Please try again later.');
        console.error(err);
      }
    };
    
    loadProducts();
  }, [location.search, fetchProducts, fetchProductsByCategory, searchProducts]);

  if (isLoading) {
    return <div className="py-10"><LoadingSpinner /></div>;
  }

  if (error || errorMessage) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error || errorMessage}</p>
        <button 
          onClick={() => fetchProducts()}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or browse our categories.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;