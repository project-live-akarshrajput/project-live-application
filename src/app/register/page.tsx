"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Video, Eye, EyeOff, Check, ArrowLeft } from "lucide-react";
import { Button, Input, Select } from "@/components/ui";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const GENDER_OPTIONS = [
  { value: "", label: "Select gender..." },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
];

const PREFERENCE_OPTIONS = [
  { value: "any", label: "Anyone" },
  { value: "male", label: "Male only" },
  { value: "female", label: "Female only" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    displayName: "",
    gender: "",
    genderPreference: "any",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!/^[a-z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain lowercase letters, numbers, and underscores";
    }

    if (!formData.displayName) {
      newErrors.displayName = "Display name is required";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select your gender";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          agreeToTerms: agreedToTerms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-50">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-100/50 rounded-full blur-3xl" />
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
              Create account
            </h1>
            <p className="text-surface-500 text-sm">
              Join Vibly and start meeting new people
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                label="Username"
                name="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
              />

              <Input
                type="text"
                label="Display Name"
                name="displayName"
                placeholder="Your Name"
                value={formData.displayName}
                onChange={handleChange}
                error={errors.displayName}
                required
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[34px] text-surface-400 hover:text-surface-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Input
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Gender"
                name="gender"
                options={GENDER_OPTIONS}
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
              />

              <Select
                label="Match Preference"
                name="genderPreference"
                options={PREFERENCE_OPTIONS}
                value={formData.genderPreference}
                onChange={handleChange}
              />
            </div>

            <Input
              type="date"
              label="Date of Birth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
              required
            />

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`mt-0.5 w-5 h-5 rounded-xs border flex items-center justify-center transition-colors ${
                  agreedToTerms
                    ? "bg-primary-500 border-primary-500"
                    : "border-surface-300 bg-white"
                }`}
              >
                {agreedToTerms && <Check size={14} className="text-white" />}
              </button>
              <label className="text-sm text-surface-600">
                I am at least 18 years old and agree to the{" "}
                <Link
                  href="/terms"
                  className="text-primary-500 hover:underline"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-primary-500 hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-500">{errors.terms}</p>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-surface-100 text-center">
            <p className="text-surface-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
