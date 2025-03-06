"use client";

import Icons from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@clerk/nextjs";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();

  const { isLoaded, signIn, setActive } = useSignIn();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!isLoaded) return;

    // if (!phoneNumber || !password) {
    //     return toast.warning("Please fill in all fields");
    // }

    // setIsLoading(true);

    try {
      //     const signInAttempt = await signIn.create({
      //         identifier: phoneNumber,
      //         password,
      //         redirectUrl: "/dashboard"
      //     });

      //     if (signInAttempt.status === 'complete') {
      //         await setActive({ session: signInAttempt.createdSessionId });
      //         router.push('/dashboard');
      //     } else {
      //         console.error(JSON.stringify(signInAttempt, null, 2));
      //         toast.error("Invalid email or password");
      //     }

      setIsLoading(true);
      const res = await fetch(
        "https://akeray-api.onrender.com/api/auth/login",
        // "http://192.168.1.15:8011/api/auth/login",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            password: password,
            type: "tenant",
          }),
        }
      );

      const fRes = await res.json();
      console.log("🚀 ~ handleSubmit ~ fRes:", fRes);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      switch (err.errors[0]?.code) {
        case "form_identifier_not_found":
          toast.error("This email is not registered. Please sign up first.");
          break;
        case "form_password_incorrect":
          toast.error("Incorrect password. Please try again.");
          break;
        case "too_many_attempts":
          toast.error("Too many attempts. Please try again later.");
          break;
        default:
          toast.error("An error occurred. Please try again");
          break;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.icon className="h-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight pt-2">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">Phone</Label>
          <Input
            id="phoneNumber"
            placeholder="+251913305247"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div id="clerk-captcha"></div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <LoaderIcon className="w-4 h-4 animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default SignInPage;
