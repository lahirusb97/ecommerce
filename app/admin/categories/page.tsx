import React from "react";
import CreateMainCategoryForm from "./CreateMainCategoryForm";
import CreateSubCategoryForm from "./CreateSubCategoryForm";
import { prisma } from "@/lib/prisma";
import CategoryTable from "./CategoryTable";

export default async function page() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    include: {
      children: {
        orderBy: { name: "asc" },
      },
    },
  });

  return (
    <div>
      <CreateMainCategoryForm />
      <CreateSubCategoryForm categories={categories} />
      <CategoryTable categories={categories} />
    </div>
  );
}
