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
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface CustomerNavProps {
  categories: Category[];
  isLogin: boolean;
}

export function CustomerNav({ categories, isLogin }: CustomerNavProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Logout handler
  const handleLogout = async () => {
    // Adjust according to your auth method.
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/login");
  };

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
          {!isLogin && (
            <div className="flex items-center gap-4">
              <Link href="/admin-login">
                <Button variant="secondary">Admin Login</Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary">Customer Login</Button>
              </Link>
            </div>
          )}

          {isLogin && (
            <>
              <Link href="/myaccount">
                <Button variant="secondary">
                  <User />
                  My Account
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="m-4 flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </>
          )}
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

            {isLogin && (
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
            )}
            {isLogin && (
              <Button
                onClick={handleLogout}
                className="m-4 flex items-center gap-2 px-3 py-2 rounded-xl text-base font-semibold text-destructive bg-destructive/10 hover:bg-destructive/20 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
