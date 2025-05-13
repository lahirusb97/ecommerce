"use client";

import { useFormStatus } from "react-dom";
import { signup } from "@/app/singup/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";

export function SignupForm() {
  const [state, formAction] = useActionState(signup, null);
  const { pending } = useFormStatus();

  return (
    <div className="grid gap-6">
      <form action={formAction}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" placeholder="John Doe" required />
            {state?.error?.name && (
              <p className="text-sm text-red-500">{state.error.name[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            {state?.error?.email && (
              <p className="text-sm text-red-500">{state.error.email[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
            />
            {state?.error?.password && (
              <p className="text-sm text-red-500">{state.error.password[0]}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Creating account..." : "Create an account"}
          </Button>
        </div>
      </form>
      {state?.message && (
        <p className="text-sm text-red-500 text-center">{state.message}</p>
      )}
    </div>
  );
}
