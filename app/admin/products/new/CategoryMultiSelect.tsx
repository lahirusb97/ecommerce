"use client";
import { Controller, useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CategoryMultiSelectProps {
  categories: { id: string; name: string }[];
  fieldName?: string; // allows you to set the form field name if you want to reuse
}

export default function CategoryMultiSelect({
  categories,
  fieldName = "productCategoryIds",
}: CategoryMultiSelectProps) {
  const { control } = useFormContext();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-2 mt-2 space-y-6 shadow-sm">
      <h3 className="font-semibold text-lg text-neutral-700 mb-1">
        SubCategories
      </h3>
      <p className="text-xs text-neutral-400 mb-3">
        Choose a main category and any additional subcategories. Main category
        is used for store organization, others for filters/search.
      </p>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={field.value?.includes(category.id) || false}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      field.onChange([...(field.value || []), category.id]);
                    } else {
                      field.onChange(
                        (field.value || []).filter(
                          (id: string) => id !== category.id
                        )
                      );
                    }
                  }}
                />
                <Label htmlFor={`cat-${category.id}`}>{category.name}</Label>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
}
