export function getAuthErrorMessage(error) {
  const code = error?.code || '';
  const message = error?.message || '';

  if (code === 'auth/configuration-not-found' || message.includes('CONFIGURATION_NOT_FOUND')) {
    return 'Firebase Authentication is not enabled for this project. Open Firebase Console > Authentication > Sign-in method and enable Email/Password.';
  }

  if (code === 'auth/email-already-in-use') {
    return 'This email is already registered. Please login instead.';
  }

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
    return 'Invalid email or password.';
  }

  if (code === 'auth/weak-password') {
    return 'Password must be at least 6 characters.';
  }

  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }

  return message.replace('Firebase: ', '') || 'Authentication failed. Please try again.';
}
