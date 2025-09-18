"use client";

export default function ServiceTimes({ serviceData }) {
  const {
    title = "Service Times",
    subtitle = "Join us for worship and fellowship. All are welcome!",
    services = [
      {
        name: "Sunday Morning Worship",
        time: "10:00 AM - 11:30 AM",
        description: "Join us for our main worship service with inspiring music and meaningful messages.",
        day: "Sunday"
      },
      {
        name: "Wednesday Bible Study",
        time: "7:00 PM - 8:30 PM", 
        description: "Dive deeper into God's word with our mid-week Bible study and prayer time.",
        day: "Wednesday"
      },
      {
        name: "Friday Youth Group",
        time: "6:00 PM - 8:00 PM",
        description: "Fun activities, games, and spiritual growth for our young people.",
        day: "Friday"
      }
    ],
    additionalInfo = "For special events and holiday service times, please contact us or check our announcements."
  } = serviceData || {};

  const getDayColor = (day) => {
    switch(day.toLowerCase()) {
      case 'sunday': return 'bg-red-100 text-red-800';
      case 'wednesday': return 'bg-blue-100 text-blue-800';
      case 'friday': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="py-5 px-4 sm:px-6 lg:px-8 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
            {title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl">
            {subtitle}
          </p>
        </div>

        {/* Service Times Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-red-800">{service.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDayColor(service.day)}`}>
                  {service.day}
                </span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <span className="text-lg mr-2">🕐</span>
                  <span className="font-semibold text-red-700">{service.time}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        {additionalInfo && (
          <div className="bg-red-50 border-l-4 border-red-800 p-6 rounded-r-lg">
            <div className="flex items-start">
              <span className="text-red-800 text-xl mr-3">ℹ️</span>
              <p className="text-red-800 font-medium">
                {additionalInfo}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}