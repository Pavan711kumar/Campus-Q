# CampusQ

Smart Campus Queue Optimization and Canteen Pre-Ordering System for colleges.

CampusQ is a 1-day hackathon MVP focused on a stable demo flow: students pre-order food, choose pickup slots, pay online, and track order status live while canteen owners manage incoming orders in realtime.

## Stack

- React + Vite
- Tailwind CSS
- shadcn-style reusable UI components
- React Router
- Axios
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Razorpay Checkout Test Mode
- Vercel-ready build

## Main Demo Flow

1. Student signs up or logs in.
2. Student browses the menu.
3. Student adds items to cart.
4. Student chooses a pickup slot.
5. Student pays through Razorpay Test Mode. If no Razorpay key is configured, demo payment mode succeeds automatically.
6. An order is created in Firestore collection `orders`.
7. Canteen owner sees the order live.
8. Canteen owner accepts, prepares, and marks it ready.
9. Student sees status updates instantly without refreshing.

## Firebase Collections

- `users`
- `canteens`
- `menuItems`
- `orders`

See [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) for document shapes.

## Firebase Authentication Setup

Before signup works, enable Email/Password Authentication in Firebase Console.

See [FIREBASE_AUTH_SETUP.md](./FIREBASE_AUTH_SETUP.md).

## Environment Setup

Create `.env` from `.env.example`.

For this local project, Firebase fallback values already point to `student-canteen-97341`, but production deployments should use environment variables.

## Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Seed Sample Test Data

1. Sign up as a canteen owner.
2. Open `Menu Management`.
3. Click `Add sample test data`.

This creates sample canteens and menu items in Firestore.

## Firebase Rules

Deploy rules:

```bash
npx firebase-tools deploy --only firestore:rules,storage
```

## Vercel Deployment

Use:

```text
Build Command: npm run build
Output Directory: dist
```

Set all variables from `.env.example` in Vercel.

## Razorpay Test Mode

Set:

```text
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

If this is empty, the checkout uses demo mode so the hackathon presentation stays stable.
