import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useGetCategories from "@/hooks/useGetCategorys";
import useGetBrands from "@/hooks/useGetBrands";
import CategoryMultiSelect from "./CategoryMultiSelect";
export default function ProductMainData() {
  const { categories, categoriesLoading } = useGetCategories();
  const { brands, brandsLoading } = useGetBrands();
  const methods = useFormContext();
  const {
    register,
    control,
    formState: { errors },
  } = methods;
  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Name</label>
          <Input {...register("name")} />
          {errors.name && (
            <p className="text-red-600">{errors.name.message?.toString()}</p>
          )}
        </div>
        <div>
          <label className="block mb-1">Slug</label>
          <Input {...register("slug")} />
          {errors.slug && (
            <p className="text-red-600">{errors.slug.message?.toString()}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block mb-1">Description</label>
        <Textarea {...register("description")} rows={3} />
      </div>

      {/* Category & Brand */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Main Category</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <Select
                disabled={categoriesLoading}
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category …" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cate) => (
                    <SelectItem key={cate.id} value={cate.id.toString()}>
                      {cate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.categoryId && (
            <p className="text-red-600">
              {errors.categoryId.message?.toString()}
            </p>
          )}
        </div>
        <div>
          <label className="block mb-1">Brand (optional)</label>
          <Controller
            name="brandId"
            control={control}
            render={({ field }) => (
              <Select
                disabled={brandsLoading}
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="— none —" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <CategoryMultiSelect categories={categories} />
    </div>
  );
}
