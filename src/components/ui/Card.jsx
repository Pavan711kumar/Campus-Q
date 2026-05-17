import { cn } from '../../lib/utils.js';

export function Card({ className, ...props }) {
  return <div className={cn('rounded-2xl border border-stone-200 bg-white p-5 shadow-sm', className)} {...props} />;
}
