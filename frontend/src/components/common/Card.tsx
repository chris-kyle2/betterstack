import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  footer,
  className = '',
  children,
}) => {
  return (
    <div className={`bg-dark-600 rounded-lg border border-dark-500 shadow-md overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="p-4 border-b border-dark-500">
          {title && <h3 className="text-lg font-medium text-white">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && <div className="px-4 py-3 bg-dark-700 border-t border-dark-500">{footer}</div>}
    </div>
  );
};

export default Card;