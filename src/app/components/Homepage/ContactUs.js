

// app/components/ContactSection.jsx
"use client";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="min-h-[550px] bg-red-800 flex items-center justify-center px-4 py-8 rounded-bl-4xl">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-center">
        
        {/* Left: Contact Image - Hidden on small screens, visible on large */}
        <div className="relative w-full max-w-[300px] h-[250px] sm:h-[300px] mx-auto rounded-xl overflow-hidden shadow-lg  lg:block">
          <Image
            src="https://cdn.pixabay.com/photo/2015/11/07/08/49/hand-1030565_1280.jpg"
            alt="Contact Illustration"
            fill
            className="object-cover"
          />
        </div>

        {/* Middle: Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-red-900 text-center mb-3 sm:mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 text-center mb-4 sm:mb-6 text-sm sm:text-base">
            Have any questions? Fill out the form and we will get back to you soon.
          </p>

          <form className="space-y-3 sm:space-y-4 text-gray-700">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <textarea
              rows="3"
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-900 resize-vertical"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-red-800 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-red-700 transition text-sm sm:text-base"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right: Contact Info */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 text-gray-700 w-full">
          <h3 className="text-lg sm:text-xl font-bold text-red-900 mb-3 sm:mb-4">Get in Touch</h3>
          <div className="space-y-2 text-sm sm:text-base">
            <p className="flex items-start gap-2">
              <span className="text-lg">📍</span>
              <span>123 Main Street, Ghanna, USA</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">📞</span>
              <span>+1 234 123 567</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">✉️</span>
              <span className="break-all">info@lolligive.com</span>
            </p>
          </div>

          {/* Broken divider for style */}
          <div className="border-t-2 border-dashed border-red-800 mt-4 sm:mt-6"></div>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
            We usually reply within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
