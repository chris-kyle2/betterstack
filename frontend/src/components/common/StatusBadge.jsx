import React from 'react';

const StatusBadge = ({
  status,
  text,
  pulse = true,
  className = '',
}) => {
  const statusConfig = {
    online: {
      bgColor: 'bg-success-500',
      textColor: 'text-white',
      defaultText: 'Online',
    },
    offline: {
      bgColor: 'bg-error-500',
      textColor: 'text-white',
      defaultText: 'Offline',
    },
    warning: {
      bgColor: 'bg-warning-500',
      textColor: 'text-dark-800',
      defaultText: 'Warning',
    },
    unknown: {
      bgColor: 'bg-gray-500',
      textColor: 'text-white',
      defaultText: 'Unknown',
    },
  };

  const { bgColor, textColor, defaultText } = statusConfig[status];
  const displayText = text || defaultText;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 ${bgColor} ${textColor} text-xs font-medium ${className}`}>
      {pulse && (
        <span className={`mr-1.5 h-2 w-2 rounded-full ${bgColor} ${pulse ? 'animate-pulse-slow' : ''}`} />
      )}
      {displayText}
    </span>
  );
};

export default StatusBadge;