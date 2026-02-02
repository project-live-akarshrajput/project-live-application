"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Video, LogOut, Menu, X } from "lucide-react";
import { Avatar, Button } from "@/components/ui";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xs bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-soft group-hover:shadow-button-hover transition-shadow">
              <Video size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-surface-900">Vibly</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {status === "authenticated" && session ? (
              <>
                <Link
                  href="/chat"
                  className="px-4 py-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-xs transition-all text-sm font-medium"
                >
                  Start Chat
                </Link>
                <Link
                  href="/profile"
                  className="px-4 py-2 text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-xs transition-all text-sm font-medium"
                >
                  Profile
                </Link>
                <div className="flex items-center gap-3 pl-4 ml-2 border-l border-surface-200">
                  <Avatar
                    src={session.user.profileImage}
                    name={session.user.name || "User"}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-surface-900">
                    {session.user.name}
                  </span>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="p-2 rounded-xs hover:bg-surface-100 text-surface-400 hover:text-surface-700 transition-all"
                    title="Sign out"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </>
            ) : status === "loading" ? (
              <div className="w-24 h-9 bg-surface-100 animate-pulse rounded-xs" />
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xs hover:bg-surface-100 text-surface-600"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-surface-200 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {status === "authenticated" && session ? (
                <>
                  <div className="flex items-center gap-3 pb-4 mb-2 border-b border-surface-100">
                    <Avatar
                      src={session.user.profileImage}
                      name={session.user.name || "User"}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-surface-900">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-surface-500">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/chat"
                    className="block px-4 py-2.5 text-surface-700 hover:bg-surface-50 rounded-xs transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Chat
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2.5 text-surface-700 hover:bg-surface-50 rounded-xs transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xs transition-colors"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
