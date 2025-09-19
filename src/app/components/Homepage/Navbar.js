"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const scrollToSection = (e, targetId) => {
  e.preventDefault();
  const target = document.getElementById(targetId);
  if (target) {
    window.scrollTo({
      top: target.offsetTop - 100, // adjust for any fixed header offset
      behavior: "smooth",
    });
  }
};

export default function NavbarHomePage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 lg:py-5">
    <Link href="/" className="flex items-center">
  <Image
    src="/images/lolligive.png" // replace with your logo path or URL
    alt="LolliGive Logo"
    width={50}     // adjust size as needed
    height={70}
    className="h-auto w-auto"
    priority
  />
</Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex space-x-6 xl:space-x-8 items-center">
          <Link
            href="/organization"
            className="text-red-800 font-medium hover:text-red-600 transition text-sm xl:text-base"
            onClick={(e) => scrollToSection(e, "features")}
          >
            ORGANIZATION
          </Link>
          <Link
            href="/about"
            className="text-red-800 font-medium hover:text-red-600 transition text-sm xl:text-base"
            onClick={(e) => scrollToSection(e, "about-us")}
          >
            ABOUT US
          </Link>
          <Link
            href="/"
            className="text-red-800 font-medium hover:text-red-600 transition text-sm xl:text-base"
             onClick={(e) => scrollToSection(e, "security")}

          >
            SECURITY
          </Link>
          <Link
            href="/contact"
            className="text-red-800 font-medium hover:text-red-600 transition text-sm xl:text-base"
            onClick={(e) => scrollToSection(e, "testimonials")}
          >
            CONTACT US
          </Link>

          <Link
            href="/signup"
            className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          className="lg:hidden text-red-800 p-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 sm:px-6 pb-4 space-y-3">
          <Link
            href="/organization"
            className="block text-red-800 font-medium hover:text-red-600 transition py-2"
            onClick={(e) => {
              setIsOpen(false);
              scrollToSection(e, "features");
            }}
          >
            ORGANIZATION
          </Link>
          <Link
            href="/about"
            className="block text-red-800 font-medium hover:text-red-600 transition py-2"
            onClick={(e) => {
              setIsOpen(false);
              scrollToSection(e, "about-us");
            }}
          >
            ABOUT US
          </Link>
          <Link
            href="/"
            className="block text-red-800 font-medium hover:text-red-600 transition py-2"
            onClick={() => setIsOpen(false)}
          >
            SECURITY
          </Link>
          <Link
            href="/contact"
            className="block text-red-800 font-medium hover:text-red-600 transition py-2"
            onClick={(e) => {
              setIsOpen(false);
              scrollToSection(e, "testimonials");
            }}
          >
            CONTACT US
          </Link>

          <Link
            href="#"
            className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium mx-3 mt-2 block text-center"
          >
            Get started
          </Link>
        </div>
      )}
    </nav>
  );
}
