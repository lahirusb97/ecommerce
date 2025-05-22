"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  List,
  Tags,
  LayoutGrid,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "./ui/button";

// Types for navigation
type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string; icon: React.ElementType }[];
};

// Navigation config
const nav: NavItem[] = [
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
    label: "All Products",
    href: "/admin/products",
    icon: List,
  },
  {
    label: "Add Product",
    href: "/admin/products/new",
    icon: Tags,
  },
  {
    label: "Categories",
    href: "/admin/category",
    icon: List,
  },
  {
    label: "Brands",
    href: "/admin/brands",
    icon: Tags,
  },
  {
    label: "Variants",
    href: "/admin/products/variant",
    icon: LayoutGrid,
  },
  // Add children array for sections with sub-links if needed.
];

interface AdminSideDrawerProps {
  isLogin: boolean;
}

export function AdminSideDrawer({ isLogin }: AdminSideDrawerProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // For closing drawer when a link is clicked
  const handleLinkClick = () => setDrawerOpen(false);

  // Logout handler
  const handleLogout = async () => {
    setDrawerOpen(false);
    // Adjust according to your auth method.
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/admin-login");
  };

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
        <Card className="h-screen border-none rounded-none shadow-none flex flex-col">
          <nav className="flex flex-col gap-1 py-4 px-2 flex-1">
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
                  href={item.href!}
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
          {/* Logout button */}
          {isLogin && (
            <Button
              onClick={handleLogout}
              className="m-4 flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          )}
        </Card>
      </DrawerContent>
    </Drawer>
  );
}
