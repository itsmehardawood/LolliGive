"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white ">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-10">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-red-800">
          LOGO
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8">
          <Link
            href="/organization"
            className="text-red-800 font-medium hover:text-red-600 transition"
          >
            ORGANIZATION
          </Link>
          <Link
            href="/about"
            className="text-red-800 font-medium hover:text-red-600 transition"
          >
            ABOUT US
          </Link>
          <Link
            href="/security"
            className="text-red-800 font-medium hover:text-red-600 transition"
          >
            SECURITY
          </Link>
          <Link
            href="/contact"
            className="text-red-800 font-medium hover:text-red-600 transition"
          >
            CONTACT US
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-red-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-6 space-y-4">
          <Link
            href="/organization"
            className="block text-red-800 font-medium hover:text-red-600 transition"
            onClick={() => setIsOpen(false)}
          >
            ORGANIZATION
          </Link>
          <Link
            href="/about"
            className="block text-red-800 font-medium hover:text-red-600 transition"
            onClick={() => setIsOpen(false)}
          >
            ABOUT US
          </Link>
          <Link
            href="/security"
            className="block text-red-800 font-medium hover:text-red-600 transition"
            onClick={() => setIsOpen(false)}
          >
            SECURITY
          </Link>
          <Link
            href="/contact"
            className="block text-red-800 font-medium hover:text-red-600 transition"
            onClick={() => setIsOpen(false)}
          >
            CONTACT US
          </Link>
        </div>
      )}
    </nav>
  );
}
