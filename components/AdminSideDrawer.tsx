"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Menu,
  LayoutDashboard,
  Package,
  Box,
  List,
  Tags,
  Users,
  Layers,
  BarChart2,
  Settings,
  UserCog,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";

// Navigation config (same as previous)
const nav = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: Package,
  },
  {
    label: "Products",
    icon: Box,
    children: [
      { label: "All Products", href: "/admin/products", icon: List },
      { label: "Add Product", href: "/admin/products/new", icon: Tags },
      { label: "Categories", href: "/admin/categories", icon: List },
      { label: "Brands", href: "/admin/brands", icon: Tags },
      {
        label: "Variants",
        href: "/admin/products/variant",
        icon: LayoutGrid,
      },
    ],
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Layers,
  },
  {
    label: "Reports",
    href: "/admin/reports",
    icon: BarChart2,
  },
  {
    label: "Settings",
    icon: Settings,
    children: [
      { label: "Profile", href: "/admin/settings/profile", icon: UserCog },
    ],
  },
];

export function AdminSideDrawer() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();

  // For closing drawer when a link is clicked
  const handleLinkClick = () => setDrawerOpen(false);

  return (
    <Drawer direction="left" open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <button
          aria-label="Open sidebar"
          className="p-2 rounded-xl hover:bg-accent transition fixed top-4 left-4 z-40 bg-background shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </DrawerTrigger>
      <DrawerContent className="p-0 w-72 min-h-screen max-w-full z-50">
        <DrawerTitle className="hidden">Admin Sidebar Navigation</DrawerTitle>
        <Card className="h-screen border-none rounded-none shadow-none">
          <nav className="flex flex-col gap-1 py-4 px-2">
            {nav.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    className={cn(
                      "flex items-center w-full px-3 py-2 rounded-xl text-base gap-2 hover:bg-muted transition justify-between",
                      openSection === item.label && "bg-muted font-semibold"
                    )}
                    onClick={() =>
                      setOpenSection(
                        openSection === item.label ? null : item.label
                      )
                    }
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        openSection === item.label && "rotate-180"
                      )}
                    />
                  </button>
                  {openSection === item.label && (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      {item.children.map((child) => (
                        <Link
                          href={child.href}
                          key={child.label}
                          className={cn(
                            "flex items-center px-3 py-2 rounded-lg text-sm gap-2 hover:bg-accent transition",
                            pathname === child.href && "bg-accent font-medium"
                          )}
                          onClick={handleLinkClick}
                        >
                          <child.icon className="w-4 h-4" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  key={item.label}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-xl text-base gap-2 hover:bg-muted transition",
                    pathname === item.href && "bg-muted font-semibold"
                  )}
                  onClick={handleLinkClick}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </Card>
      </DrawerContent>
    </Drawer>
  );
}
