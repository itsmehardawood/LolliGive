'use client';

export default function OrganizationDisplay({ data, onEdit }) {
  const ImageDisplay = ({ src, alt, className = "w-full h-32" }) => (
    <div className={`border border-gray-700 rounded-lg overflow-hidden bg-gray-800 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
        Image not available
      </div>
    </div>
  );

  const VideoDisplay = ({ src, alt, className = "w-full h-32" }) => (
    <div className={`border border-gray-700 rounded-lg overflow-hidden bg-gray-800 ${className}`}>
      <video
        src={src}
        controls
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Video load error:', src);
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      >
        Your browser does not support the video tag.
      </video>
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-sm p-4" style={{display: 'none'}}>
        <p className="mb-2">Video not available</p>
        <p className="text-xs text-gray-600 break-all text-center">{src}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full sm:flex-1">
              <ImageDisplay 
                src={data.logo} 
                alt="Organization Logo" 
                className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0" 
              />
              <div className="flex-1 w-full">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 break-words">
                  {data.name}
                </h1>
                {data.alias && (
                  <p className="text-sm sm:text-base text-gray-400 mb-3">
                    Also known as: {data.alias}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-md text-xs sm:text-sm bg-green-500/10 text-green-400 border border-green-500/20">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Active
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">
                    ID: <span className="text-gray-400 font-mono break-all">{data.orgId}</span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onEdit}
              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main Image & Welcome */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            {data.isVideo ? (
              <VideoDisplay 
                src={data.mainImage} 
                alt="Main Organization Video" 
                className="w-full h-48 sm:h-56 md:h-64" 
              />
            ) : (
              <ImageDisplay 
                src={data.mainImage} 
                alt="Main Organization Image" 
                className="w-full h-48 sm:h-56 md:h-64" 
              />
            )}
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">Welcome</h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{data.welcomeText}</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 md:mb-8">
          {/* Testimony */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Testimony</h2>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-700">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed italic">{data.testimonyText}</p>
            </div>
          </div>

          {/* Donation Message */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center border border-green-500/30 flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white">Donation Message</h2>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-700">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{data.donationMessage}</p>
            </div>
          </div>

          {/* About Us */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30 flex-shrink-0">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-white">About Us</h2>
            </div>
            <ImageDisplay 
              src={data.aboutUsImage} 
              alt="About Us" 
              className="w-full h-28 sm:h-32 mb-4" 
            />
            <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-700">
              <p className="text-sm text-gray-300 leading-relaxed">{data.aboutUsText}</p>
            </div>
          </div>
        </div>

        {/* Video Section */}
        {data.videoUrl && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6 mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center border border-red-500/30">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">Media</h2>
            </div>
            <VideoDisplay 
              src={data.videoUrl} 
              alt="Organization Media Video" 
              className="w-full h-64 sm:h-80 md:h-96" 
            />
          </div>
        )}

        {/* Contact & Purpose */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 md:mb-8">
          {/* Contact Information */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Contact Information</h2>
            {data.contactInfo && data.contactInfo.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                {data.contactInfo.map((contact, index) => (
                  <div key={index} className="bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-700 space-y-2.5 sm:space-y-3">
                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-sm sm:text-base text-gray-300 break-words flex-1">{contact.address}</p>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <p className="text-sm sm:text-base text-gray-300">{contact.phone}</p>
                    </div>
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a 
                        href={`mailto:${contact.email}`} 
                        className="text-sm sm:text-base text-blue-400 hover:text-blue-300 transition-colors break-all"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Purpose & Reasons */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Purpose & Reasons</h2>
            {data.purpose_reason && data.purpose_reason.length > 0 && (
              <div className="space-y-2.5 sm:space-y-3">
                {data.purpose_reason.map((reason, index) => (
                  <div key={index} className="flex items-start gap-2.5 sm:gap-3 bg-gray-900/50 p-3 sm:p-4 rounded-lg border border-gray-700">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-semibold">{index + 1}</span>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300 flex-1">{reason}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-4 sm:pt-6 border-t border-gray-800">
          <p className="text-gray-500 text-xs sm:text-sm px-4">
            Last updated: {new Date(data.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}