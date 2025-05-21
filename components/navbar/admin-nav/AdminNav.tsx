import { AdminSideDrawer } from "@/components/AdminSideDrawer";
import React from "react";

interface AdminNavProps {
  isLogin: boolean;
}

export default function AdminNav({ isLogin }: AdminNavProps) {
  return (
    <div>
      <AdminSideDrawer isLogin={isLogin} />
      {/* <NavBar /> */}
    </div>
  );
}
