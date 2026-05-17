# Firebase Data Storage

This project stores student canteen orders in Cloud Firestore.

## Firebase Project

- Project name in Firebase Console: `student-canteen`
- Project ID used by the app: `student-canteen-97341`
- Database: Cloud Firestore
- Database ID: `(default)`
- Collection used by this app: `order`

## Where To See Saved Orders

1. Open `https://console.firebase.google.com/`
2. Select the `student-canteen` project.
3. Go to `Build` > `Firestore Database`.
4. Open the `Data` tab.
5. Click the `order` collection.
6. After placing an order in the app, a new document appears inside `order`.

Important: the app now uses `order`, not `orders`. If you open `orders`, you may not see the current app data.

## How Data Is Created

Orders are saved from `main.js` when the user selects a payment method:

```js
await addDoc(collection(db, ORDER_COLLECTION), order);
```

`ORDER_COLLECTION` is defined in `firebase-config.js`:

```js
const ORDER_COLLECTION = 'order';
```

## Order Document Format

Each generated document has an automatic Firebase document ID and fields like this:

```js
{
  method: "UPI",
  user: {
    name: "Student Name",
    phone: "9876543210",
    block: "A Block",
    room: "101"
  },
  cart: [
    {
      id: 1,
      name: "Premium Burger",
      price: 149,
      img: "/images/burger.png"
    }
  ],
  total: 149,
  time: "11:30:00 AM",
  timestamp: 1778997000000,
  createdAt: "Firestore server timestamp",
  status: "pending"
}
```

## Dashboard Data

The canteen dashboard reads the same `order` collection from `canteen.js`:

```js
const q = query(collection(db, ORDER_COLLECTION));
```

Open the dashboard at:

```text
http://127.0.0.1:5173/canteen.html
```

## Test Steps

1. Run the app.
2. Fill student name, phone, block, and room.
3. Add at least one food item to the cart.
4. Click payment and choose `UPI` or `Cash on Delivery`.
5. Open Firebase Console > Firestore Database > Data > `order`.
6. Refresh the Firebase Console page if the new document does not appear immediately.
