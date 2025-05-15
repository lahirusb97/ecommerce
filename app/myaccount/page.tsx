import LogoutButton from "@/components/ui/LogoutButton";
import React from "react";

export default async function page() {
  return (
    <div className="p-8">
      <LogoutButton />
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      {/* Customer data */}
    </div>
  );
}
