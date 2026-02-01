"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Video, User, LogOut, Menu, X } from "lucide-react";
import { Avatar, Button } from "@/components/ui";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-dark-900/95 backdrop-blur-sm border-b border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Video size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white">LiveChat</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {status === "authenticated" && session ? (
              <>
                <Link
                  href="/chat"
                  className="text-dark-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Start Chat
                </Link>
                <Link
                  href="/profile"
                  className="text-dark-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Profile
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-dark-700">
                  <Avatar
                    src={session.user.profileImage}
                    name={session.user.name || "User"}
                    size="sm"
                  />
                  <span className="text-sm text-white">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
                    title="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : status === "loading" ? (
              <div className="w-20 h-8 bg-dark-800 animate-pulse rounded-lg" />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-800 text-dark-400"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-t border-dark-800">
          <div className="px-4 py-4 space-y-3">
            {status === "authenticated" && session ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b border-dark-800">
                  <Avatar
                    src={session.user.profileImage}
                    name={session.user.name || "User"}
                    size="md"
                  />
                  <div>
                    <p className="font-medium text-white">
                      {session.user.name}
                    </p>
                    <p className="text-sm text-dark-400">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/chat"
                  className="block py-2 text-dark-200 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Start Chat
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 text-dark-200 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full text-left py-2 text-red-400 hover:text-red-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
