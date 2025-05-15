"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { singupAction } from "@/app/singup/singupAction";
import { SchemaSingUpModel } from "@/schema/schemaSingUp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Creating account..." : "Create an account"}
    </Button>
  );
}

type FormState = {
  message?: string;
  success: boolean;
  formData?: SchemaSingUpModel;
  errors?: Partial<Record<string, string>>;
};

const initialState: FormState = {
  message: "",
  success: false,
  errors: {},
  formData: undefined,
};

export function SignupForm() {
  const [state, formAction] = useActionState(singupAction, initialState);

  return (
    <Card className="grid gap-6 max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lets Get Started</CardTitle>
        <CardDescription>
          You can use your phone number to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Aruna Kumara"
              defaultValue={state.formData?.name || ""}
            />
            {state.errors?.name && (
              <p className="text-red-500 text-sm">{state.errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="aruna@gmail.com"
              defaultValue={state.formData?.email || ""}
            />
            {state.errors?.email && (
              <p className="text-red-500 text-sm">{state.errors.email}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="0703456789"
              defaultValue={state.formData?.phone || ""}
            />
            {state.errors?.phone && (
              <p className="text-red-500 text-sm">{state.errors.phone}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              defaultValue={state.formData?.password || ""}
            />
            {state.errors?.password && (
              <p className="text-red-500 text-sm">{state.errors.password}</p>
            )}
          </div>
          <CardFooter>
            {!state.success && (
              <p className="text-red-500 text-sm">{state.message}</p>
            )}
          </CardFooter>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
