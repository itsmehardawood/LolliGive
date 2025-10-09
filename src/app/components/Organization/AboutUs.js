"use client";

export default function AboutUs({ aboutData }) {
  const {
    title = "LolliGive",
    description = [
      "At LolliGive, we believe giving should be simple, secure, and meaningful. Our mission is to empower individuals, churches, and organizations to honor their faith and support their communities through seamless online giving. Whether it is tithes, offerings, fundraising, or charitable support, LolliGive makes it easy to contribute from anywhere, at any time.",
      "We provide a trusted platform where each church and organization has its own dedicated application space, giving them full control and transparency over their donations. Security is at the heart of everything we do — we use advanced encryption and industry-standard safeguards to protect all financial and banking information.",
      "Unlike other platforms, we charge no fees for registration. Our goal is not just to process payments but to strengthen communities of faith and service by removing barriers that stand in the way of generosity.",
      "With LolliGive, every gift matters. Together, we are building a future where giving is not limited by distance, complexity, or technology — but guided by faith, love, and trust."
    ],
    backgroundImage = "https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg"
  } = aboutData || {};

  return (
    <section className="min-h-[500px] grid grid-cols-1 lg:grid-cols-2 text-white">
      {/* Left side: Text with bg and image on small screens */}
      <div className="bg-red-800 flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg order-2 lg:order-1">
        {/* Image visible only on mobile/sm screens */}
        <div className="relative w-full h-48 mb-6 rounded-2xl p-2 sm:hidden bg-white ">
          <img
            src={backgroundImage}
            alt="About Us"
            className="object-contain rounded-lg w-full h-full"
          />
        </div>

        {description.map((paragraph, index) => (
          <div key={index}>
            <p className="text-sm sm:text-md lg:text-base leading-relaxed">
              {paragraph.replace("LolliGive", title)}
            </p>
            {index < description.length - 1 && <br />}
          </div>
        ))}
      </div>

      {/* Right side: Image visible only on large screens */}
      <div className="relative w-full h-full min-h-[500px] hidden lg:block order-1 lg:order-2">
        <img
          src={backgroundImage}
          alt="About Us"
          className="object-cover rounded-br-[120px] w-full h-full"
        />
      </div>
    </section>
  );
}
