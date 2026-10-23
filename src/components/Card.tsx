import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export function Card({ children, className, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-[#11141b]/90 border border-[#202634] p-5 backdrop-blur-sm transition-colors duration-150',
        glow && 'hover:border-[#76b900]/40 hover:shadow-lg hover:shadow-[#76b900]/5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#1c2230]', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-white tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}
