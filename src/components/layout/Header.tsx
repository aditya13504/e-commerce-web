import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  Package, 
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCartStore } from '../../stores/cartStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, signOut } = useAuth();
  const { getTotalItems, fetchCartItems } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchCartItems(user.id);
    }
  }, [user, fetchCartItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsProfileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-sm' : 'bg-white/95'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600 flex items-center">
            <ShoppingBag className="mr-2" />
            <span>Luxe</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
            <Link to="/?category=Electronics" className="text-gray-700 hover:text-primary-600">
              Electronics
            </Link>
            <Link to="/?category=Clothing" className="text-gray-700 hover:text-primary-600">
              Clothing
            </Link>
            <Link to="/?category=Home" className="text-gray-700 hover:text-primary-600">
              Home
            </Link>
          </nav>

          {/* Search, Cart, User */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-primary-600"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 relative"
            >
              <ShoppingCart size={24} />
              {user && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu}
                  className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                >
                  <User size={24} />
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 animate-fade-in">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User size={16} className="mr-2" />
                      <span>Profile</span>
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Package size={16} className="mr-2" />
                      <span>Orders</span>
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
              >
                <User size={24} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Cart for mobile */}
            <Link 
              to="/cart" 
              className="p-2 rounded-md text-gray-700 hover:text-primary-600 relative"
            >
              <ShoppingCart size={24} />
              {user && getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t pt-2 pb-4 px-4 animate-slide-down">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-primary-600"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
          
          <nav className="flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/?category=Electronics" 
              className="text-gray-700 hover:text-primary-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Electronics
            </Link>
            <Link 
              to="/?category=Clothing" 
              className="text-gray-700 hover:text-primary-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Clothing
            </Link>
            <Link 
              to="/?category=Home" 
              className="text-gray-700 hover:text-primary-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            
            {user ? (
              <>
                <hr className="border-gray-200" />
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-primary-600 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} className="mr-2" />
                  <span>Profile</span>
                </Link>
                <Link 
                  to="/orders" 
                  className="text-gray-700 hover:text-primary-600 py-2 flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package size={18} className="mr-2" />
                  <span>Orders</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-left text-gray-700 hover:text-primary-600 py-2 flex items-center w-full"
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <hr className="border-gray-200" />
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-primary-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Account
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;