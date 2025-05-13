import { AppleStyleDock } from "@/components/AppleStyleDock";
import { Dock, DockItem, DockLabel } from "@/components/motion-primitives/dock";
import { NavbarDemo } from "@/components/NavbarDemo";
import { Button } from "@/components/ui/button";
import React from "react";

export default function page() {
  return (
    <div>
      <Button variant={"outline"}>Test</Button>
      <AppleStyleDock />
      <NavbarDemo />
    </div>
  );
}
