import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-xl font-bold text-primary-600 flex items-center mb-4">
              <ShoppingBag className="mr-2" />
              <span>Luxe</span>
            </Link>
            <p className="text-gray-600 mb-4">
              Premium shopping experience with curated products for the modern lifestyle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary-600">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary-600">Home</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-primary-600">Cart</Link>
              </li>
              <li>
                <Link to="/?category=Electronics" className="text-gray-600 hover:text-primary-600">Electronics</Link>
              </li>
              <li>
                <Link to="/?category=Clothing" className="text-gray-600 hover:text-primary-600">Clothing</Link>
              </li>
              <li>
                <Link to="/?category=Home" className="text-gray-600 hover:text-primary-600">Home Goods</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600">Return Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary-600">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary-600 mr-2 mt-0.5" />
                <span className="text-gray-600">
                  123 Commerce Street<br />
                  New York, NY 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-primary-600 mr-2" />
                <span className="text-gray-600">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary-600 mr-2" />
                <span className="text-gray-600">support@luxe.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Luxe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;