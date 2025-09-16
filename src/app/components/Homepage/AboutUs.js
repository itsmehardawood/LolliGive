// "use client";
// import Image from "next/image";

// export default function AboutUs() {
//   return (
//     <section className="min-h-[500px] grid grid-cols-1 lg:grid-cols-2 text-white">
//       {/* Left side: Text with responsive padding and rounded corners */}
//       <div className="bg-red-800 flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 rounded-bl-none sm:rounded-bl-4xl shadow-lg order-2 lg:order-1">
//         <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
//           About Us
//         </h2>
//         <p className="text-sm sm:text-md lg:text-base leading-relaxed">
//           At <strong>LolliGive</strong>, we believe giving should be simple,
//           secure, and meaningful. Our mission is to empower individuals,
//           churches, and organizations to honor their faith and support their
//           communities through seamless online giving. Whether it's tithes,
//           offerings, fundraising, or charitable support, LolliGive makes it easy
//           to contribute from anywhere, at any time.
//         </p>
//         <br />

//         <p className="text-sm sm:text-md lg:text-base leading-relaxed">
//           We provide a trusted platform where{" "}
//           <strong>
//             each church and organization has its own dedicated application space
//           </strong>
//           , giving them full control and transparency over their donations.
//           Security is at the heart of everything we do — we use advanced
//           encryption and industry-standard safeguards to protect all financial
//           and banking information.
//         </p>
//         <br />

//         <p className="text-sm sm:text-md lg:text-base leading-relaxed">
//           Unlike other platforms,{" "}
//           <strong>we charge no fees for registration</strong>. Our goal is not
//           just to process payments but to{" "}
//           <strong>strengthen communities of faith and service</strong> by
//           removing barriers that stand in the way of generosity.
//         </p>
//         <br />

//         <p className="text-sm sm:text-md lg:text-base leading-relaxed">
//           With LolliGive, every gift matters. Together, we are building a future
//           where giving is not limited by distance, complexity, or technology —
//           but guided by faith, love, and trust.
//         </p>
//       </div>

//       {/* Right side: Image with responsive height */}
//       <div className="relative w-full h-full min-h-[500px] order-1 lg:order-2">
//         <Image
//           src="https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg"
//           alt="About Us"
//           fill
//           className="object-cover"
//         />
//       </div>
//     </section>
//   );
// }




"use client";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section className="min-h-[500px] grid grid-cols-1 lg:grid-cols-2 text-white">
      {/* Left side: Text with bg and image on small screens */}
      <div className="bg-red-800 flex flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 rounded-bl-none sm:rounded-bl-4xl shadow-lg order-2 lg:order-1">
        {/* Image visible only on mobile/sm screens */}
        <div className="relative w-full h-48 mb-6 sm:hidden">
          <Image
            src="https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg"
            alt="About Us"
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4">
          About Us
        </h2>
        <p className="text-sm sm:text-md lg:text-base leading-relaxed">
          At <strong>LolliGive</strong>, we believe giving should be simple,
          secure, and meaningful. Our mission is to empower individuals,
          churches, and organizations to honor their faith and support their
          communities through seamless online giving. Whether it is tithes,
          offerings, fundraising, or charitable support, LolliGive makes it easy
          to contribute from anywhere, at any time.
        </p>
        <br />

        <p className="text-sm sm:text-md lg:text-base leading-relaxed">
          We provide a trusted platform where{" "}
          <strong>
            each church and organization has its own dedicated application space
          </strong>
          , giving them full control and transparency over their donations.
          Security is at the heart of everything we do — we use advanced
          encryption and industry-standard safeguards to protect all financial
          and banking information.
        </p>
        <br />

        <p className="text-sm sm:text-md lg:text-base leading-relaxed">
          Unlike other platforms,{" "}
          <strong>we charge no fees for registration</strong>. Our goal is not
          just to process payments but to{" "}
          <strong>strengthen communities of faith and service</strong> by
          removing barriers that stand in the way of generosity.
        </p>
        <br />

        <p className="text-sm sm:text-md lg:text-base leading-relaxed">
          With LolliGive, every gift matters. Together, we are building a future
          where giving is not limited by distance, complexity, or technology —
          but guided by faith, love, and trust.
        </p>
      </div>

      {/* Right side: Image visible only on large screens */}
      <div className="relative w-full h-full min-h-[500px] hidden lg:block order-1 lg:order-2">
        <Image
          src="https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg"
          alt="About Us"
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
