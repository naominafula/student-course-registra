import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => {
    if (!isFirebaseConfigured) {
      throw new Error("Firebase is not configured. Please add your Firebase credentials in src/firebase.js or environment variables.");
    }
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    if (!isFirebaseConfigured) return Promise.resolve();
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);