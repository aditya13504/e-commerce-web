import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCartStore } from '../../stores/cartStore';
import type { CartItem as CartItemType, Product } from '../../lib/supabase';

interface CartItemProps {
  item: CartItemType & { product: Product };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { user } = useAuth();
  const { updateQuantity, removeFromCart } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (!user) return;
    
    setIsUpdating(true);
    await updateQuantity(user.id, item.id, newQuantity);
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    await removeFromCart(user.id, item.id);
    setIsUpdating(false);
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200 animate-fade-in">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
        <Link to={`/products/${item.product_id}`}>
          <img 
            src={item.product.image_url} 
            alt={item.product.name} 
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="sm:ml-6 flex flex-col sm:flex-row w-full justify-between">
        <div className="flex-grow pr-4">
          <Link to={`/products/${item.product_id}`} className="text-lg font-medium text-gray-900 hover:text-primary-600">
            {item.product.name}
          </Link>
          <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
          <p className="mt-1 text-primary-600 font-medium">${item.product.price.toFixed(2)}</p>
        </div>
        
        {/* Quantity Controls */}
        <div className="flex items-center mt-4 sm:mt-0">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className={`p-2 ${isUpdating || item.quantity <= 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Minus size={16} />
            </button>
            
            <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className={`p-2 ${isUpdating ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="ml-4 text-gray-500 hover:text-red-600"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;