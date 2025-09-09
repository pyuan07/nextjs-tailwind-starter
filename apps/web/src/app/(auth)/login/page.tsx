"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { logger } from "@/lib/logger";
import { useAuth } from "@/hooks";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Loader2 } from "lucide-react";
import { Icon } from "@/lib/icons";

function LoginContent() {
  const _router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const redirectTo = searchParams.get("redirect") || "/showcase";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);

      // Wait for auth state to fully update before redirect
      // Also force a page reload to ensure auth state is properly initialized
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 500);
    } catch (err) {
      logger.error("Login failed", err as Error);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "demo@example.com",
      password: "password",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          {searchParams.get("redirect")
            ? "Please sign in to access this page"
            : "Sign in to your account to continue"}
        </p>
      </div>

      {/* Redirect Notice */}
      {searchParams.get("redirect") && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <Icon name="warning" size="sm" className="inline mr-1" />
            You need to sign in to access{" "}
            <span className="font-medium">{searchParams.get("redirect")}</span>
          </p>
        </div>
      )}

      {/* Login Form */}
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Demo Credentials */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-md">
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
              Demo credentials:
            </p>
            <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <li>Email: demo@example.com</li>
              <li>Password: password</li>
            </ul>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Click to use demo credentials
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Links */}
      <div className="text-center text-sm">
        <div className="flex items-center justify-center space-x-1">
          <span className="text-muted-foreground">Don't have an account?</span>
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Create one here
          </Link>
        </div>
        <div className="mt-2">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
