"use client";

export default function VideoSection({ videoData }) {
  const { videoUrl } = videoData || {};

  if (!videoUrl) {
    return null;
  }

  // Convert YouTube watch URLs to embed format + autoplay/mute/loop/no controls
  const getEmbedUrl = (url) => {
    let videoId;
    if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`;
    }

    // If already embed URL, append autoplay params
    return `${url}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0`;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section className="py-4 sm:py-12 lg:py-4 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
      

        <div
          className="relative w-full"
          style={{ paddingBottom: "56.25%" /* 16:9 aspect ratio */ }}
        >
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            src={embedUrl}
            title="Organization Video"
            frameBorder="0"
            allow="autoplay; fullscreen"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
  


