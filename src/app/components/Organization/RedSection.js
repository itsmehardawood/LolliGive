"use client";

export default function RedSection({ welcomeData }) {
  const {
    title = "You are Welcome",
    description = "We are excited for the visit and exploring more about us. Always remember; you are WHO you think you are based on your thoughts - support people if you can - God sees and rewards every faithful supporter",
    buttonText = "Get Started",
    buttonAction
  } = welcomeData || {};

  return (
    <section className="w-full min-h-[250px] sm:min-h-[300px] bg-red-800 rounded-tr-2xl sm:rounded-tr-4xl rounded-br-2xl sm:rounded-br-4xl rounded-bl-2xl sm:rounded-bl-4xl flex items-center justify-center text-center px-4 sm:px-6 py-8 sm:py-0">
      <div className="text-white max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-5">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base lg:text-lg text-red-100 mb-6 sm:mb-8 leading-relaxed">
          {description}
        </p>

        {/* Button */}
        <button 
          className="bg-white text-red-800 font-medium px-8 sm:px-12 lg:px-20 py-2 sm:py-3 hover:bg-red-100 transition text-sm sm:text-base"
          onClick={buttonAction}
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
}