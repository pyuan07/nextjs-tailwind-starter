"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks";
import { RegisterForm } from "@/components/features";
import { Card, CardContent } from "@/components/ui";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/showcase");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  const handleRegisterSuccess = () => {
    toast.success("Account created successfully! Welcome aboard!");
    router.push("/showcase");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground">
          Get started with your free account today
        </p>
      </div>

      {/* Register Form */}
      <RegisterForm onSuccess={handleRegisterSuccess} />

      {/* Links */}
      <div className="text-center text-sm">
        <div className="flex items-center justify-center space-x-1">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
