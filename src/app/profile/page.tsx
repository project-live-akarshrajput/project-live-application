"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Camera, Save, User, Mail, Calendar, Globe } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button, Input, Select, Avatar, Spinner } from "@/components/ui";
import toast from "react-hot-toast";

const PREFERENCE_OPTIONS = [
  { value: "any", label: "Anyone" },
  { value: "male", label: "Male only" },
  { value: "female", label: "Female only" },
];

interface UserProfile {
  email: string;
  username: string;
  displayName: string;
  gender: string;
  genderPreference: string;
  dateOfBirth: string;
  profileImage?: string;
  bio?: string;
  country?: string;
  totalCalls: number;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    genderPreference: "any",
    country: "",
  });

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    fetchProfile();
  }, [session, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
        setFormData({
          displayName: data.data.displayName || "",
          bio: data.data.bio || "",
          genderPreference: data.data.genderPreference || "any",
          country: data.data.country || "",
        });
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile updated");
        setProfile(data.data);
        // Update session
        await update({
          name: formData.displayName,
          genderPreference: formData.genderPreference,
        });
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Profile image updated");
        setProfile((prev) =>
          prev ? { ...prev, profileImage: data.data.profileImage } : null,
        );
        await update({ profileImage: data.data.profileImage });
      } else {
        toast.error(data.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-950">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-white mb-8">
            Profile Settings
          </h1>

          {/* Profile Image */}
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Profile Picture
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar
                  src={profile.profileImage}
                  name={profile.displayName}
                  size="xl"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-900/80 rounded-full">
                    <Spinner size="sm" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Camera size={16} className="mr-2" />
                  Change Photo
                </Button>
                <p className="text-sm text-dark-400 mt-2">
                  JPG, PNG, or WebP. Max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Profile Information
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-2 border-b border-dark-800">
                <Mail size={18} className="text-dark-400" />
                <div>
                  <p className="text-sm text-dark-400">Email</p>
                  <p className="text-white">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-b border-dark-800">
                <User size={18} className="text-dark-400" />
                <div>
                  <p className="text-sm text-dark-400">Username</p>
                  <p className="text-white">@{profile.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2 border-b border-dark-800">
                <Calendar size={18} className="text-dark-400" />
                <div>
                  <p className="text-sm text-dark-400">Member since</p>
                  <p className="text-white">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <Globe size={18} className="text-dark-400" />
                <div>
                  <p className="text-sm text-dark-400">Total calls</p>
                  <p className="text-white">{profile.totalCalls}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile */}
          <div className="bg-dark-900 border border-dark-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Edit Profile
            </h2>
            <div className="space-y-4">
              <Input
                label="Display Name"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                placeholder="Your display name"
              />

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={3}
                  maxLength={500}
                  className="w-full px-3 py-2 rounded-lg bg-dark-800 border border-dark-600 text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  placeholder="Tell others about yourself..."
                />
                <p className="text-xs text-dark-500 mt-1">
                  {formData.bio.length}/500
                </p>
              </div>

              <Select
                label="Match Preference"
                options={PREFERENCE_OPTIONS}
                value={formData.genderPreference}
                onChange={(e) =>
                  setFormData({ ...formData, genderPreference: e.target.value })
                }
              />

              <Input
                label="Country (optional)"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Your country"
              />

              <div className="pt-4">
                <Button onClick={handleSave} isLoading={isSaving}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
