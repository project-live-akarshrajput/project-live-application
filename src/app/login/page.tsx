"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Video, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Welcome back!");
        router.push("/chat");
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-100/50 rounded-full blur-3xl" />
      </div>

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-surface-500 hover:text-surface-700 text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xs bg-primary-500 flex items-center justify-center shadow-button">
            <Video size={22} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-surface-900">Vibly</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white border border-surface-200 rounded-xs p-8 shadow-card">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-surface-900 mb-1">
              Welcome back
            </h1>
            <p className="text-surface-500 text-sm">
              Sign in to continue to Vibly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-100 text-center">
            <p className="text-surface-500 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Safety Notice */}
        <p className="text-center text-surface-400 text-xs mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-surface-600">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-surface-600">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
