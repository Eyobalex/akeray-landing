"use client";

import Icons from "@/components/global/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGenericContext } from "@/hooks/useGenericContext";
import AuthContext from "@/providers/AuthContext";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const SignInPage = () => {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useGenericContext(AuthContext);

  console.log("🚀 ~ handleSubmit ~ login:", login);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await login({ phoneNumber, password, type: "tenant" });

      // if (res) {
      // const profile = await getUserInfo({
      //   phoneNumber,
      //   password,
      //   type: "tenant",
      // });
      // console.log("🚀 ~ handleSubmit ~ profile:", profile);
      toast.success("You have logged in successfully");
      router.push("/dashboard");
      // } else {
      //   toast.error("Invalid Phone Number/ Password ");
      // }
    } catch (err) {
      console.error("***", JSON.stringify(err, null, 2));
      toast.error("Unable to log you in. Please try again!");
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
