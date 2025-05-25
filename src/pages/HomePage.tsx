import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import FeaturedProducts from '../components/products/FeaturedProducts';
import ProductGrid from '../components/products/ProductGrid';

const HomePage = () => {
  const { search, fetchProductsByCategory, searchProducts } = useProductStore();
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const searchQuery = queryParams.get('search');

    // Set page title based on parameters
    if (category) {
      document.title = `${category} | Luxe`;
    } else if (searchQuery) {
      document.title = `Search: ${searchQuery} | Luxe`;
    } else {
      document.title = 'Luxe - Modern E-Commerce';
    }
  }, [location.search]);

  const renderHeader = () => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category');
    const searchQuery = queryParams.get('search');

    if (category) {
      return <h1 className="text-3xl font-semibold mb-8">{category}</h1>;
    } else if (searchQuery) {
      return <h1 className="text-3xl font-semibold mb-8">Search: {searchQuery}</h1>;
    } else {
      return (
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Welcome to Luxe</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover premium products curated for the modern lifestyle. From electronics to fashion,
            we bring you quality items from around the world.
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      {renderHeader()}
      
      {!location.search && <FeaturedProducts />}
      
      <section className={!location.search ? 'mt-12' : ''}>
        <h2 className="text-2xl font-semibold mb-6">
          {location.search ? 'Products' : 'All Products'}
        </h2>
        <ProductGrid />
      </section>
    </div>
  );
};

export default HomePage;