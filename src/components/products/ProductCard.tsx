import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCartStore } from '../../stores/cartStore';
import type { Product } from '../../lib/supabase';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    addToCart(user.id, product.id, 1);
  };

  return (
    <Link to={`/products/${product.id}`}>
      <div className="card group h-full flex flex-col overflow-hidden">
        {/* Image container with fixed height */}
        <div className="relative h-64 overflow-hidden bg-gray-200">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {product.inventory_count <= 0 && (
            <div className="absolute top-0 right-0 bg-gray-800 text-white text-xs font-medium px-2 py-1">
              Sold Out
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-0 left-0 bg-accent-500 text-white text-xs font-medium px-2 py-1">
              Featured
            </div>
          )}
          
          <button
            onClick={handleAddToCart}
            disabled={product.inventory_count <= 0}
            className={`absolute bottom-4 right-4 p-2 rounded-full 
              ${product.inventory_count > 0 
                ? 'bg-white text-primary-600 hover:bg-primary-600 hover:text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              shadow-md transition-colors duration-200`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
        
        {/* Product details */}
        <div className="p-4 flex-grow flex flex-col">
          <span className="text-sm text-gray-500 mb-1">{product.category}</span>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2 flex-grow line-clamp-2">{product.description}</p>
          <div className="mt-auto">
            <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;