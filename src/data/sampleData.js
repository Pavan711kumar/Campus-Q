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
    imageUrl: '/images/burger.png',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Snacks'
  },
  {
    name: 'Masala Dosa',
    price: 70,
    prepTime: 10,
    imageUrl: '/images/pizza.png',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Breakfast'
  },
  {
    name: 'Veg Biryani Bowl',
    price: 120,
    prepTime: 14,
    imageUrl: '/images/burger.png',
    canteenId: 'north-cafe',
    canteenName: 'North Cafe',
    available: true,
    category: 'Meals'
  },
  {
    name: 'Cold Coffee',
    price: 55,
    prepTime: 5,
    imageUrl: '/images/pizza.png',
    canteenId: 'north-cafe',
    canteenName: 'North Cafe',
    available: true,
    category: 'Beverages'
  }
];
