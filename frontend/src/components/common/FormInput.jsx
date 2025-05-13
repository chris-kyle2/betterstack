import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormInput = ({
  label,
  name,
  error,
  helperText,
  type = 'text',
  className = '',
  ...props
}) => {
  const formContext = useFormContext();
  const { register } = formContext || {};

  // Generate a unique ID for the input
  const id = `input-${name}`;

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full rounded-md bg-dark-700 border ${
          error ? 'border-error-500' : 'border-dark-400'
        } px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
        {...(register ? register(name) : { name })}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-400">{helperText}</p>}
    </div>
  );
};

export default FormInput;