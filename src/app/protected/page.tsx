
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config'; // auth might be null if init failed
import { useToast } from "@/hooks/use-toast";
import { LogOut, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProtectedPage() {
  const { user, loading, error } = useAuth(); // Get error state
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to login if not loading, no error, and no user
    if (!loading && !error && !user) {
      router.push('/');
    }
    // If there's an error during auth setup, redirect (optional, could show error here too)
    if (!loading && error) {
       // Stay on page to show error, or redirect:
       // router.push('/');
    }
    // If user is logged in, redirect to the dashboard instead
    if (!loading && !error && user) {
        router.replace('/dashboard');
    }
  }, [user, loading, error, router]);

  const handleLogout = async () => {
     if (!auth) {
        toast({
            variant: "destructive",
            title: "Logout Failed",
            description: "Firebase authentication is not configured.",
        });
        return;
     }
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/'); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log out. Please try again.",
      });
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
         <p>Loading...</p>
      </div>
    );
  }

   // Display error if Firebase initialization failed
   if (error) {
     return (
       <div className="flex min-h-screen items-center justify-center p-4">
         <Alert variant="destructive" className="max-w-md">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>Authentication Error</AlertTitle>
           <AlertDescription>
             {error} Could not initialize Firebase authentication. Please contact support or check configuration.
              <Button onClick={() => router.push('/')} variant="link" className="p-0 h-auto mt-2 block text-left">Go to Login</Button>
           </AlertDescription>
         </Alert>
       </div>
     );
   }

   // This content might briefly show before redirecting to /dashboard
   // Or show if redirect fails for some reason
   if (user) {
     return (
       <div className="flex min-h-screen items-center justify-center">
           <p>Redirecting to dashboard...</p>
       </div>
     );
   }


  // Fallback if not loading, no error, but no user (should be redirected by effect, but as a safeguard)
  return (
      <div className="flex min-h-screen items-center justify-center">
          <p>Redirecting to login...</p>
      </div>
  );
}
