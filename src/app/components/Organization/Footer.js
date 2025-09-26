"use client";
import Image from "next/image";

export default function Footer({ footerData }) {
  const {
    backgroundImage = "https://cdn.pixabay.com/photo/2023/10/23/17/25/hike-8336525_1280.jpg",
    organizationName = "LolliGive",
    sections = {
      connect: {
        title: "Connect",
        phone: "1-800-552-7972 (US)",
        email: "support@lolligive.com",
   
      },
      communityDevelopment: {
        title: "Community Development",
        links: [
          { text: "Peace & Justice", href: "#" },
          { text: "Community Health", href: "#" },
          { text: "Food Security", href: "#" },
          { text: "Economic Opportunity", href: "#" }
        ]
      },
      disasters: {
        title: "Disasters",
        links: [
          { text: "Disaster Response Services", href: "#" },
          { text: "International Disaster Response", href: "#" }
        ]
      },
      aboutUs: {
        title: "About Us",
        links: [
          { text: "Who We Are", href: "#" },
          { text: "Complaints", href: "#" },
          { text: "Affiliations", href: "#" },
          { text: "Careers", href: "#" },
          { text: "Policies and Standards", href: "#" },
          { text: "Contact", href: "#" }
        ]
      }
    },
    copyright = `© ${new Date().getFullYear()} LolliGive. All rights reserved.`,
    privacyPolicyLink = "#"
  } = footerData || {};

  return (
    <footer className="relative bg-gray-900 text-white min-h-[600px] lg:min-h-[500px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
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
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">{sections.connect.title}</h4>
            <div className="text-gray-400 py-3 sm:py-5 text-sm sm:text-base space-y-2">
              <p>Phone: {sections.connect.phone}</p>
              <p>Email: <a href={`mailto:${sections.connect.email}`} className="text-red-400 hover:text-red-300 break-all">{sections.connect.email}</a></p>
            </div>
            <div className="flex justify-center lg:justify-start gap-3 sm:gap-4 flex-wrap">
          
            </div>
          </div>

          {/* Community Development Section */}
          <div>
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">{sections.communityDevelopment.title}</h4>
            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
              {sections.communityDevelopment.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-red-400 transition">{link.text}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Disasters Section */}
          <div>
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">{sections.disasters.title}</h4>
            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
              {sections.disasters.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-red-400 transition">{link.text}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us Section */}
          <div>
            <h4 className="font-bold text-yellow-400 mb-4 text-lg sm:text-xl">{sections.aboutUs.title}</h4>
            <ul className="text-gray-400 space-y-2 text-sm sm:text-base">
              {sections.aboutUs.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-red-400 transition">{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom (Sticky to bottom) */}
      <div className="absolute bottom-0 w-full text-center bg-gray-900 py-4 sm:py-4 px-4">
        <p className="text-xs sm:text-sm text-gray-200">
          {copyright.replace('LolliGive', organizationName)} <a href={privacyPolicyLink} className="text-gray-300 hover:text-red-400 transition">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
}