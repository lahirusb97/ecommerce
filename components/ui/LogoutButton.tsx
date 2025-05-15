"use client";

import { logoutAction } from "@/app/login/LogoutAction";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit">Logout</Button>
    </form>
  );
}
