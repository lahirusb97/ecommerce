"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { schemaVariantOption } from "@/schema/schemaVariantOption";
import { toast } from "sonner";
export function VariantCreateTableRow({
  onCreated,
}: {
  onCreated?: () => void;
}) {
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
    try {
      const res = await fetch("/api/variant-options", {
        method: "POST",
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
      reset();
      if (onCreated) onCreated();
    } catch {
      toast.error("Failed to create variant option.");
    }
  };

  return (
    <div className="py-1 mb-1 px-1 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-row gap-2 items-center"
      >
        <div className="flex-1">
          <Input
            placeholder="Add new variant (e.g. Size, Color)"
            {...register("name")}
            disabled={isSubmitting}
            className="w-full"
          />
          {errors.name && (
            <div className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </div>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} size="xsm">
          Add
        </Button>
      </form>
    </div>
  );
}
