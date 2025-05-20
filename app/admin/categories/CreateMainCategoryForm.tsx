// components/forms/CreateMainCategoryForm.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import schemaCategory, { CategoryFormModel } from "@/schema/schemaCategory";
import { toast } from "sonner";

export default function CreateMainCategoryForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormModel>({
    resolver: zodResolver(schemaCategory.pick({ name: true, slug: true })),
  });

  async function onSubmit(data: CategoryFormModel) {
    startTransition(async () => {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        reset();
        toast.success("Main category created successfully");
        router.refresh(); // ← auto-refresh your listing
      } else {
        if (res.status === 409) {
          toast.error("Category already exists");
        } else {
          toast.error("Failed to create category");
        }
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Category Name" {...register("name")} />
      {errors.name && (
        <p className="text-red-500 text-sm">{errors.name.message}</p>
      )}

      <Input placeholder="Slug (e.g., men)" {...register("slug")} />
      {errors.slug && (
        <p className="text-red-500 text-sm">{errors.slug.message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Main Category"}
      </Button>
    </form>
  );
}
