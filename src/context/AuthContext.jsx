import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase.js';
import api from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    setLoading(true);

    api.get(`/users/${user.uid}`)
      .then(response => {
        if (isMounted) {
          setProfile(response.data);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error("Error fetching user profile", error);
        if (isMounted) {
          setProfile(null);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [user]);

  const value = useMemo(() => ({ user, profile, loading }), [user, profile, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
