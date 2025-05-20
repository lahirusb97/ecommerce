"use client";
import { useForm, Controller } from "react-hook-form";
import { createVariantOptionValue } from "./actions";
import { VariantOption } from "@/lib/generated/prisma";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function VariantOptionCreate({
  options,
}: {
  options: VariantOption[];
}) {
  const router = useRouter();
  const { register, handleSubmit, control, reset, setValue } = useForm<{
    optionId: string;
    value: string;
  }>({
    defaultValues: {
      optionId: options[0]?.id?.toString() || "",
      value: "",
    },
  });

  const onSubmit = async (data: { optionId: string; value: string }) => {
    await createVariantOptionValue(data);
    reset({ optionId: options[0]?.id?.toString() || "", value: "" });
    router.refresh();
    // Optionally trigger a re-fetch or SWR mutate for your list
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center gap-2 p-0 m-0"
      style={{ minHeight: 0 }}
    >
      <Controller
        name="optionId"
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={(val) => setValue("optionId", val)}
          >
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id.toString()}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Input
        {...register("value")}
        placeholder="New Value"
        className="h-8"
        required
      />
      <Button type="submit" size="sm" className="h-8 px-3">
        Add
      </Button>
    </form>
  );
}
