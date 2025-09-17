// components/Organization/OrgHero.js
"use client";

import { useState } from "react";
import { Heart, ArrowRight } from "lucide-react";

export default function OrgHero({ org }) {
  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent mt-30 lg:mt-20">
      {/* Background Image (no play button now) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('/images/')`,
        }}
      ></div>

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-6 text-center text-black">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Making a <span className="text-red-800">Difference</span>
            <br />
            One Life at a Time
          </h1>

          {/* Mission Statement */}
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            {org.description.substring(0, 200)}...
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection("#donate")}
              className="group px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <Heart className="w-5 h-5" />
              Donate Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={() => scrollToSection("#about")}
              className="px-8 py-4 bg-black/5 hover:bg-black/10 text-black font-semibold rounded-lg border-2 border-black/20 transition-all duration-300"
            >
              Learn More
            </button>
          </div>

          {/* Stats/Impact Numbers */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-800 mb-2">
                1M+
              </div>
              <div className="text-black/70">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-800 mb-2">
                50+
              </div>
              <div className="text-black/70">Countries Served</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-800 mb-2">
                25 Years
              </div>
              <div className="text-black/70">Of Service</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-black/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-black/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}
