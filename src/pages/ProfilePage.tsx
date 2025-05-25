import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileForm from '../components/profile/ProfileForm';
import OrderList from '../components/orders/OrderList';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const ProfilePage = () => {
  const { user, profile, signOut, isLoading } = useAuth();

  useEffect(() => {
    document.title = 'Your Profile | Luxe';
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !profile) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">You must be logged in to view this page</p>
        <Link to="/login" className="btn btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Your Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-100 rounded-full p-3">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium">{profile.full_name || 'User'}</p>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <a 
                href="#profile" 
                className="flex items-center px-3 py-2 text-gray-700 rounded-md bg-gray-100 font-medium"
              >
                <User className="h-5 w-5 mr-2" />
                Profile
              </a>
              <a 
                href="#orders" 
                className="flex items-center px-3 py-2 text-gray-600 rounded-md hover:bg-gray-50"
              >
                <Package className="h-5 w-5 mr-2" />
                Orders
              </a>
              <button 
                onClick={() => signOut()}
                className="flex items-center px-3 py-2 text-gray-600 rounded-md hover:bg-gray-50 w-full text-left"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Section */}
          <section id="profile">
            <ProfileForm />
          </section>
          
          {/* Orders Section */}
          <section id="orders">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6">Your Orders</h2>
              <OrderList />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;