import React from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  type?: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = 'text', 
  registration, 
  error 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...registration}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
