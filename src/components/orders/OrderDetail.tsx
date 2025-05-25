import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrderStore } from '../../stores/orderStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentOrder, isLoading, error, fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (user && id) {
      fetchOrderById(user.id, id);
    }
  }, [user, id, fetchOrderById]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/orders')} 
          className="btn btn-primary"
        >
          Return to Orders
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

  const getStatusIcon = () => {
    switch (currentOrder.status.toLowerCase()) {
      case 'processing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Package className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button 
          onClick={() => navigate('/orders')}
          className="flex items-center text-gray-600 hover:text-primary-600"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Orders
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Order #{currentOrder.id.slice(0, 8)}</h2>
          <div className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${getStatusBadgeClass(currentOrder.status)}`}>
            {getStatusIcon()}
            <span className="ml-1">{currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
            <p className="text-gray-800 mb-1">Order Date: {new Date(currentOrder.created_at).toLocaleDateString()}</p>
            <p className="text-gray-800 mb-1">Order Total: ${currentOrder.total.toFixed(2)}</p>
            <p className="text-gray-800">Payment: {currentOrder.payment_intent_id ? 'Paid' : 'Pending'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
            <p className="text-gray-800">{currentOrder.shipping_address}</p>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-4">Order Items</h3>
        <div className="border rounded-md overflow-hidden">
          {currentOrder.order_items.map((item) => (
            <div key={item.id} className="flex items-center py-4 px-6 border-b last:border-b-0">
              <div className="w-16 h-16 flex-shrink-0">
                <img 
                  src={item.product.image_url} 
                  alt={item.product.name} 
                  className="w-full h-full object-cover rounded-md" 
                />
              </div>
              
              <div className="ml-4 flex-grow">
                <Link to={`/products/${item.product_id}`} className="text-gray-900 font-medium hover:text-primary-600">
                  {item.product.name}
                </Link>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>
              
              <div className="text-right">
                <p className="font-medium">${item.price_at_purchase.toFixed(2)}</p>
                <p className="text-gray-500 text-sm">
                  ${(item.price_at_purchase * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Return or Reorder Actions */}
      <div className="flex justify-between">
        {currentOrder.status.toLowerCase() === 'delivered' && (
          <Link to={`/returns/${currentOrder.id}`} className="btn btn-outline">
            Request Return
          </Link>
        )}
        
        <Link to="/" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderDetail;