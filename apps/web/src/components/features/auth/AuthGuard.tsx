"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStatus } from "@/hooks";
import { Skeleton } from "@/components/ui";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  redirectTo = "/login",
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStatus();
  const router = useRouter();
  const pathname = usePathname();

  // Define route configurations
  const protectedRoutes = ["/showcase", "/profile"];
  const authRoutes = ["/login", "/register", "/forgot-password"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  useEffect(() => {
    if (isLoading) return; // Wait for auth state to be determined

    // Redirect unauthenticated users from protected routes to login
    if (isProtectedRoute && !isAuthenticated) {
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
      return;
    }

    // Redirect authenticated users from auth routes to showcase
    if (isAuthRoute && isAuthenticated) {
      router.push("/showcase");
      return;
    }
  }, [
    isAuthenticated,
    isLoading,
    isProtectedRoute,
    isAuthRoute,
    pathname,
    router,
    redirectTo,
  ]);

  // Show loading state while determining auth
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="space-y-4 w-full max-w-md">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-3/4" />
          </div>
        </div>
      )
    );
  }

  // Show redirecting state for protected routes when not authenticated
  if (isProtectedRoute && !isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting to login...</p>
          </div>
        </div>
      )
    );
  }

  // Show redirecting state for auth routes when authenticated
  if (isAuthRoute && isAuthenticated) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Redirecting...</p>
          </div>
        </div>
      )
    );
  }

  // Render children for all other cases
  return <>{children}</>;
}
