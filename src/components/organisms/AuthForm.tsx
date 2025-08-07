import React from 'react';
import { FormInput } from '../molecules/FormInput';
import { Button } from '../atoms/Button';
import { useForm } from 'react-hook-form';

interface AuthFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  isLogin?: boolean;
  error?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  onSubmit, 
  isLogin = false,
  error 
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<{
    email: string;
    password: string;
  }>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Email"
        type="email"
        registration={register('email', { required: 'Email is required' })}
        error={errors.email?.message}
      />
      <FormInput
        label="Password"
        type="password"
        registration={register('password', { 
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters'
          }
        })}
        error={errors.password?.message}
      />
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      <Button type="submit" variant="primary" className="w-full">
        {isLogin ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
};
