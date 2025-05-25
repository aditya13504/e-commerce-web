import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, Plus, Minus } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { useCartStore } from '../stores/cartStore';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FeaturedProducts from '../components/products/FeaturedProducts';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { currentProduct, isLoading, error, fetchProductById } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentProduct) {
      document.title = `${currentProduct.name} | Luxe`;
    }
  }, [currentProduct]);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!currentProduct) return;
    
    setIsAdding(true);
    await addToCart(user.id, currentProduct.id, quantity);
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error || 'Product not found'}</p>
        <Link to="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary-600">
          <ChevronLeft size={16} className="mr-1" />
          Back to Products
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={currentProduct.image_url} 
              alt={currentProduct.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Product Details */}
          <div>
            <div className="mb-4">
              <span className="text-sm text-gray-500">{currentProduct.category}</span>
              <h1 className="text-2xl font-semibold text-gray-900 mt-1">{currentProduct.name}</h1>
            </div>
            
            <div className="mb-6">
              <span className="text-2xl font-bold text-gray-900">${currentProduct.price.toFixed(2)}</span>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{currentProduct.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-700 mr-4">Quantity</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`p-2 ${quantity <= 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="px-4 py-1 text-gray-900">{quantity}</span>
                  
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10 || currentProduct.inventory_count < quantity + 1}
                    className={`p-2 ${quantity >= 10 || currentProduct.inventory_count < quantity + 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="text-sm text-gray-500 mb-4">
                {currentProduct.inventory_count > 0 ? (
                  <span>{currentProduct.inventory_count} in stock</span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isAdding || currentProduct.inventory_count <= 0}
                className={`btn w-full ${
                  currentProduct.inventory_count > 0 
                    ? 'btn-primary' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } flex items-center justify-center`}
              >
                {isAdding ? (
                  'Adding to Cart...'
                ) : (
                  <>
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">Categories:</span>
                <Link 
                  to={`/?category=${encodeURIComponent(currentProduct.category)}`}
                  className="text-primary-600 hover:underline"
                >
                  {currentProduct.category}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
};

export default ProductPage;