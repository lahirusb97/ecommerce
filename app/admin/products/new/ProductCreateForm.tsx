"use client";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createProduct } from "./createProductAction";
import { ProductFormModel, schemaCreateProduct } from "@/schema/schemaProduct";
import ProductMainData from "./ProductMainData";
import ProductVariantData from "./ProductVariantData";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateProductForm() {
  const router = useRouter();
  const methods = useForm<ProductFormModel>({
    resolver: zodResolver(schemaCreateProduct),
    defaultValues: { variants: [] },
  });

  const { handleSubmit } = methods;

  const onSubmit = async (data: ProductFormModel) => {
    await createProduct(data);
    toast.success("Product created successfully");
    router.refresh();
  };
  console.log(methods.formState.errors);
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <ProductMainData />
        {/* Variants */}

        <div>
          <h2 className="text-lg font-medium mb-2">Variants</h2>
          <ProductVariantData />
        </div>

        <Button className="w-full" type="submit">
          Create Product
        </Button>
      </form>
    </FormProvider>
  );
}
