# Firebase Authentication Setup

The signup error `auth/configuration-not-found` means Firebase Authentication is not enabled for the Firebase project used by CampusQ.

The app is connected to this project:

```text
Project ID: student-canteen-97341
Auth domain: student-canteen-97341.firebaseapp.com
```

## Fix Steps

1. Open `https://console.firebase.google.com/`.
2. Select the project `student-canteen`.
3. Go to `Build` > `Authentication`.
4. Click `Get started` if Authentication is not initialized yet.
5. Open the `Sign-in method` tab.
6. Click `Email/Password`.
7. Enable `Email/Password`.
8. Click `Save`.
9. Restart or refresh the CampusQ app.

## Required Firebase Services

CampusQ needs these Firebase services enabled:

- Authentication: Email/Password provider
- Cloud Firestore
- Firebase Storage

## How To Test

After enabling Email/Password Authentication:

1. Open CampusQ.
2. Go to Signup.
3. Select `Student Signup`.
4. Create a test account with a valid email and a password of at least 6 characters.
5. Firebase Console > Authentication > Users should show the new user.
6. Firebase Console > Firestore Database > `users` should show a matching profile document.

## Why Code Cannot Fully Fix This

Firebase blocks signup until Authentication is enabled inside the Firebase Console. The frontend can connect to Firebase, but the backend Auth provider must be turned on for the project.
