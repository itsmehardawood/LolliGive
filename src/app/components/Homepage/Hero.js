"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh]">
      {/* Background Image */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src="https://cdn.pixabay.com/photo/2017/04/25/06/15/father-and-son-2258681_1280.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover sm:rounded-b-[120px] lg:rounded-b-[180px]"
        />
      </div>

      {/* White Box Overlay */}
      <div className="absolute inset-0 flex items-center justify-start  sm:justify-center px-4 sm:px-8">
        <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-11 text-center shadow-lg max-w-xs sm:max-w-sm lg:max-w-lg w-full sm:w-auto">
          <p className="text-gray-600 mb-4 sm:mb-6 text-lg sm:text-xl lg:text-2xl text-center leading-relaxed">
            Join the worlds most trusted and secured platform GIVING to change
            the story of many people across the globe.
          </p>
          <button className="bg-red-800 text-white px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium hover:bg-red-700 transition w-full sm:w-auto">
            CREATE ACCOUNT NOW
          </button>
        </div>
      </div>
    </section>
  );
}
