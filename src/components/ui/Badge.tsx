import { type ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-wit-surface-alt text-wit-text-secondary',
  success: 'bg-wit-success-soft text-wit-success',
  warning: 'bg-wit-gold-soft text-wit-gold',
  danger: 'bg-red-50 text-red-600',
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
