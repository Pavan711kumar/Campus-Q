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
    name: 'Veg Biryani',
    price: 120,
    prepTime: 14,
    imageUrl: '/images/veg-biryani.svg',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Meals'
  },
  {
    name: 'Mutton Dum Biryani',
    price: 180,
    prepTime: 18,
    imageUrl: '/images/mutton-dum-biryani.svg',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Meals'
  },
  {
    name: 'Meals',
    price: 100,
    prepTime: 12,
    imageUrl: '/images/meals.svg',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Meals'
  },
  {
    name: 'Tea',
    price: 20,
    prepTime: 4,
    imageUrl: '/images/tea.svg',
    canteenId: 'central-canteen',
    canteenName: 'Central Canteen',
    available: true,
    category: 'Beverages'
  },
  {
    name: 'Chicken Biryani',
    price: 150,
    prepTime: 16,
    imageUrl: '/images/chicken-biryani.svg',
    canteenId: 'north-cafe',
    canteenName: 'North Cafe',
    available: true,
    category: 'Meals'
  },
  {
    name: 'Masala Dosa',
    price: 70,
    prepTime: 10,
    imageUrl: '/images/masala-dosa.svg',
    canteenId: 'north-cafe',
    canteenName: 'North Cafe',
    available: true,
    category: 'Breakfast'
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
