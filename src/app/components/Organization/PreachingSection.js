"use client";
import Image from "next/image";

export default function PreachingSection({ preachingData }) {
  const {
    title = "Our Ministry",
    subtitle = "Spreading God's word through powerful preaching and community outreach",
    currentSeries = {
      title: "Walking in Faith",
      description: "Join us as we explore what it means to live a life of faith in today's world. This series will inspire and challenge you to grow deeper in your relationship with God.",
      image: "https://cdn.pixabay.com/photo/2017/01/31/13/14/bible-2023558_1280.jpg",
      duration: "6 Weeks"
    },
    upcomingEvents = [
      {
        title: "Special Revival Service",
        date: "Next Sunday",
        time: "6:00 PM",
        description: "Join us for a special evening of worship and revival."
      },
      {
        title: "Community Outreach",
        date: "This Saturday",
        time: "9:00 AM",
        description: "Help us serve our community with food distribution and prayer."
      }
    ],
    gallery = [
      "https://cdn.pixabay.com/photo/2017/01/31/13/14/bible-2023558_1280.jpg",
      "https://cdn.pixabay.com/photo/2020/07/15/03/49/praying-5406270_1280.jpg",
      "https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg",
      "https://cdn.pixabay.com/photo/2015/11/07/08/49/hand-1030565_1280.jpg"
    ]
  } = preachingData || {};

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Current Series */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <Image
                src={currentSeries.image}
                alt={currentSeries.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 bg-red-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                {currentSeries.duration}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-red-800 mb-3">
                Current Series: {currentSeries.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentSeries.description}
              </p>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-red-800 mb-6">Upcoming Events</h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-l-4 border-red-800 pl-4 py-2">
                  <h4 className="font-semibold text-gray-800">{event.title}</h4>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="mr-4">📅 {event.date}</span>
                    <span>🕐 {event.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-red-800 mb-6 text-center">Ministry Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((image, index) => (
              <div key={index} className="relative h-40 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <Image
                  src={image}
                  alt={`Ministry image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-red-800 rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Join Us This Week</h3>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Experience the power of worship, fellowship, and God's word. Everyone is welcome in our church family.
          </p>
          <button className="bg-white text-red-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Plan Your Visit
          </button>
        </div>
      </div>
    </section>
  );
}