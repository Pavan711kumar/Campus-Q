# CampusQ

Smart Campus Queue Optimization and Canteen Pre-Ordering System for colleges.

CampusQ is a 1-day hackathon MVP focused on a stable demo flow: students pre-order food, choose pickup slots, pay online, and track order status while canteen owners manage incoming orders.

## Stack

- **Frontend:** React + Vite, Tailwind CSS, shadcn-style reusable UI components, React Router, Axios
- **Backend:** Python FastAPI
- **Database & Auth:** Firebase Authentication, Firebase Firestore (accessed securely via Firebase Admin SDK in Python), Firebase Storage
- **Payments:** Razorpay Checkout Test Mode

## Main Demo Flow

1. Student signs up or logs in.
2. Student browses the menu.
3. Student adds items to cart.
4. Student chooses a pickup slot.
5. Student pays through Razorpay Test Mode. If no Razorpay key is configured, demo payment mode succeeds automatically.
6. An order is securely created in the Firestore database via the Python API.
7. Canteen owner sees the incoming orders on their dashboard.
8. Canteen owner accepts, prepares, and marks orders ready.

## Environment Setup

### 1. Firebase Setup
You must have a Firebase project with Email/Password Authentication and Firestore enabled.
See [FIREBASE_AUTH_SETUP.md](./FIREBASE_AUTH_SETUP.md).

### 2. Backend (Python FastAPI) Setup
1. Go to your Firebase Console -> Project settings -> Service accounts.
2. Click **Generate new private key**.
3. Rename the downloaded file to `serviceAccountKey.json` and place it inside the `backend/` directory.
4. Install dependencies and start the backend:
   ```bash
   cd backend
   python -m venv venv
   # On Windows: .\venv\Scripts\Activate
   # On Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```
   *The backend will run on `http://127.0.0.1:8000`*

### 3. Frontend (React) Setup
Create `.env` from `.env.example` if needed.
1. Open a new terminal in the project root.
2. Install dependencies and run the React app:
   ```bash
   npm install
   npm run dev
   ```
   *The frontend will run on `http://127.0.0.1:5173`*

## Seed Sample Test Data

1. Sign up as a canteen owner.
2. Open `Menu Management`.
3. Click `Add sample test data`.

This creates sample canteens and menu items in the database via the API.

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
