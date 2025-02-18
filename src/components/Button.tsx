import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        variant === 'primary' && 'bg-primary-600 hover:bg-primary-700 text-white',
        variant === 'secondary' && 'bg-gray-800 hover:bg-gray-700 text-gray-100',
        className
      )}
      {...props}
    />
  );
}