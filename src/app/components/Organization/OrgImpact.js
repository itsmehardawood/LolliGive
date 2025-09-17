// components/Organization/OrgImpact.js
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote, MapPin, Calendar } from "lucide-react";

export default function OrgImpact({ org }) {
  const [currentStory, setCurrentStory] = useState(0);

  const impactStats = [
    { number: "1,000,000+", label: "Lives Impacted", icon: "👥" },
    { number: "50+", label: "Countries Served", icon: "🌍" },
    { number: "25", label: "Years of Service", icon: "⏰" },
    { number: "500+", label: "Local Partners", icon: "🤝" },
    { number: "$10M+", label: "Funds Distributed", icon: "💰" },
    { number: "10,000+", label: "Volunteers", icon: "❤️" }
  ];

  const successStories = [
    {
      name: "Maria Santos",
      location: "Guatemala",
      date: "2024",
      image: "/images/hero.jpg",
      story: "Through our education program, Maria was able to complete her nursing degree and now serves her community as a healthcare provider. She has helped deliver over 200 babies and provides essential medical care to remote villages.",
      impact: "Now helping 500+ families annually",
      category: "Education"
    },
    {
      name: "Ahmed Hassan",
      location: "Sudan",
      date: "2023",
      image: "/images/hero.jpg",
      story: "After losing his home in a flood, Ahmed and his family received emergency shelter and support. With our help, he learned new farming techniques and now leads a cooperative that feeds his entire village.",
      impact: "Feeding 300+ people daily",
      category: "Emergency Response"
    },
    {
      name: "Sarah Chen",
      location: "Philippines",
      date: "2024",
      image: "/images/hero.jpg",
      story: "Sarah's village lacked clean water for decades. Our water initiative brought fresh, safe drinking water to her community, dramatically reducing illness and giving children more time to attend school.",
      impact: "Clean water for 2,000+ people",
      category: "Infrastructure"
    },
    {
      name: "David Okafor",
      location: "Nigeria",
      date: "2023",
      image: "/images/hero.jpg",
      story: "Through our micro-finance program, David started a small business selling solar panels. His success has brought electricity to dozens of homes and created jobs for five other community members.",
      impact: "Powering 50+ homes",
      category: "Economic Development"
    }
  ];

  const nextStory = () => {
    setCurrentStory((prev) => (prev + 1) % successStories.length);
  };

  const prevStory = () => {
    setCurrentStory((prev) => (prev - 1 + successStories.length) % successStories.length);
  };

  return (
    <section id="impact" className="py-5 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our <span style={{ color: org.theme.primary }}>Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the real difference we are making in communities around the world through the stories of those whose lives have been transformed.
          </p>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-20">
          {impactStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div 
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: org.theme.primary }}
              >
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

  

     
      </div>
    </section>
  );
}