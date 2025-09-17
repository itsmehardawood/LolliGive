// components/OrgVideo.jsx
"use client";

export default function OrgVideo({ videoUrl }) {
  return (
    <section className="relative bg-gradient-to-br  py-12 px-4 rounded-2xl  text-black">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold  mb-3">
          Our Story
        </h2>
        <p className="text-base md:text-lg max-w-2xl mx-auto mb-8">
          Discover the heart of our mission — hear directly from our community,
          churches, and partners about the impact we’re making together.
        </p>

        {/* Video Embed */}
        <div className="aspect-video rounded-xl overflow-hidden shadow-2xl border">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Organization story video"
          />
        </div>
      </div>
    </section>
  );
}
