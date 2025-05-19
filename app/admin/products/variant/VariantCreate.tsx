"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { schemaVariantOption } from "@/schema/schemaVariantOption";

// Micro Zod schema for creation
// export const schemaVariantOption = z.object({ name: z.string().min(2) });

export function VariantCreate({ onCreated }: { onCreated?: () => void }) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schemaVariantOption),
    defaultValues: { name: "" },
  });

  const onSubmit = async (values: { name: string }) => {
    setServerError(null);
    try {
      const res = await fetch("/api/variant-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data?.error || "Failed to create variant option.");
        return;
      }
      reset();
      if (onCreated) onCreated();
    } catch {
      setServerError("Something went wrong.");
    }
  };

  return (
    <Card className="max-w-sm mx-auto my-6">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            placeholder="Variant Option Name (e.g. Size, Color)"
            {...register("name")}
            disabled={isSubmitting}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
          {serverError && (
            <span className="text-red-500 text-sm">{serverError}</span>
          )}
          <Button type="submit" disabled={isSubmitting}>
            Add Variant Option
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
