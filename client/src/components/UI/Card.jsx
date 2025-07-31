import React from 'react';

const Card = ({ children, className = '', hover = true }) => {
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-lg p-6 
        ${hover ? 'transition-transform duration-200 hover:shadow-xl hover:-translate-y-1' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;