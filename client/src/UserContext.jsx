import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add tripDetails state
  const [tripDetails, setTripDetails] = useState({
    city: '',
    checkin: '',
    checkout: '',
    preference: '',
    budget: 10000
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <UserContext.Provider value={{
      user, logout,
      tripDetails, setTripDetails
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
} 