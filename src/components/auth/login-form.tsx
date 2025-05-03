
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
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
import { auth } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

// Google icon SVG
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      router.push("/protected"); // Redirect to protected page
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Google Sign-In Successful",
        description: "Welcome!",
      });
      router.push("/protected");
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} disabled={isLoading || isGoogleLoading} />
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
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading || isGoogleLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || isGoogleLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
        <Separator className="my-6" />
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isLoading || isGoogleLoading}
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
