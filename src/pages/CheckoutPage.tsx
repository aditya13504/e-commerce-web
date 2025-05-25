import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCartStore } from '../stores/cartStore';
import { useOrderStore } from '../stores/orderStore';
import { AlertCircle } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CheckoutPage = () => {
  const { user, profile } = useAuth();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder, isLoading, error } = useOrderStore();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(profile?.address || '');
  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    document.title = 'Checkout | Luxe';
    
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!shippingAddress.trim()) {
      setFormError('Shipping address is required');
      return;
    }
    
    if (!user) {
      navigate('/login');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      // Create order
      const { success, orderId } = await createOrder(
        user.id,
        shippingAddress,
        orderItems
      );
      
      if (success && orderId) {
        // Clear cart after successful order
        await clearCart(user.id);
        
        // Redirect to order confirmation
        navigate(`/orders/${orderId}`);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (err) {
      setFormError((err as Error).message || 'An error occurred during checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading || isProcessing) {
    return <LoadingSpinner fullScreen />;
  }

  const subtotal = getTotalPrice();
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Checkout</h1>
      
      {(error || formError) && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{error || formError}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Information */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={profile?.full_name || ''}
                  className="input bg-gray-50"
                  disabled
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  className="input bg-gray-50"
                  disabled
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Address
                </label>
                <textarea
                  id="address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="input"
                  rows={4}
                  required
                  placeholder="Enter your complete shipping address"
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="divide-y divide-gray-200">
              {items.map((item) => (
                <div key={item.id} className="py-4 flex">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover rounded-md" 
                    />
                  </div>
                  
                  <div className="ml-4 flex-grow">
                    <p className="text-gray-900 font-medium">{item.product.name}</p>
                    <p className="text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${item.product.price.toFixed(2)}</p>
                    <p className="text-gray-500 text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;