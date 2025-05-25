import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  useEffect(() => {
    document.title = 'Page Not Found | Luxe';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 text-center">
      <AlertTriangle size={64} className="text-gray-400 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex space-x-4">
        <Link to="/" className="btn btn-primary">
          Return Home
        </Link>
        <Link to="/products" className="btn btn-outline">
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;