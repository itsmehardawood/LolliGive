// components/OrgHeader.js
export default function OrgHeader({ org }) {
  return (
    <header
      className="py-6 px-4 bg-[var(--color-primary)] text-gray-800 border-b border-[#27272a]"
      style={{ backgroundColor: org.theme.primary }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* In a real app, you'd use next/image for optimized images */}
          <img
            src={org.logo}
            alt={`${org.name} logo`}
            className="h-12 w-auto mr-4"
          />
          <h2 className="text-2xl font-semibold text-">{org.name}</h2>
        </div>
      </div>
    </header>
  );
}