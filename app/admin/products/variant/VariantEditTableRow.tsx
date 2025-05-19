"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { schemaVariantOption } from "@/schema/schemaVariantOption";
import { useState } from "react";
import { toast } from "sonner";

export function VariantEditTableRow({
  id,
  initialName,
  colSpan,
  onSaved,
  onCancel,
}: {
  id: number | string;
  initialName: string;
  colSpan: number;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<{ name: string }>({
    resolver: zodResolver(schemaVariantOption),
    defaultValues: { name: initialName },
  });

  const onSubmit = async (values: { name: string }) => {
    setServerError(null);
    try {
      const res = await fetch(`/api/variant-options/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        if (typeof data.error === "string") {
          toast.error(data.error);
        }
        return;
      }
      reset(values);
      if (onSaved) onSaved();
    } catch {}
  };

  return (
    <tr>
      <td colSpan={colSpan} className="py-2 px-3 bg-muted">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-2 items-start md:items-center"
        >
          <div className="flex-1">
            <Input
              placeholder="Variant Option Name"
              {...register("name")}
              disabled={isSubmitting}
              className="w-full"
            />
            {errors.name && (
              <div className="text-red-500 text-xs mt-1">
                {errors.name.message}
              </div>
            )}
            {serverError && (
              <div className="text-red-500 text-xs mt-1">{serverError}</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} size="sm">
              Save
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </td>
    </tr>
  );
}
