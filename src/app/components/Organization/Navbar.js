"use client";
import { useState } from 'react';

export default function Navbar({ navbarData, organizationSlug }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    logo = "LolliGive",
    organizationName,
    menuItems = [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" },
      { label: "Ministry | Groups", href: "#about" }

    ],
    donateButton = {
      text: "Donate Now",
      action: null
    }
  } = navbarData || {};

  const handleSmoothScroll = (href) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    // Close mobile menu after navigation
    setIsMenuOpen(false);
  };

  const handleDonateClick = () => {
    if (donateButton.action) {
      donateButton.action();
    } else {
      // Default action: scroll to donation section
      handleSmoothScroll('#donate');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Organization Name */}
          <div className="flex items-center space-x-3">
            <div className="text-xl font-bold text-red-800">
              {logo}
            </div>
            {organizationName && (
              <>
                <div className="text-gray-400 hidden sm:block">|</div>
                <div className="text-lg font-medium text-gray-700 hidden sm:block">
                  {organizationName}
                </div>
              </>
            )}
          </div>

          {/* Desktop Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleSmoothScroll(item.href);
                }}
                className="text-gray-700 hover:text-red-800 transition-colors cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Donate Button */}
          <button
            onClick={handleDonateClick}
            className="hidden md:block bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            {donateButton.text}
          </button>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-red-800 focus:outline-none focus:text-red-800 p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSmoothScroll(item.href);
                  }}
                  className="text-gray-700 hover:text-red-800 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
              {/* Mobile Donate Button */}
              <button
                onClick={() => {
                  handleDonateClick();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors mt-3"
              >
                {donateButton.text}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}