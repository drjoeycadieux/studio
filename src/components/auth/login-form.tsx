
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  type FirebaseError, // Import FirebaseError type
} from "firebase/auth";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { auth, firebaseInitializationError } from "@/lib/firebase/config"; // Import auth and error status
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Google icon SVG (remains unchanged)
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M21.35 11.1h-9.18v2.73h5.21c-.23 1.43-1.2 2.73-2.83 3.64v2.36h3.04c1.79-1.64 2.83-4.1 2.83-6.99 0-.73-.07-1.43-.23-2.13z"/>
        <path fill="#34A853" d="M12.17 22c2.43 0 4.47-.8 5.96-2.18l-3.04-2.36c-.8.54-1.83.87-2.92.87-2.26 0-4.18-1.53-4.87-3.57H4.18v2.44C5.7 20.3 8.68 22 12.17 22z"/>
        <path fill="#FBBC05" d="M7.3 14.73c-.18-.54-.28-1.12-.28-1.73s.1-1.19.28-1.73V8.83H4.18C3.83 9.88 3.64 11 3.64 12.23c0 1.23.19 2.35.54 3.4l3.12-2.46z"/>
        <path fill="#EA4335" d="M12.17 6.55c1.31 0 2.5.45 3.44 1.38l2.6-2.6C16.64 3.7 14.59 2.8 12.17 2.8 8.68 2.8 5.7 4.7 4.18 7.39l3.12 2.44c.69-2.04 2.61-3.58 4.87-3.58z"/>
    </svg>
);


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const isAuthDisabled = !!firebaseInitializationError || (!auth); // Check if auth is disabled

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isAuthDisabled || !auth) {
      toast({ variant: "destructive", title: "Login Error", description: "Authentication is not available." });
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/dashboard"); // Redirect to dashboard page
    } catch (error: unknown) { // Use unknown type for error
      console.error("Login error:", error);
      let errorMessage = "An unknown error occurred. Please try again.";
      if (error instanceof Error && 'code' in error) {
          const firebaseError = error as FirebaseError; // Type assertion
          switch (firebaseError.code) {
              case 'auth/user-not-found':
              case 'auth/wrong-password':
              case 'auth/invalid-credential':
                errorMessage = "Invalid email or password. Please check your credentials.";
                break;
              case 'auth/invalid-email':
                errorMessage = "Invalid email format.";
                break;
              case 'auth/too-many-requests':
                errorMessage = "Access temporarily disabled due to too many failed login attempts. Please try again later.";
                 break;
              default:
                // Use the original message for other Firebase errors
                errorMessage = firebaseError.message || errorMessage;
          }
      } else if (error instanceof Error) {
          errorMessage = error.message; // Use message from standard Error
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
     if (isAuthDisabled || !auth) {
        toast({ variant: "destructive", title: "Login Error", description: "Authentication is not available." });
        return;
     }
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Google Sign-In Successful",
        description: "Welcome!",
      });
      router.push("/dashboard"); // Redirect to dashboard page
    } catch (error: any) {
      console.error("Google Sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description: error.message || "Could not sign in with Google.",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-sm shadow-lg fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Login to AuthNest</CardTitle>
      </CardHeader>
      <CardContent>
         {firebaseInitializationError && (
            <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Configuration Error</AlertTitle>
                <AlertDescription>
                    {firebaseInitializationError} Login is disabled.
                </AlertDescription>
            </Alert>
         )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} disabled={isLoading || isGoogleLoading || isAuthDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isGoogleLoading || isAuthDisabled} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || isGoogleLoading || isAuthDisabled}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading || isAuthDisabled}
        >
          {isGoogleLoading ? (
            "Signing in..."
          ) : (
            <>
              <GoogleIcon /> Sign in with Google
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="text-center text-sm text-muted-foreground">
        {/* Optional: Add link to sign up or forgot password */}
      </CardFooter>
    </Card>
  );
}
