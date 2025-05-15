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

import { loginAction, LoginFormState } from "@/app/login/LoginAction";

const initialState: LoginFormState = { success: false, message: "" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Card className="w-full max-w-sm shadow-2xl rounded-2xl border">
        <CardHeader>
          <h1 className="text-2xl font-bold text-center">
            Sign in to your account
          </h1>
        </CardHeader>
        <form action={formAction} autoComplete="off">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="identifier">Email or Phone</Label>
              <Input
                id="identifier"
                name="identifier"
                placeholder="you@example.com or 0771234567"
                required
                autoComplete="username"
                defaultValue={
                  (!state.success && state?.formData?.identifier) || ""
                }
              />
              {!state.success && state.errors?.identifier && (
                <span className="text-xs text-red-600">
                  {state.errors.identifier[0]}
                </span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
              {!state.success && state.errors?.password && (
                <span className="text-xs text-red-600">
                  {state.errors.password[0]}
                </span>
              )}
            </div>
            {!state.success && state.message && (
              <div className="text-red-600 text-sm mt-1 rounded px-2 py-1 bg-red-50 border border-red-200">
                {state.message}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full font-semibold text-lg"
              disabled={pending}
            >
              {pending ? "Signing in..." : "Sign in"}
            </Button>
            <span className="text-center text-xs text-muted-foreground">
              Don’t have an account?{" "}
              <a href="/singup" className="underline">
                Register
              </a>
            </span>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
