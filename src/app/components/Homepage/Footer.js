


"use client";
import Image from "next/image";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPinterest, FaVimeo } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white min-h-[600px] lg:min-h-[500px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://cdn.pixabay.com/photo/2023/10/23/17/25/hike-8336525_1280.jpg"
          alt="Footer background"
          fill
          priority
          className="object-cover opacity-60"
        />
      </div>

      {/* Faded Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center mb-8 lg:mb-2 lg:text-left">
       

          {/* Connect Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">Connect</h4>
            <div className="text-gray-400 py-3 sm:py-5 text-sm sm:text-base space-y-2">
              <p>Phone: 1-646-450-9293 (US)</p>
              <p>Email: <a href="mailto:support@lolligive.com" className="text-red-400 hover:text-red-300 break-all">support@lolligive.com</a></p>
            </div>
            <div className="flex justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">
              <a href="#" className="text-gray-400 hover:text-red-400 text-lg sm:text-xl"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-red-400 text-lg sm:text-xl"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-red-400 text-lg sm:text-xl"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-red-400 text-lg sm:text-xl"><FaYoutube /></a>
              <a href="#" className="text-gray-400 hover:text-red-400 text-lg sm:text-xl"><FaPinterest /></a>
              <a href="#" className="text-gray-400 hover:text-red-400 text-lg sm:text-xl"><FaLinkedin /></a>
            </div>
          </div>

          {/* Community Development Section */}
          <div>
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">Community Development</h4>
            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
              <li><a href="#" className="hover:text-red-400 transition">Peace & Justice</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Community Health</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Food Security</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Economic Opportunity</a></li>
            </ul>
          </div>

          {/* Disasters Section */}
          <div>
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">Disasters</h4>
            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
              <li><a href="#" className="hover:text-red-400 transition">Disaster Response Services</a></li>
              <li><a href="#" className="hover:text-red-400 transition">International Disaster Response</a></li>
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">About Us</h4>
            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
              <li><a href="#" className="hover:text-red-400 transition">Who We Are</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Complaints</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Affiliations</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Careers</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Policies and Standards</a></li>
              <li><a href="#" className="hover:text-red-400 transition">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom (Sticky to bottom) */}
      <div className="absolute bottom-0 w-full text-center bg-gray-900 py-4 sm:py-4 px-4">
        <p className="text-xs sm:text-sm text-gray-200">
          © {new Date().getFullYear()} LolliGive. All rights reserved. <a href="#" className="text-gray-300 hover:text-red-400 transition">Privacy Policy</a>
        </p>
     
      </div>
    </footer>
  );
}