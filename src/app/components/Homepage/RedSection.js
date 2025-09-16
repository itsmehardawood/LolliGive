"use client";

export default function RedSection() {
  return (
    <section className="w-full h-[300px] bg-red-800 rounded-tr-4xl rounded-br-4xl rounded-bl-4xl flex items-center justify-center text-center px-6">
      <div className="text-white max-w-4xl ">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          You are Welcome
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-red-100 mb-6">
We are excited for the visit and exploring more about us. Always remember; you are WHO you think you are based on your thoughts - support people if you can - God sees and rewards every faithful supporter        </p>

        {/* Button */}
        <button className="bg-white text-red-800 font-medium px-20 py-2  hover:bg-red-100 transition">
          Get Started
        </button>
      </div>
    </section>
  );
}
