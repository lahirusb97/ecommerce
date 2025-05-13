"use client";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "../components/ui/navbar-menu";
import { cn } from "@/lib/utils";

export function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-6xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        {/* Women */}
        <MenuItem setActive={setActive} active={active} item="Women">
          <div className="grid grid-cols-2 gap-4 text-sm p-4">
            <HoveredLink href="/women/new-arrivals">New Arrivals</HoveredLink>
            <HoveredLink href="/women/dresses">Dresses</HoveredLink>
            <HoveredLink href="/women/tops">Tops</HoveredLink>
            <HoveredLink href="/women/jeans">Jeans</HoveredLink>
            <HoveredLink href="/women/shoes">Shoes</HoveredLink>
            <HoveredLink href="/women/accessories">Accessories</HoveredLink>
          </div>
        </MenuItem>

        {/* Men */}
        <MenuItem setActive={setActive} active={active} item="Men">
          <div className="grid grid-cols-2 gap-4 text-sm p-4">
            <HoveredLink href="/men/new-arrivals">New Arrivals</HoveredLink>
            <HoveredLink href="/men/shirts">Shirts</HoveredLink>
            <HoveredLink href="/men/pants">Pants</HoveredLink>
            <HoveredLink href="/men/shoes">Shoes</HoveredLink>
            <HoveredLink href="/men/accessories">Accessories</HoveredLink>
            <HoveredLink href="/men/sale">Sale</HoveredLink>
          </div>
        </MenuItem>

        {/* Kids */}
        <MenuItem setActive={setActive} active={active} item="Kids">
          <div className="flex flex-col space-y-2 text-sm p-4">
            <HoveredLink href="/kids/boys">Boys</HoveredLink>
            <HoveredLink href="/kids/girls">Girls</HoveredLink>
            <HoveredLink href="/kids/baby">Baby</HoveredLink>
            <HoveredLink href="/kids/shoes">Shoes</HoveredLink>
            <HoveredLink href="/kids/sale">Sale</HoveredLink>
          </div>
        </MenuItem>

        {/* Sale */}
        <MenuItem setActive={setActive} active={active} item="Sale">
          <div className="flex flex-col space-y-2 text-sm p-4">
            <HoveredLink href="/sale/women">Women’s Sale</HoveredLink>
            <HoveredLink href="/sale/men">Men’s Sale</HoveredLink>
            <HoveredLink href="/sale/kids">Kids’ Sale</HoveredLink>
          </div>
        </MenuItem>

        {/* Featured or Campaigns */}
        <MenuItem setActive={setActive} active={active} item="Featured">
          <div className="grid grid-cols-2 gap-4 text-sm p-4">
            <ProductItem
              title="Spring Collection"
              href="/collections/spring"
              src="/images/collections/spring.jpg"
              description="Fresh styles for the new season"
            />
            <ProductItem
              title="Sustainable Picks"
              href="/collections/sustainable"
              src="/images/collections/sustainable.jpg"
              description="Eco-friendly fashion you'll love"
            />
          </div>
        </MenuItem>
      </Menu>
    </div>
  );
}
