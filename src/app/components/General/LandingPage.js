import React from 'react';
import Navbar from '../Homepage/Navbar';
import Hero from '../Homepage/Hero';
import RedSection from '../Homepage/RedSection';
import Card from '../Homepage/Card';
import ContactSection from '../Homepage/ContactUs';
import AboutUs from '../Homepage/AboutUs';
import FAQSection from '../Homepage/FAQsSection';
import Footer from '../Homepage/Footer';

export default function LolliGiveLanding() {
const cards = [
  {
    image: "https://cdn.pixabay.com/photo/2020/07/15/03/49/praying-5406270_1280.jpg",
    title: "Church & Ministries",
    description:
      "Churches and ministries play a vital role in building stronger communities by providing spiritual guidance, organizing outreach programs, and supporting individuals in times of need. Donations to these organizations help fund essential services such as food drives, educational programs, counseling, and community events that uplift and inspire. By contributing, you directly empower ministries to expand their impact and bring hope to more people.",
  },
  {
    image: "https://cdn.pixabay.com/photo/2017/04/30/16/18/pretzel-2273216_1280.jpg",
    title: "Non-Profit Organizations",
    description:
      "Non-profit organizations are dedicated to creating meaningful change by addressing pressing issues such as poverty, education, healthcare, environmental protection, and human rights. Contributions to these organizations ensure they have the resources to continue their missions—whether it's providing meals for the hungry, scholarships for students, or medical aid for the underserved. Supporting non-profits means joining a larger movement toward building a fairer and more compassionate world.",
  },
  {
    image: "https://cdn.pixabay.com/photo/2018/07/15/15/47/kids-3539885_1280.jpg",
    title: "Government Donation | Support",
    description:
      "Government-supported initiatives often focus on large-scale projects such as disaster relief, education, healthcare, and social welfare programs. Your donations contribute directly to strengthening public services and ensuring that essential resources reach communities in need. From supporting children's education to rebuilding after natural disasters, these contributions create a positive impact on society by enhancing stability, security, and opportunities for everyone.",
  },
];

  return (
    <div className="relative">
      {/* Main content wrapper */}
      <div className="relative z-10 bg-white ">
        {/* Navigation */}
        <nav className="bg-white sticky top-0 z-50 shadow-sm">
          <Navbar/>
        </nav>

        {/* Hero Section */}
        <section className="py-8 sm:py-12 lg:py-16 md:pb-20 pt-5 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="lg:max-w-7xl w-full mx-auto">
            <Hero/>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <RedSection/>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-4">
                FEATURED ORGANIZATIONS
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  image={card.image}
                  title={card.title}
                  description={card.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="testimonials" className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <ContactSection/>
        </section>

        {/* About Us Section */}
        <section id="about-us"  className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-8xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-4">
                ABOUT US
              </h2>
            </div>
            <AboutUs/>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-800 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            <FAQSection/>
          </div>
        </section>
      </div>

      {/* Fixed Footer at the bottom */}
      <div className="sticky bottom-0 z-0">
        <Footer />
      </div>
    </div>
  );
}




