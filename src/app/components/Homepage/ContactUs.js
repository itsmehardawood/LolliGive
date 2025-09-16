// app/components/ContactSection.jsx
"use client";
import Image from "next/image";

export default function ContactSection() {
  return (
    <section className="h-[600px] bg-red-900 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: Contact Image */}
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src="https://cdn.pixabay.com/photo/2016/03/09/09/17/phone-1245699_1280.jpg"
            alt="Contact Illustration"
            fill
            className="object-cover"
          />
        </div>

        {/* Right: Contact Box */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Top broken divider */}
          <div className="border-t-2 border-dashed border-red-900 mb-6"></div>

          {/* Form Heading */}
          <h2 className="text-2xl font-bold text-red-900 text-center mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Have any questions? Fill out the form and we’ll get back to you soon.
          </p>

          {/* Contact Form */}
          <form className="space-y-4 text-gray-700">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-900"
            />
            <textarea
              rows="3"
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-900"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-red-900 text-white font-semibold py-2 rounded-lg hover:bg-red-800 transition"
            >
              Send Message
            </button>
          </form>

          {/* Contact Info */}
          <div className="mt-6 text-gray-700 text-center">
            <p>
              📍 123 Main Street, Lahore, Pakistan
            </p>
            <p>
              📞 +92 300 1234567
            </p>
            <p>
              ✉️ info@example.com
            </p>
          </div>

          {/* Bottom broken divider */}
          <div className="border-t-2 border-dashed border-red-900 mt-6"></div>
        </div>
      </div>
    </section>
  );
}
