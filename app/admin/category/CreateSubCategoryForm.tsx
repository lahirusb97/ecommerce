"use client";

import { z } from "zod";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { CategoryFormModel } from "@/schema/schemaCategory";
import { Category } from "@/lib/generated/prisma";

const schemaCategory = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  parentId: z.coerce.number().optional(),
});

export default function CreateSubCategoryForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CategoryFormModel>({
    resolver: zodResolver(schemaCategory),
  });

  async function onSubmit(data: CategoryFormModel) {
    startTransition(async () => {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.ok) {
        toast.success("Subcategory created successfully");

        router.refresh(); // ← here’s the auto-refresh
      } else {
        toast.error(json.error || "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Input
        placeholder="Name"
        {...register("name")}
        className={errors.name && "border-red-500"}
      />
      {errors.name && (
        <p className="text-sm text-red-500">{errors.name.message}</p>
      )}

      <Input
        placeholder="Slug"
        {...register("slug")}
        className={errors.slug && "border-red-500"}
      />
      {errors.slug && (
        <p className="text-sm text-red-500">{errors.slug.message}</p>
      )}

      <Controller
        control={control}
        name="parentId"
        render={({ field: { onChange, value } }) => (
          <Select onValueChange={onChange} value={value?.toString()}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Subcategory"}
      </Button>
    </form>
  );
}
