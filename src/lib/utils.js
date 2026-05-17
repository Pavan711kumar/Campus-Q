import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function nextPickupSlots(count = 6) {
  const slots = [];
  const now = new Date();
  now.setMinutes(Math.ceil(now.getMinutes() / 15) * 15, 0, 0);

  for (let index = 1; index <= count; index += 1) {
    const slot = new Date(now.getTime() + index * 15 * 60 * 1000);
    slots.push(slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }

  return slots;
}

export function estimatedWaitTime(activeOrders = 0) {
  return Math.max(5, Math.min(35, 6 + activeOrders * 3));
}
