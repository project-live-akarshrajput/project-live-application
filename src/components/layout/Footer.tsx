"use client";

import React from "react";
import Link from "next/link";
import { Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Video size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">LiveChat</span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/terms"
              className="text-dark-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-dark-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/safety"
              className="text-dark-400 hover:text-white transition-colors"
            >
              Safety Guidelines
            </Link>
          </nav>

          <p className="text-sm text-dark-500">
            © {new Date().getFullYear()} LiveChat. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
