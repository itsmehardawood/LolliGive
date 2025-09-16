// app/components/Hero.jsx
"use client";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh]">
      {/* Background Image */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src="https://cdn.pixabay.com/photo/2017/04/25/06/15/father-and-son-2258681_1280.jpg" // replace with your image in public folder
          alt="Hero Background"
          fill
          priority
          className="object-cover rounded-b-[180px]" // only bottom corners rounded
        />
      </div>

      {/* White Box Overlay (Left side) */}
      <div className="absolute inset-0 flex items-center  px-8">
        <div className="bg-white p-8 md:p-12  text-center shadow-lg max-w-lg">
         <p className="text-gray-600 mb-6 text-2xl text-center">
           Join the world’s most trusted and secured platform GIVING to change the story of many people across the globe.
          </p>
          <button className="bg-red-800 text-white px-6 py-3 text-center hover:bg-red-700 transition">
            CREATE ACCOUNT NOW
          </button>
        </div>
      </div>
    </section>
  );
}
