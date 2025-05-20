"use client";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { VariantOption } from "@/lib/generated/prisma";
import { useState } from "react";
import { toast } from "sonner";
import isPrismaKnownRequestError from "@/lib/isPrismaKnownRequestError";

export function VariantOptionValueEditRow({
  id,
  options,
  initialOptionId,
  initialValue,
  colSpan,
  onSaved,
  onCancel,
  onUpdate,
}: {
  id: string | number;
  options: VariantOption[];
  initialOptionId: string;
  initialValue: string;
  colSpan: number;
  onSaved?: () => void;
  onCancel?: () => void;
  onUpdate: (data: {
    id: string;
    optionId: string;
    value: string;
  }) => Promise<void>;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    handleSubmit,
    control,
    register,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      optionId: initialOptionId,
      value: initialValue,
    },
  });

  const onSubmit = async (data: { optionId: string; value: string }) => {
    setServerError(null);
    try {
      await onUpdate({ id: id.toString(), ...data });
      if (onSaved) onSaved();
    } catch (err) {
      setServerError(err?.toString() || "Update failed.");
      if (isPrismaKnownRequestError(err)) {
        toast.error(
          typeof err.message === "string" ? err.message : "Update failed."
        );
      } else {
        toast.error("Update failed.");
      }
    }
  };

  return (
    <tr>
      <td
        colSpan={colSpan}
        className={`bg-muted p-2 transition-colors ${
          serverError ? "border-2 border-red-500 animate-shake" : ""
        }`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`flex items-center gap-2`}
        >
          <Controller
            name="optionId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-32 h-8">
                  <SelectValue placeholder="Option" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((o) => (
                    <SelectItem key={o.id.toString()} value={o.id.toString()}>
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <Input
            {...register("value")}
            placeholder="Value"
            className={`h-8 ${serverError ? "border-red-500" : ""}`}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 px-3"
            disabled={isSubmitting}
          >
            Save
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 px-3"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </form>
      </td>
    </tr>
  );
}
