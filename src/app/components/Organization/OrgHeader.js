// components/OrgHeader.jsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function OrgHeader({ org }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { name: "About Us", href: "#about" },
    { name: "Our Work", href: "#programs" },
    { name: "Impact", href: "#impact" },
    { name: "How to Help", href: "#help" },
    { name: "News", href: "#news" },
    { name: "Contact Us", href: "#contact" }
  ];

  const scrollToSection = (href) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className="w-full py-4 px-6 border-b border-black/10 shadow-sm fixed top-0 z-50"
      style={{ backgroundColor: org.theme?.primary || "#2563eb" }}
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo + Org Name */}
        <div className="flex items-center gap-4">
          <img
            src={org.logo}
            alt={`${org.name} logo`}
            className="h-12 w-12 object-contain rounded-full bg-white p-1 shadow"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white">
              {org.name}
            </h1>
            {org.tagline && (
              <p className="text-sm text-white/80">{org.tagline}</p>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="text-white hover:text-white/80 transition-colors duration-200 font-medium"
            >
              {item.name}
            </button>
          ))}
          <button
            onClick={() => scrollToSection('#donate')}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-100 transition-colors duration-200 ml-4"
          >
            Donate Now
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden text-white p-2"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg">
          <nav className="container mx-auto py-4 px-6 flex flex-col gap-4">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-left text-gray-800 hover:text-gray-600 transition-colors duration-200 font-medium py-2"
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('#donate')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition-colors duration-200 mt-2"
            >
              Donate Now
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
