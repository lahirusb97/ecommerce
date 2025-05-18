"use server";
import React from "react";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwtToken";
import AdminNav from "@/components/navbar/admin-nav/AdminNav";
import CustomerNav from "@/components/navbar/customer-nav/CustomerNav";

export default async function NavBarWrapper() {
  const token = (await cookies()).get("token")?.value;
  const payload = token ? await verifyJwt(token) : null;

  return (
    <div>{payload?.role === "ADMIN" ? <AdminNav /> : <CustomerNav />}</div>
  );
}
