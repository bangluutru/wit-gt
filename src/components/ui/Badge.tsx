import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-wit-surface-2 text-wit-text-secondary',
  success: 'bg-wit-success-soft text-wit-success',
  warning: 'bg-wit-gold-soft text-wit-gold',
  danger: 'bg-wit-red-soft text-wit-red',
  info: 'bg-wit-info-soft text-wit-info',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
