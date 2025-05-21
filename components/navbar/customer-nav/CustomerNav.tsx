"use client";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarButton,
  NavbarLogo,
  NavBody,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface CustomerNavProps {
  categories: Category[];
}

export function CustomerNav({ categories }: CustomerNavProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <div className="flex gap-4 items-center">
            {categories.map((cat) =>
              cat.children && cat.children.length > 0 ? (
                <DropdownMenu key={cat.id}>
                  <DropdownMenuTrigger asChild>
                    <button className="px-2 py-1 hover:text-primary transition cursor-pointer bg-transparent border-0 outline-none">
                      {cat.name}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="start"
                    className="min-w-[180px] z-50"
                  >
                    {/* Main category as first item */}
                    <DropdownMenuItem
                      className="px-2 py-1 hover:text-primary transition cursor-pointer bg-transparent border-0 outline-none"
                      asChild
                    >
                      <Link
                        href={`/category/${cat.slug}`}
                        className="w-full block px-2 py-1 font-semibold"
                      >
                        {cat.name}
                      </Link>
                    </DropdownMenuItem>
                    {/* Subcategories */}
                    {cat.children.map((sub) => (
                      <DropdownMenuItem
                        className="px-2 py-1 hover:text-primary transition cursor-pointer bg-transparent border-0 outline-none"
                        asChild
                        key={sub.id}
                      >
                        <Link
                          href={`/category/${sub.slug}`}
                          className="w-full block px-2 py-1"
                        >
                          {sub.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="px-2 py-1 hover:text-primary transition"
                >
                  {cat.name}
                </Link>
              )
            )}
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin-login">
              <Button variant="secondary">Admin Login</Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary">Customer Login</Button>
            </Link>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {/* Mobile: expandable/collapsible categories */}
            {categories.map((cat) => (
              <div key={cat.id} className="mb-1">
                <Link
                  href={`/category/${cat.slug}`}
                  className="relative text-neutral-600 dark:text-neutral-300 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="block font-semibold">{cat.name}</span>
                </Link>
                {cat.children && cat.children.length > 0 && (
                  <div className="ml-3 border-l border-neutral-200 dark:border-neutral-700">
                    {cat.children.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${sub.slug}`}
                        className="block px-2 py-1 text-neutral-600 dark:text-neutral-300 hover:bg-primary/10"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="flex w-full flex-col gap-4 mt-2">
              <Link href="/login">
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Customer Login
                </NavbarButton>
              </Link>
              <Link href="/admin-login">
                <NavbarButton
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="primary"
                  className="w-full"
                >
                  Admin Login
                </NavbarButton>
              </Link>
              <NavbarButton
                onClick={() => setIsMobileMenuOpen(false)}
                variant="primary"
                className="w-full"
              >
                Admin Login
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
