"use server";
import React from "react";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwtToken";
import { CustomerNav } from "@/components/navbar/customer-nav/CustomerNav";
import { prisma } from "@/lib/prisma";
import { Category, category_status } from "@/lib/generated/prisma";
import AdminNav from "@/components/navbar/admin-nav/AdminNav";
export interface NavCategory {
  id: string;
  name: string;
  slug: string;
  children: NavCategory[];
  status: category_status;
  parentId: string | null;
}
export default async function NavBarWrapper() {
  const token = (await cookies()).get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;
  // Fetch root categories with children
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: true },
    orderBy: { name: "asc" },
  });
  function serializeCategory(
    category: Category & { children?: Category[] }
  ): NavCategory {
    return {
      id: category.id.toString(),
      name: category.name,
      slug: category.slug,
      status: category.status,
      parentId: category.parentId ? category.parentId.toString() : null,
      children: (category.children ?? []).map(serializeCategory),
    };
  }

  const navCategories = categories.map(serializeCategory);

  return (
    <div>
      {payload?.role === "ADMIN" ? (
        <div>
          {/* <AdminNav /> */}
          <AdminNav isLogin={!!payload} />
        </div>
      ) : (
        <CustomerNav isLogin={!!payload} categories={navCategories} />
      )}
    </div>
  );
}
