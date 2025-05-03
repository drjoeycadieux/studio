
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useToast } from "@/hooks/use-toast";
import { LogOut } from 'lucide-react';

export default function ProtectedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Redirect to login if not loading and no user is authenticated
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
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

  // Display loading state or nothing while checking auth/redirecting
  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {/* Optional: Add a more prominent loading indicator here */}
      </div>
    );
  }

  // Display protected content if user is authenticated
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4 fade-in">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
          <CardDescription>You have successfully logged in.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
             <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} />
            <AvatarFallback>
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="text-lg font-medium">{user.displayName ?? 'User'}</p>
          <p className="text-muted-foreground">{user.email}</p>
          <Button onClick={handleLogout} variant="destructive" className="mt-4 bg-accent hover:bg-accent/90 text-accent-foreground">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
