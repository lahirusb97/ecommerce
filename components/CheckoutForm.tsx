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

export function CheckoutForm({
  onSubmit,
  showPasswordField = true,
  initialValues,
}: {
  onSubmit: (data: CheckoutFormModel) => void;
  showPasswordField?: boolean;
  initialValues?: Partial<CheckoutFormModel>;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormModel>({
    resolver: zodResolver(schemaCheckoutForm),
    defaultValues: initialValues,
  });

  const createAccount = watch("createAccount");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
      <div>
        <Input {...register("email")} type="email" placeholder="Email" />
        {errors.email && (
          <div className="text-destructive text-xs">{errors.email.message}</div>
        )}
      </div>
      <div>
        <Input {...register("phone")} placeholder="Phone" />
        {errors.phone && (
          <div className="text-destructive text-xs">{errors.phone.message}</div>
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
      {showPasswordField && (
        <div>
          <label className="flex gap-2 items-center">
            <input type="checkbox" {...register("createAccount")} />
            <span>Create an account?</span>
          </label>
          {createAccount && (
            <div>
              <Input
                {...register("password")}
                type="password"
                placeholder="Password"
              />
              {errors.password && (
                <div className="text-destructive text-xs">
                  {errors.password.message}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Button type="submit" className="w-full mt-2">
        Continue to Payment
      </Button>
    </form>
  );
}
