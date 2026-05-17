export const sampleCanteens = [
  {
    id: 'central-canteen',
    name: 'Central Canteen',
    location: 'Main Block',
    isOpen: true,
    waitTime: 12,
    liveOrders: 8,
    rating: 4.7
  },
  {
    id: 'north-cafe',
    name: 'North Cafe',
    location: 'Engineering Block',
    isOpen: true,
    waitTime: 9,
    liveOrders: 5,
    rating: 4.5
  }
];

export const sampleMenuItems = [
  {
    name: 'Paneer Wrap',
    price: 85,
    prepTime: 8,
    imageUrl: '/images/paneer-wrap.svg',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Snacks'
  },
  {
    name: 'Masala Dosa',
    price: 70,
    prepTime: 10,
    imageUrl: '/images/masala-dosa.svg',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Breakfast'
  },
  {
    name: 'Veg Biryani Bowl',
    price: 120,
    prepTime: 14,
    imageUrl: '/images/veg-biryani.svg',
    canteenId: 'north-cafe',
    canteenName: 'North Cafe',
    available: true,
    category: 'Meals'
  },
  {
    name: 'Cold Coffee',
    price: 55,
    prepTime: 5,
    imageUrl: '/images/cold-coffee.svg',
    canteenId: 'north-cafe',
    canteenName: 'North Cafe',
    available: true,
    category: 'Beverages'
  }
];
