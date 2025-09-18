"use client";

export default function Navbar({ navbarData, organizationSlug }) {
  const {
    logo = "LolliGive",
    organizationName,
    menuItems = [
      { label: "Home", href: "#home" },
      { label: "About", href: "#about" },
      { label: "Contact", href: "#contact" }
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
                <div className="text-gray-400">|</div>
                <div className="text-lg font-medium text-gray-700">
                  {organizationName}
                </div>
              </>
            )}
          </div>

          {/* Navigation Menu */}
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

          {/* Donate Button */}
          <button
            onClick={handleDonateClick}
            className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            {donateButton.text}
          </button>
        </div>
      </div>
    </nav>
  );
}