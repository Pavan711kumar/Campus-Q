import { forwardRef } from 'react';
import { cn } from '../../lib/utils.js';

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn('focus-ring h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none transition placeholder:text-stone-400', className)}
      {...props}
    />
  );
});

export function Select({ className, ...props }) {
  return (
    <select
      className={cn('focus-ring h-11 w-full rounded-xl border border-stone-200 bg-white px-3 text-sm outline-none transition', className)}
      {...props}
    />
  );
}
