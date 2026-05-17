# CampusQ Firestore Schema

CampusQ uses four top-level collections:

- `users`
- `canteens`
- `menuItems`
- `orders`

## users

Document ID: Firebase Auth `uid`

```js
{
  name: "Student Name",
  email: "student@college.edu",
  rollNumber: "22CS101",
  role: "student",
  disabled: false,
  createdAt: serverTimestamp()
}
```

## canteens

```js
{
  name: "Central Canteen",
  ownerId: "uid",
  email: "owner@college.edu",
  isOpen: true,
  waitTime: 10,
  liveOrders: 0,
  location: "Main Block",
  createdAt: serverTimestamp()
}
```

## menuItems

```js
{
  name: "Paneer Wrap",
  price: 85,
  prepTime: 8,
  category: "Snacks",
  imageUrl: "https://...",
  available: true,
  canteenId: "central-canteen",
  canteenName: "Central Canteen",
  createdAt: serverTimestamp()
}
```

## orders

```js
{
  studentId: "uid",
  studentName: "Student Name",
  studentEmail: "student@college.edu",
  items: [{ id: "menu-item-id", name: "Paneer Wrap", price: 85, quantity: 2 }],
  canteenId: "central-canteen",
  canteenName: "Central Canteen",
  pickupSlot: "12:30 PM",
  status: "placed",
  paymentStatus: "paid",
  paymentId: "pay_xxx",
  paymentMode: "razorpay",
  total: 170,
  createdAt: serverTimestamp(),
  timestamp: 1778997000000
}
```
