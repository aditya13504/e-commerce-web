import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  useEffect(() => {
    document.title = 'Create Account | Luxe';
  }, []);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">Create an Account</h1>
        <p className="mt-2 text-gray-600">Join Luxe for a premium shopping experience</p>
      </div>
      
      <RegisterForm />
      
      <div className="mt-8 text-center text-gray-600">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;