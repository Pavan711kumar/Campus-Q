import { cn } from '../../lib/utils.js';

export function Badge({ className, tone = 'green', ...props }) {
  const tones = {
    green: 'bg-green-50 text-green-700 ring-green-100',
    orange: 'bg-orange-50 text-orange-700 ring-orange-100',
    red: 'bg-red-50 text-red-700 ring-red-100',
    stone: 'bg-stone-100 text-stone-700 ring-stone-200'
  };

  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1', tones[tone], className)} {...props} />
  );
}
