// components/Organization/OrgAbout.js
"use client";

import { Target, Eye, Heart, Users } from "lucide-react";

export default function OrgAbout({ org }) {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Compassion",
      description: "We lead with empathy and understanding, putting the needs of those we serve at the heart of everything we do."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community",
      description: "Together we are stronger. We believe in the power of collective action and inclusive participation."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Impact",
      description: "We are committed to creating measurable, lasting change that transforms lives and communities."
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Transparency",
      description: "We operate with integrity and openness, ensuring accountability in all our actions and decisions."
    }
  ];

  return (
    <section id="about" className="py-10 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span style={{ color: org.theme.primary }}>{org.name}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our mission, vision, and the values that drive our commitment to making a positive impact in the world.
          </p>
        </div>

     

        {/* Values Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: org.theme.primary }}
                >
                  <div className="text-white">
                    {value.icon}
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </section>
  );
}