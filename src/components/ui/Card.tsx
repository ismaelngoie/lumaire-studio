import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  action?: React.ReactNode;
}

export function Card({ children, title, className = "", action }: CardProps) {
  return (
    <div className={`bg-white border border-lumaire-tan/30 rounded-sm p-6 shadow-sm ${className}`}>
      {(title || action) && (
        <div className="flex justify-between items-baseline mb-6">
          {title && (
            <h3 className="font-serif text-xl text-lumaire-brown">{title}</h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="text-lumaire-brown/80">
        {children}
      </div>
    </div>
  );
}
