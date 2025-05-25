import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  useEffect(() => {
    document.title = 'Sign In | Luxe';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Welcome Back</h1>
        <p className="mt-2 text-gray-600">Sign in to your account to continue</p>
      </div>
      
      <LoginForm />
      
      <div className="mt-8 text-center text-gray-600">
        <p>
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;