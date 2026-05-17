import { cn } from '../../lib/utils.js';

const variants = {
  primary: 'bg-green-600 text-white hover:bg-green-700 shadow-sm shadow-green-200',
  orange: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-200',
  outline: 'border border-stone-200 bg-white text-stone-800 hover:bg-stone-50',
  ghost: 'text-stone-700 hover:bg-stone-100',
  danger: 'bg-red-600 text-white hover:bg-red-700'
};

export function Button({ className, variant = 'primary', size = 'md', ...props }) {
  return (
    <button
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        size === 'sm' ? 'h-9 px-3 text-sm' : 'h-11 px-5',
        className
      )}
      {...props}
    />
  );
}
