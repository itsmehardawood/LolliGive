// components/Organization/OrgPrograms.js
"use client";

import { BookOpen, Heart, Home, Globe, Utensils, Stethoscope } from "lucide-react";

export default function OrgPrograms({ org }) {
  const programs = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Education Initiative",
      description: "Providing quality education and learning opportunities to underserved communities, ensuring every child has access to knowledge and skills for a brighter future.",
      image: "/images/hero.jpg",
      impact: "50,000+ students supported",
      category: "Education"
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Healthcare Access",
      description: "Delivering essential medical care and health services to remote and disadvantaged areas, focusing on preventive care and emergency response.",
      image: "/images/hero.jpg",
      impact: "200,000+ patients treated",
      category: "Healthcare"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Nutrition Program",
      description: "Fighting hunger and malnutrition through food assistance, nutritional education, and sustainable agriculture programs in vulnerable communities.",
      image: "/images/hero.jpg",
      impact: "1M+ meals provided",
      category: "Nutrition"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Shelter & Housing",
      description: "Building safe, affordable housing and providing emergency shelter for families in crisis, creating stable foundations for community growth.",
      image: "/images/hero.jpg",
      impact: "5,000+ families housed",
      category: "Housing"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community Support",
      description: "Strengthening communities through social programs, mental health support, and capacity building initiatives that empower local leadership.",
      image: "/images/hero.jpg",
      impact: "100+ communities served",
      category: "Community"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Emergency Response",
      description: "Rapid disaster relief and emergency assistance during natural disasters, conflicts, and humanitarian crises worldwide.",
      image: "/images/hero.jpg",
      impact: "50+ crisis responses",
      category: "Emergency"
    }
  ];

  return (
    <section id="programs" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span style={{ color: org.theme.primary }}>Programs</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Through our comprehensive programs, we address the most pressing challenges facing communities worldwide, creating sustainable solutions that transform lives.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
            >
              {/* Program Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: org.theme.primary }}
                  >
                    {program.category}
                  </span>
                </div>
                <div 
                  className="absolute bottom-4 left-4 w-12 h-12 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: org.theme.primary }}
                >
                  {program.icon}
                </div>
              </div>

              {/* Program Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{program.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{program.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-green-600">{program.impact}</span>
                  <button 
                    className="text-sm font-semibold hover:underline transition-colors duration-200"
                    style={{ color: org.theme.primary }}
                  >
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div 
          className="rounded-2xl p-12 text-center text-white"
          style={{ backgroundColor: org.theme.primary }}
        >
          <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join us in our mission to create positive change around the world. Every contribution, no matter the size, helps us expand our reach and impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Get Involved
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-200">
              Support Our Work
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}