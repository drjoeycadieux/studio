
"use client";

import type { User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, firebaseInitializationError } from "@/lib/firebase/config"; // Import auth and error status
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null; // Add error state
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, error: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(firebaseInitializationError); // Initialize with config error

  useEffect(() => {
    // If Firebase failed to initialize, don't set up listener
    if (error || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    }, (authError) => {
      // Handle potential errors during auth state observation
      console.error("Auth state error:", authError);
      setError(authError.message || "An error occurred during authentication.");
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [error]); // Depend on error state

  // Display configuration error if present
   if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Configuration Error</AlertTitle>
          <AlertDescription>
            {error} Please check your Firebase setup and environment variables in `.env.local`.
          </AlertDescription>
        </Alert>
      </div>
    );
  }


  // Display loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[250px] ml-4" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
