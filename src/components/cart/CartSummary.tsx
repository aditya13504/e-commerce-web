import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCartStore } from '../../stores/cartStore';

const CartSummary = () => {
  const { user } = useAuth();
  const { items, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  const subtotal = getTotalPrice();
  const shipping = 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({items.length} items)</span>
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
      
      <button
        onClick={handleCheckout}
        disabled={items.length === 0}
        className={`w-full py-3 rounded-md font-medium ${
          items.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        Proceed to Checkout
      </button>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>We accept:</p>
        <div className="flex space-x-2 mt-2">
          <div className="bg-gray-100 rounded px-2 py-1">Visa</div>
          <div className="bg-gray-100 rounded px-2 py-1">Mastercard</div>
          <div className="bg-gray-100 rounded px-2 py-1">PayPal</div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;