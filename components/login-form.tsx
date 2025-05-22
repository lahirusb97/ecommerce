"use client";
import { useActionState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { loginAction, LoginFormState } from "@/app/login/LoginAction";
import Image from "next/image";

const initialState: LoginFormState = { success: false, message: "" };

export default function LoginPageClient({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );
  if (authenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-muted">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg font-semibold">You are already logged in.</p>
            <Button variant="secondary" className="mt-4" asChild>
              <Link href="/">Go back to home page</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex mt-28 items-center justify-center ">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl border p-0">
        <CardHeader className="flex flex-col items-center space-y-1 p-2">
          {/* Store Logo (replace /logo.svg with your brand logo) */}
          <Image src="/logo.jpg" alt="Store Logo" width={60} height={60} />
          <h1 className="text-xl font-bold text-center">Welcome Back!</h1>
          <p className="text-xs text-muted-foreground text-center">
            Sign in to your account to shop, track orders, and more.
          </p>
        </CardHeader>
        <form action={formAction} autoComplete="off">
          <CardContent className="grid gap-3 pt-1 pb-0">
            <div className="grid gap-1">
              <Label htmlFor="identifier" className="text-xs">
                Email or Phone
              </Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="you@example.com or 0771234567"
                required
                autoComplete="username"
                defaultValue={
                  (!state.success && state?.formData?.identifier) || ""
                }
                className="h-10 text-sm"
              />
              {!state.success && state.errors?.identifier && (
                <span className="text-xs text-red-600">
                  {state.errors.identifier[0]}
                </span>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password" className="text-xs">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="h-10 text-sm"
              />
              {!state.success && state.errors?.password && (
                <span className="text-xs text-red-600">
                  {state.errors.password[0]}
                </span>
              )}
            </div>
            {/* Error message */}
            {!state.success && state.message && (
              <div className="text-red-600 text-xs mt-1 rounded px-2 py-1 bg-red-50 border border-red-200">
                {state.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              className="w-full font-semibold text-base rounded-xl h-10"
              disabled={pending}
            >
              {pending ? "Signing in..." : "Sign in"}
            </Button>
            <div className="flex justify-between items-center w-full text-xs">
              <Link
                href="/forgot-password"
                className="underline underline-offset-4 text-muted-foreground hover:text-primary"
              >
                Forgot password?
              </Link>
              <span>
                Don’t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Register
                </Link>
              </span>
            </div>
            <div className="mt-2 text-center text-[11px] text-muted-foreground">
              We’ll never share your credentials.
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
