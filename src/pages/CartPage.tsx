import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCartStore } from '../stores/cartStore';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CartPage = () => {
  const { user } = useAuth();
  const { items, isLoading, error, fetchCartItems } = useCartStore();

  useEffect(() => {
    document.title = 'Shopping Cart | Luxe';
    
    if (user) {
      fetchCartItems(user.id);
    }
  }, [user, fetchCartItems]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Your Cart</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {!user ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">Sign in to view your cart</h2>
          <p className="text-gray-600 mb-6">
            Sign in to your account to view and manage your shopping cart.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-outline">
              Create Account
            </Link>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/" className="btn btn-primary inline-flex items-center">
            Start Shopping <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;