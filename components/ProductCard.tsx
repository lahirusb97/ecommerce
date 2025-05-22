import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

import { Prisma } from "@/lib/generated/prisma";
export type ProductWithAllRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    brand: true;
    variants: {
      include: {
        values: {
          include: {
            option: true;
            value: true;
          };
        };
        OrderItem: true;
      };
    };
    productCategories: {
      include: {
        category: true;
      };
    };
    OrderItem: true;
  };
}>;
export interface ProductCardProps {
  product: ProductWithAllRelations;
}
export function ProductCard({ product }: ProductCardProps) {
  const variant = product.variants[0];
  const imageUrl =
    variant?.imageUrl?.startsWith("http") ||
    variant?.imageUrl?.startsWith("data:")
      ? variant.imageUrl
      : "https://ui.shadcn.com/placeholder.svg"; // fallback placeholder

  return (
    <Card
      className={cn(
        "w-full max-w-xs flex flex-col hover:shadow-lg transition-shadow duration-150 p-1 m-0 gap-0 cursor-pointer hover:bg-gray-50"
      )}
    >
      {/* Remove default p-6/py-4 on CardHeader/CardContent via p-0/m-0! */}
      <CardHeader className="flex flex-col items-center p-0 m-0">
        <div className="w-full aspect-[4/5] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg mb-1">
          <Image
            src={imageUrl}
            alt={product.name}
            width={180}
            height={320}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
        <CardTitle className="text-base text-center line-clamp-2 mb-1 mt-0">
          {product.name}
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-1 justify-center mt-0 mb-1">
          {product.brand?.name && (
            <Badge className="text-xs">{product.brand.name}</Badge>
          )}
          {product.category?.name && (
            <Badge variant="outline" className="text-xs">
              {product.category.name}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-between p-0 m-0">
        {variant && (
          <div className="w-full flex flex-col items-center justify-center text-center space-y-1 px-1">
            <div className="text-primary font-semibold text-sm">
              Rs. {parseInt(variant.price.toString()).toLocaleString()}
            </div>
            {variant.values?.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {variant.values.map((opt, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {opt.option.name}: {opt.value.value}
                  </Badge>
                ))}
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              SKU: <span className="font-mono">{variant.sku}</span>
              {" | "}
              Stock: {variant.stockQty}
            </div>
          </div>
        )}
      </CardContent>

      <Link href={`/${product.slug}`}>
        <Button variant={"outline"} className="w-full">
          View Details
        </Button>
      </Link>
    </Card>
  );
}
