"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks";
import { ThemeToggle, UserDropdown } from "@/components/features";
import { Button } from "@/components/ui";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAuth();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            React Tailwind Starter
          </Link>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    href="/showcase"
                    className={cn(
                      navigationMenuTriggerStyle(),
                      pathname === "/showcase" &&
                        "bg-accent text-accent-foreground",
                    )}
                  >
                    Showcase
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {isAuthenticated && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/profile"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === "/profile" &&
                          "bg-accent text-accent-foreground",
                      )}
                    >
                      Profile
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <UserDropdown user={user} />
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
