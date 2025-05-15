// app/auth/logoutAction.ts
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  (await cookies()).set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
  redirect("/login");
}
