import React from "react";
import VariantList from "./VariantList";
import VariantOptionValueList from "./VariantOptionValueList";
import { prisma } from "@/lib/prisma";

export default async function page() {
  const [values, options] = await Promise.all([
    prisma.variantOptionValue.findMany({
      orderBy: { id: "asc" },
      include: { option: true },
    }),
    prisma.variantOption.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-2 md:flex-row ">
      <VariantList />
      <VariantOptionValueList initialValues={values} initialOptions={options} />
    </div>
  );
}
