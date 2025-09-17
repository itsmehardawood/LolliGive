// components/Organization/OrgHelp.js
"use client";

import { Heart, Users, Calendar, Share2, CreditCard, Clock } from "lucide-react";

export default function OrgHelp({ org }) {
  const helpOptions = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Make a Donation",
      description: "Your financial contribution directly supports our programs and helps us reach more people in need.",
      features: [
        "One-time or monthly donations",
        "100% tax-deductible",
        "Direct impact tracking",
        "Secure payment processing"
      ],
      buttonText: "Donate Now",
      buttonStyle: "primary",
      popular: true
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Volunteer Your Time",
      description: "Join our team of dedicated volunteers and contribute your skills and time to make a direct impact.",
      features: [
        "Flexible scheduling",
        "Local and remote opportunities",
        "Skills-based volunteering",
        "Community events"
      ],
      buttonText: "Join as Volunteer",
      buttonStyle: "secondary"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Attend Events",
      description: "Participate in our fundraising events, awareness campaigns, and community gatherings.",
      features: [
        "Charity galas and dinners",
        "Awareness campaigns",
        "Community workshops",
        "Virtual events"
      ],
      buttonText: "View Events",
      buttonStyle: "secondary"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Spread the Word",
      description: "Help us reach more people by sharing our mission and stories with your network.",
      features: [
        "Social media sharing",
        "Word-of-mouth advocacy",
        "Corporate partnerships",
        "Community outreach"
      ],
      buttonText: "Share Our Mission",
      buttonStyle: "secondary"
    }
  ];

  const donationAmounts = [25, 50, 100, 250, 500, 1000];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="help" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How You Can <span style={{ color: org.theme.primary }}>Help</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            There are many ways to get involved and make a difference. Choose the option that works best for you and join our community of changemakers.
          </p>
        </div>

        {/* Help Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {helpOptions.map((option, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                option.popular ? 'border-yellow-400' : 'border-gray-100'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex items-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mr-4"
                  style={{ backgroundColor: org.theme.primary }}
                >
                  <div className="text-white">
                    {option.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{option.title}</h3>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{option.description}</p>

              <ul className="space-y-3 mb-8">
                {option.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <div 
                      className="w-2 h-2 rounded-full mr-3"
                      style={{ backgroundColor: org.theme.primary }}
                    ></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => {
                  if (option.title === "Make a Donation") {
                    scrollToSection('#donate');
                  }
                }}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  option.buttonStyle === 'primary'
                    ? 'text-white hover:opacity-90'
                    : 'border-2 hover:text-white'
                }`}
                style={{
                  backgroundColor: option.buttonStyle === 'primary' ? org.theme.primary : 'transparent',
                  borderColor: option.buttonStyle === 'secondary' ? org.theme.primary : 'transparent',
                  color: option.buttonStyle === 'secondary' ? org.theme.primary : 'white'
                }}
                onMouseEnter={(e) => {
                  if (option.buttonStyle === 'secondary') {
                    e.target.style.backgroundColor = org.theme.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.buttonStyle === 'secondary') {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = org.theme.primary;
                  }
                }}
              >
                {option.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Quick Donation Section */}
        <div 
          className="rounded-2xl p-8 text-white text-center"
          style={{ backgroundColor: org.theme.primary }}
        >
          <h3 className="text-2xl font-bold mb-4">Make a Quick Donation</h3>
          <p className="text-lg mb-8 opacity-90">
            Choose an amount below or click Donate Now for more options
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {donationAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => scrollToSection('#donate')}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                ${amount}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection('#donate')}
              className="flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              <CreditCard className="w-5 h-5" />
              Donate Custom Amount
            </button>
            <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-colors duration-200 border border-white/30">
              <Clock className="w-5 h-5" />
              Set Up Monthly Giving
            </button>
          </div>
        </div>

        {/* Impact Preview */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Your Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🍎</div>
              <div className="font-semibold text-gray-900 mb-2">$25</div>
              <div className="text-gray-600">Provides nutritious meals for a child for one week</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📚</div>
              <div className="font-semibold text-gray-900 mb-2">$100</div>
              <div className="text-gray-600">Supplies school materials for 10 students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🏥</div>
              <div className="font-semibold text-gray-900 mb-2">$500</div>
              <div className="text-gray-600">Funds medical care for an entire family</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}