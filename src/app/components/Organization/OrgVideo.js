// components/OrgVideo.js
export default function OrgVideo({ videoUrl }) {
  return (
    <div className="bg-[#18181b] p-4 rounded-lg border border-[#27272a]">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Our Story</h2>
      <div className="aspect-video max-w-4xl mx-auto">
        <iframe
          src={videoUrl}
          className="w-full h-full rounded-lg bg-black"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Organization video"
        />
      </div>
    </div>
  );
}