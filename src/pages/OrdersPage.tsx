import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import OrderList from '../components/orders/OrderList';

const OrdersPage = () => {
  useEffect(() => {
    document.title = 'Your Orders | Luxe';
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Your Orders</h1>
        <Link to="/profile" className="text-primary-600 hover:text-primary-700">
          Back to Profile
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <OrderList />
      </div>
    </div>
  );
};

export default OrdersPage;