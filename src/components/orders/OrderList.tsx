import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Package, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useOrderStore } from '../../stores/orderStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-green-100 text-green-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const OrderList = () => {
  const { user } = useAuth();
  const { orders, isLoading, error, fetchOrders } = useOrderStore();

  useEffect(() => {
    if (user) {
      fetchOrders(user.id);
    }
  }, [user, fetchOrders]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => user && fetchOrders(user.id)} 
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-4">When you place an order, it will appear here.</p>
        <Link to="/" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link 
          key={order.id} 
          to={`/orders/${order.id}`}
          className="block bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center">
                <Calendar size={14} className="mr-1" />
                Order placed: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium mt-2 sm:mt-0 inline-flex ${getStatusBadgeClass(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700">Total: <span className="font-semibold">${order.total.toFixed(2)}</span></p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrderList;