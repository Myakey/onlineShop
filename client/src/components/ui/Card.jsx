// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className }) => {
  const baseClasses = 'bg-[#212431] rounded-lg shadow-md';
  const finalClass = `${baseClasses} ${className || ''}`;

  return (
    <div className={finalClass}>
      {children}
    </div>
  );
};

export default Card;