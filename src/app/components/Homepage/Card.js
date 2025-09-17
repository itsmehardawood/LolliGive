// app/components/Card.jsx
"use client";
import Image from "next/image";

export default function Card({ image, title, description }) {
  return (
    <div className="bg-white  w-full max-w-sm mx-auto  transition-shadow duration-300 ">
      {/* Image with responsive height */}
      <div className="relative w-full h-60 sm:h-60 lg:h-80">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-tr-[50px] "
        />
      </div>

      {/* Content with responsive padding */}
      <div className="p-3 sm:p-4 lg:p-5">
        <h3 className="text-lg sm:text-xl font-semibold text-red-800 mb-2 text-center">{title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">{description}</p>
      </div>
    </div>
  );
}



