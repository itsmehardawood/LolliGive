// components/OrgFooter.js
export default function OrgFooter({ org }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className="py-8 px-4 bg-[var(--color-primary)] text-gray-200 border-t border-[#27272a]"
      style={{ backgroundColor: org.theme.primary }}
    >
      <div className="container mx-auto text-center">
        <p>© {currentYear} {org.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}