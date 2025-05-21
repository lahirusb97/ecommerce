// app/components/checkout/UserDataForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  schemaCheckoutForm,
  CheckoutFormModel,
} from "@/schema/schemaCheckoutForm";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useState } from "react";
import { Pencil } from "lucide-react";

export function CheckoutForm({
  initialValues,
  isLoggedIn,
}: {
  initialValues: { email?: string | null; phone?: string | null };
  isLoggedIn?: boolean;
}) {
  const { cart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormModel>({
    resolver: zodResolver(schemaCheckoutForm),
    defaultValues: {
      email: initialValues.email ?? "",
      phone: initialValues.phone ?? "",
    },
  });

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const onSubmite = async (data: CheckoutFormModel) => {
    // Here you could also attach the cart, etc.
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer: data,
        items: cart,
        // cart, etc.
      }),
    });

    const result = await response.json();
    if (result.url) {
      window.location.href = result.url; // Stripe Checkout URL
    } else {
      alert(result.error || "Checkout failed");
    }
  };
  console.log(errors);
  return (
    <form
      onSubmit={handleSubmit(onSubmite)}
      className="space-y-4 max-w-md mx-auto"
    >
      <div>
        <Input {...register("fullName")} placeholder="Full Name" />
        {errors.fullName && (
          <div className="text-destructive text-xs">
            {errors.fullName.message}
          </div>
        )}
      </div>
      <div className="relative">
        <div className="relative">
          <Input
            {...register("phone")}
            placeholder="Phone"
            disabled={isLoggedIn && !isEditingPhone}
            defaultValue={initialValues.phone ?? ""}
            className={
              isLoggedIn && !isEditingPhone
                ? "bg-gray-100 cursor-not-allowed"
                : ""
            }
          />
          {isLoggedIn && !isEditingPhone && (
            <button
              type="button"
              onClick={() => setIsEditingPhone(true)}
              className="absolute right-2 top-2 p-1 text-gray-400 hover:text-blue-600"
              tabIndex={-1}
              aria-label="Edit phone"
            >
              <Pencil size={16} />
            </button>
          )}
          {/* Helper/warning for logged-in users when editing */}
          {isLoggedIn && isEditingPhone && (
            <div className="text-yellow-600 text-xs mt-1">
              This will become your new login phone number for future sign-in.
            </div>
          )}
          {errors.phone ? (
            <div className="text-destructive text-xs">
              {errors.phone.message}
            </div>
          ) : (
            !isEditingPhone &&
            isLoggedIn && (
              <div className="text-muted-foreground text-xs mt-1">
                To change your login phone number, click the edit icon.
              </div>
            )
          )}
        </div>
      </div>
      <div className="relative">
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          disabled={isLoggedIn && !isEditingEmail}
          defaultValue={initialValues.email ?? ""}
          className={
            isLoggedIn && !isEditingEmail
              ? "bg-gray-100 cursor-not-allowed"
              : ""
          }
        />
        {isLoggedIn && !isEditingEmail && (
          <button
            type="button"
            onClick={() => setIsEditingEmail(true)}
            className="absolute right-2 top-2 p-1 text-gray-400 hover:text-blue-600"
            tabIndex={-1}
            aria-label="Edit email"
          >
            <Pencil size={16} />
          </button>
        )}
        {/* Helper/warning for logged-in users when editing */}
        {isLoggedIn && isEditingEmail && (
          <div className="text-yellow-600 text-xs mt-1">
            This will become your new login email for future sign-in.
          </div>
        )}
        {errors.email ? (
          <div className="text-destructive text-xs">{errors.email.message}</div>
        ) : (
          !isEditingEmail &&
          isLoggedIn && (
            <div className="text-muted-foreground text-xs mt-1">
              To change your login email, click the edit icon.
            </div>
          )
        )}
      </div>

      <div>
        <Input {...register("address1")} placeholder="Address Line 1" />
        {errors.address1 && (
          <div className="text-destructive text-xs">
            {errors.address1.message}
          </div>
        )}
      </div>
      <div>
        <Input
          {...register("address2")}
          placeholder="Address Line 2 (optional)"
        />
        {errors.address2 && (
          <div className="text-destructive text-xs">
            {errors.address2.message}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Input {...register("city")} placeholder="City" className="flex-1" />
        <Input
          {...register("postalCode")}
          placeholder="Postal Code"
          className="flex-1"
        />
      </div>
      <div>
        <Input {...register("country")} placeholder="Country" />
        {errors.country && (
          <div className="text-destructive text-xs">
            {errors.country.message}
          </div>
        )}
      </div>

      {/* Optionally show account creation fields */}
      {!isLoggedIn && (
        <div>
          <p className="text-sm text-destructive">
            If you have an account, please{" "}
            <Link className="text-blue-500 underline" href="/login">
              login
            </Link>{" "}
            instead of creating a new account.
          </p>

          <div>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              required={!isLoggedIn}
            />
            {errors.password && (
              <div className="text-destructive text-xs">
                {errors.password.message}
              </div>
            )}
          </div>
        </div>
      )}

      <Button type="submit" className="w-full mt-2">
        Continue to Payment
      </Button>
    </form>
  );
}
