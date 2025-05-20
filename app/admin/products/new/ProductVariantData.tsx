import { ProductFormModel } from "@/schema/schemaProduct";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useFieldArray } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useGetVariantOptionsValus from "@/hooks/useGetVariantOptionsValus";
import { ProductImageUploader } from "./ProductImageUploader";

export default function ProductVariantData() {
  const { variantOptionsValues, variantOptionsValuesLoading } =
    useGetVariantOptionsValus();
  const { control, register, setValue, watch } =
    useFormContext<ProductFormModel>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div>
      {fields.map((field, variantIndex) => (
        <div
          key={field.id}
          className="mb-6 rounded-xl border border-neutral-200 bg-gray-50 p-4 shadow-sm space-y-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            {/* SKU */}
            <div>
              <label
                htmlFor={`sku-${field.id}`}
                className="block text-sm font-medium mb-1"
              >
                SKU
              </label>
              <Input
                id={`sku-${field.id}`}
                className="w-full"
                {...register(`variants.${variantIndex}.sku`)}
                placeholder="Enter SKU"
              />
            </div>
            {/* Price */}
            <div>
              <label
                htmlFor={`price-${field.id}`}
                className="block text-sm font-medium mb-1"
              >
                Price
              </label>
              <Input
                id={`price-${field.id}`}
                className="w-full"
                type="number"
                step="0.01"
                {...register(`variants.${variantIndex}.price`, {
                  valueAsNumber: true,
                })}
                placeholder="0.00"
              />
            </div>
            {/* Stock */}
            <div>
              <label
                htmlFor={`stockQty-${field.id}`}
                className="block text-sm font-medium mb-1"
              >
                Qty
              </label>
              <Input
                id={`stockQty-${field.id}`}
                className="w-full"
                type="number"
                {...register(`variants.${variantIndex}.stockQty`, {
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
            </div>
            {/* Image URL */}
            <div></div>
          </div>
          {/* Image upload */}
          <div>
            <label
              htmlFor={`imageUrl-${field.id}`}
              className="block text-sm font-medium mb-1"
            >
              Image URL
            </label>
            <Controller
              name={`variants.${variantIndex}.imageUrl`}
              control={control}
              render={({ field }) => (
                <ProductImageUploader
                  value={field.value}
                  publicId={watch(`variants.${variantIndex}.publicId`)} // Track publicId separately!
                  onUploaded={(url) => field.onChange(url)}
                  onPublicIdChange={(id) =>
                    setValue(`variants.${variantIndex}.publicId`, id)
                  }
                />
              )}
            />
          </div>
          {/* Variant Option Selects */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {fields[variantIndex].values?.map((v, valueIndex) => {
              const opt = variantOptionsValues?.find(
                (o) => o.id === v.optionId
              );
              if (!opt) return null;
              return (
                <div key={opt.id}>
                  <label className="block text-sm font-medium mb-1">
                    {opt.name}
                  </label>
                  <Controller
                    name={`variants.${variantIndex}.values.${valueIndex}.valueId`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        disabled={variantOptionsValuesLoading}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={`Select ${opt.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {opt.values.map((val) => (
                            <SelectItem key={val.id} value={val.id}>
                              {val.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              );
            })}
          </div>

          {/* Remove Variant Button */}
          <div className="flex justify-end">
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => remove(variantIndex)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      {/* Add Variant Button */}
      <Button
        size="xsm"
        type="button"
        variant="outline"
        className=""
        onClick={() =>
          append({
            sku: "",
            price: 0,
            stockQty: 0,
            imageUrl: "",
            values: (variantOptionsValues || []).map((opt) => ({
              optionId: opt.id,
              valueId: "",
            })),
          })
        }
        disabled={!variantOptionsValues?.length}
      >
        + Add Variant
      </Button>
    </div>
  );
}
