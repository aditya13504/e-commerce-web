import { useEffect } from 'react';
import OrderDetail from '../components/orders/OrderDetail';

const OrderDetailPage = () => {
  useEffect(() => {
    document.title = 'Order Details | Luxe';
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Order Details</h1>
      <OrderDetail />
    </div>
  );
};

export default OrderDetailPage;