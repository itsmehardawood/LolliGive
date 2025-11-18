import React from 'react';
import Hero from '../Organization/Hero';
import VideoHero from '../Organization/VideoHero';
import RedSection from '../Organization/RedSection';
import ContactSection from '../Organization/ContactUs';
import AboutUs from '../Organization/AboutUs';
import DonationSection from '../Organization/DonationSection';
import Footer from '../Organization/Footer';
import Navbar from '../Organization/Navbar';
import VideoSection from './VideoSection';
import DonationSectionHPP from './DonationSectionHPP';

export default function OrganizationLanding({ organizationData, organizationSlug, orgId }) {
  // Extract organization-specific data
  const {
    organizationName = "Organization",
    isVideo = false, // Flag to determine Hero or VideoHero
    heroData = {},
    welcomeData = {},
    aboutData = {},
    serviceTimesData = {},
    contactData = {},
    donationData = {},
    preachingData = {},
    footerData = {},
    navbarData = {},
    videoData = {},
  } = organizationData || {};



  const SectionHeader = ({ title }) => (
    <div className="flex items-start mb-8 sm:mb-12">
      <div className="h-0.5 w-20 bg-red-900 mr-4"></div>
      <h2 className="text-md sm:text-lg font-bold text-red-800">
        {title}
      </h2>
    </div>
  );

  return (
    <div className="relative">
      {/* Main content wrapper */}
      <div className="relative z-10 bg-white">
        {/* Navigation */}
        <nav className="bg-white sticky top-0 z-50 shadow-sm">
          <Navbar navbarData={navbarData} organizationSlug={organizationSlug} />
        </nav>

        {/* Hero Section */}
        <section id="home" className={isVideo ? "bg-white" : "py-2 sm:py-12 lg:py-0 lg:pb-10 md:pb-20 pt-5 px-4 sm:px-6 lg:px-8 bg-white"}>
          <div className={isVideo ? "w-full" : "w-full mx-auto max-w-7xl lg:max-w-screen-2xl"}>
            {isVideo ? (
              <VideoHero heroData={heroData} />
            ) : (
              <Hero heroData={heroData} />
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <RedSection welcomeData={welcomeData} />
        </section>

      

        {/* About Us Section */}
        <section id="about-us" className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="ABOUT US" />
            <AboutUs aboutData={aboutData} />
          </div>
        </section>

      
                {/* Donation Section */}


  <section id="donate" className="py-8 sm:py-12 lg:py-5 bg-black  px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <DonationSection donationData={donationData} organizationSlug={organizationSlug} orgId={orgId} />
        
        {/* <DonationSectionHPP donationData={donationData} organizationSlug={organizationSlug} orgId={orgId} /> */}
          </div>
        </section>

        <section id="video" className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">   
          <div className="max-w-7xl mx-auto">
          <SectionHeader title="WATCH OUR STORY" />
            <VideoSection videoData={videoData} />
          </div>
        </section>  


        {/* Contact Section */}
        <section id="contact" className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="REACH OUT TO US" />
            <ContactSection contactData={contactData} />
          </div>
        </section>

      

     
      </div>

      {/* Fixed Footer at the bottom */}
      <div className="sticky bottom-0 z-0">
        <Footer footerData={footerData} />
      </div>
    </div>
  );
}