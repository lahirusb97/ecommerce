"use client";
import React, { useState } from "react";
import { ProductModel } from "@/model/ProductModels";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Only read from product prop, useState(0) is safe!
export default function ProductViewPage({
  product,
}: {
  product: ProductModel;
}) {
  const [selected, setSelected] = useState(0);
  const variant = product.variants[selected];

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Left: Image & thumbnails */}
      <div className="flex flex-col gap-4 items-center">
        <Card className="bg-white p-2 w-full flex justify-center items-center">
          <Image
            src={
              variant?.imageUrl?.startsWith("http") ||
              variant?.imageUrl?.startsWith("data:")
                ? variant.imageUrl!
                : "https://ui.shadcn.com/placeholder.svg"
            }
            alt={product.name}
            width={400}
            height={500}
            className="rounded-xl object-cover w-full max-w-md aspect-[4/5] bg-gray-100"
            priority
          />
        </Card>
        <div className="flex gap-2">
          {/* Thumbnails - highlight selected */}
          {product.variants.map((v, idx) => (
            <button
              key={v.id}
              type="button"
              className={`rounded-lg border-2 ${
                idx === selected
                  ? "border-primary ring-2 ring-primary"
                  : "border-neutral-200"
              } transition-all p-0.5`}
              onClick={() => setSelected(idx)}
              aria-label={`Select variant ${idx + 1}`}
            >
              <Image
                src={
                  v.imageUrl?.startsWith("http") ||
                  v.imageUrl?.startsWith("data:")
                    ? v.imageUrl!
                    : "https://ui.shadcn.com/placeholder.svg"
                }
                alt={product.name}
                width={70}
                height={90}
                className="rounded-md object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Product Details */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-3">{product.name}</h1>
        <div className="flex gap-2 mb-2">
          {product.brand?.name && <Badge>{product.brand.name}</Badge>}
          {product.category?.name && (
            <Badge variant="outline">{product.category.name}</Badge>
          )}
        </div>
        <div className="text-xl font-semibold text-primary mb-4">
          Rs. {parseInt(variant.price).toLocaleString()}
        </div>
        <div className="mb-4 text-neutral-700 dark:text-neutral-300">
          {product.description}
        </div>

        {/* Variant Options (e.g., Color, Size) */}
        {variant.options?.length > 0 && (
          <div className="mb-4">
            <div className="font-semibold mb-2">Options</div>
            <div className="flex gap-2 flex-wrap">
              {variant.options.map((opt, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {opt.optionName}: {opt.value}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-muted-foreground mb-4">
          <span className="font-mono">SKU: {variant.sku}</span> | Stock:{" "}
          {variant.stockQty}
        </div>

        <Button
          size="lg"
          className="w-full mt-6"
          disabled={variant.stockQty <= 0}
        >
          {variant.stockQty > 0 ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </div>
  );
}
