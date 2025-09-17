// components/Organization/OrgNews.js
"use client";

import { Calendar, MapPin, Clock, ArrowRight, Tag } from "lucide-react";

export default function OrgNews({ org }) {
  const newsArticles = [
    {
      id: 1,
      title: "New Educational Center Opens in Rural Guatemala",
      excerpt: "We're excited to announce the opening of our latest educational facility, which will serve over 500 children in the region.",
      date: "2024-03-15",
      category: "Education",
      image: "/images/hero.jpg",
      readTime: "3 min read"
    },
    {
      id: 2,
      title: "Emergency Response: Supporting Flood Victims",
      excerpt: "Our rapid response team has deployed to assist families affected by recent flooding, providing immediate relief and long-term support.",
      date: "2024-03-10",
      category: "Emergency",
      image: "/images/hero.jpg",
      readTime: "5 min read"
    },
    {
      id: 3,
      title: "Annual Impact Report 2023 Released",
      excerpt: "Discover how your support helped us reach over 1 million people worldwide in 2023 with our comprehensive impact report.",
      date: "2024-03-05",
      category: "Report",
      image: "/images/hero.jpg",
      readTime: "7 min read"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Annual Charity Gala 2024",
      description: "Join us for an evening of inspiration, entertainment, and fundraising to support our global initiatives.",
      date: "2024-05-20",
      time: "7:00 PM",
      location: "Grand Ballroom, City Center",
      type: "Fundraising",
      price: "$150 per person"
    },
    {
      id: 2,
      title: "Volunteer Training Workshop",
      description: "Learn about our programs and how you can make a meaningful impact as a volunteer in your community.",
      date: "2024-04-15",
      time: "10:00 AM",
      location: "Community Center",
      type: "Training",
      price: "Free"
    },
    {
      id: 3,
      title: "Children's Day Celebration",
      description: "A special event celebrating the children we serve worldwide, featuring stories, performances, and activities.",
      date: "2024-06-01",
      time: "2:00 PM",
      location: "Central Park Pavilion",
      type: "Community",
      price: "Free"
    }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <section id="news" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            News & <span style={{ color: org.theme.primary }}>Events</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with our latest news, upcoming events, and the impact we are making together around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Latest News */}
          <div>
            <div className="flex items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mr-4">Latest News</h3>
              <div 
                className="w-12 h-0.5"
                style={{ backgroundColor: org.theme.primary }}
              ></div>
            </div>

            <div className="space-y-6">
              {newsArticles.map((article) => (
                <article 
                  key={article.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-4 mb-3">
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: org.theme.primary }}
                        >
                          {article.category}
                        </span>
                        <span className="text-sm text-gray-500">{article.readTime}</span>
                      </div>
                      
                      <h4 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {article.title}
                      </h4>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(article.date)}
                        </div>
                        <button 
                          className="flex items-center text-sm font-semibold hover:underline transition-colors duration-200"
                          style={{ color: org.theme.primary }}
                        >
                          Read More
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-8">
              <button 
                className="px-6 py-3 border-2 font-semibold rounded-lg hover:text-white transition-colors duration-200"
                style={{ 
                  borderColor: org.theme.primary, 
                  color: org.theme.primary 
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = org.theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = org.theme.primary;
                }}
              >
                View All News
              </button>
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mr-4">Upcoming Events</h3>
              <div 
                className="w-12 h-0.5"
                style={{ backgroundColor: org.theme.primary }}
              ></div>
            </div>

            <div className="space-y-6">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4"
                  style={{ borderLeftColor: org.theme.primary }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white mb-3 inline-block"
                        style={{ backgroundColor: org.theme.primary }}
                      >
                        {event.type}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {new Date(event.date).getDate()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      {event.price}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button 
                      className="w-full py-2 px-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity duration-200"
                      style={{ backgroundColor: org.theme.primary }}
                    >
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button 
                className="px-6 py-3 border-2 font-semibold rounded-lg hover:text-white transition-colors duration-200"
                style={{ 
                  borderColor: org.theme.primary, 
                  color: org.theme.primary 
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = org.theme.primary;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = org.theme.primary;
                }}
              >
                View All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}