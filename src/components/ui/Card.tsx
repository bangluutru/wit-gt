import { type ReactNode, type HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  padding?: boolean;
}

export function Card({
  children,
  hoverable = false,
  padding = true,
  onClick,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-wit-surface rounded-xl shadow-card border border-wit-line/50
        ${padding ? 'p-6' : ''}
        ${hoverable ? 'hover:shadow-card-hover transition-shadow duration-200' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
