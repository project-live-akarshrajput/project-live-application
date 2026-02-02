"use client";

import React from "react";
import Link from "next/link";
import { Video } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-soft">
              <Video size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900">Vibly</span>
          </div>

          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/terms"
              className="text-surface-500 hover:text-surface-900 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-surface-500 hover:text-surface-900 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/safety"
              className="text-surface-500 hover:text-surface-900 transition-colors"
            >
              Safety
            </Link>
          </nav>

          <p className="text-sm text-surface-400">
            © {new Date().getFullYear()} Vibly
          </p>
        </div>
      </div>
    </footer>
  );
}
