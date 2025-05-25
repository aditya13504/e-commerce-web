import { useState, FormEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useOrderStore } from '../stores/orderStore';
import { useReturnStore } from '../stores/returnStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ReturnPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentOrder, isLoading: isOrderLoading, error: orderError, fetchOrderById } = useOrderStore();
  const { createReturn, isLoading: isReturnLoading, error: returnError } = useReturnStore();
  
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
  const [returnReason, setReturnReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Request Return | Luxe';
    
    if (user && orderId) {
      fetchOrderById(user.id, orderId);
    }
  }, [user, orderId, fetchOrderById]);

  const handleItemToggle = (itemId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!user || !orderId || !currentOrder) {
      setFormError('Unable to process return request');
      return;
    }
    
    // Check if any items are selected
    const selectedItemIds = Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => id);
    
    if (selectedItemIds.length === 0) {
      setFormError('Please select at least one item to return');
      return;
    }
    
    if (!returnReason.trim()) {
      setFormError('Please provide a reason for your return');
      return;
    }
    
    try {
      // Create return requests for each selected item
      const promises = selectedItemIds.map(itemId => 
        createReturn(user.id, orderId, itemId, returnReason)
      );
      
      await Promise.all(promises);
      
      // Navigate back to order details
      navigate(`/orders/${orderId}`, { 
        state: { returnSuccess: true } 
      });
    } catch (err) {
      setFormError((err as Error).message || 'Failed to create return request');
    }
  };

  if (isOrderLoading || isReturnLoading) {
    return <LoadingSpinner />;
  }

  if (orderError || returnError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{orderError || returnError}</p>
        <button 
          onClick={() => navigate(`/orders/${orderId}`)} 
          className="btn btn-primary"
        >
          Return to Order
        </button>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">Order not found</p>
        <button 
          onClick={() => navigate('/orders')} 
          className="btn btn-primary"
        >
          Return to Orders
        </button>
      </div>
    );
  }

  // Only allow returns for delivered orders
  if (currentOrder.status.toLowerCase() !== 'delivered') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          Returns can only be requested for delivered orders.
          Your order status is: {currentOrder.status}.
        </p>
        <button 
          onClick={() => navigate(`/orders/${orderId}`)} 
          className="btn btn-primary"
        >
          Return to Order
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate(`/orders/${orderId}`)}
          className="flex items-center text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Order
        </button>
      </div>
      
      <h1 className="text-3xl font-semibold mb-8">Request Return</h1>
      
      {formError && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{formError}</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Order #{currentOrder.id.slice(0, 8)}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Select Items to Return</h3>
            <div className="border rounded-md overflow-hidden">
              {currentOrder.order_items.map((item) => (
                <div key={item.id} className="flex items-center p-4 border-b last:border-b-0">
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    checked={!!selectedItems[item.id]}
                    onChange={() => handleItemToggle(item.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 rounded mr-4"
                  />
                  
                  <label htmlFor={`item-${item.id}`} className="flex-grow flex items-center cursor-pointer">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name} 
                        className="w-full h-full object-cover rounded-md" 
                      />
                    </div>
                    
                    <div className="ml-4">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-gray-500">${item.price_at_purchase.toFixed(2)}</p>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="returnReason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Return
            </label>
            <select
              id="returnReason"
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="input"
              required
            >
              <option value="">Select a reason</option>
              <option value="Damaged product">Damaged product</option>
              <option value="Wrong product">Wrong product</option>
              <option value="Defective product">Defective product</option>
              <option value="Not as described">Not as described</option>
              <option value="No longer needed">No longer needed</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="flex items-center justify-end">
            <button 
              type="button" 
              onClick={() => navigate(`/orders/${orderId}`)}
              className="btn btn-outline mr-4"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isReturnLoading}
            >
              {isReturnLoading ? 'Submitting...' : 'Submit Return Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnPage;