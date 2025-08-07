import React from 'react';
import { AuthForm } from '../components/organisms/AuthForm';
import { Button } from '../components/atoms/Button';
import { useNavigate } from 'react-router';
import { useAuth } from '../features/auth/hooks/useAuth';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, error } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>
        
        <AuthForm 
          onSubmit={login} 
          isLogin={true}
          error={error}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={loginWithGoogle}
          >
            <span>Sign in with Google</span>
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
