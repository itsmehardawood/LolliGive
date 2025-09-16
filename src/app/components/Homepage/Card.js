// app/components/Card.jsx
"use client";
import Image from "next/image";

export default function Card({ image, title, description }) {
  return (
    <div className="bg-white shadow-md max-w-sm">
      {/* Image with only top-right rounded */}
      <div className="relative w-full h-48">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover rounded-tr-4xl"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-red-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
