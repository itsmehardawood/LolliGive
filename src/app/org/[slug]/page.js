// app/org/[slug]/page.js (updated)
import { notFound } from 'next/navigation';
import OrgHeader from '@/app/components/Organization/OrgHeader';
import OrgFooter from '@/app/components/Organization/OrgFooter';
import OrgVideo from '@/app/components/Organization/OrgVideo';
import OrgContact from '@/app/components/Organization/OrgContact';
import LoadingSpinner from '@/app/components/Organization/LoadingSpinner';
import DonationForm from '@/app/components/Organization/DonationForm';  
// This would typically come from your database
const mockOrganizations = {
  apple: {
    name: 'Apple Inc.',
    logo: '/images/apple-logo.png',
    description: 'Innovative technology company creating revolutionary products.',
    videoUrl: 'https://www.youtube.com/embed/5nL2h3gWpA4',
    contact: {
      email: 'contact@apple.com',
      phone: '+1-800-MY-APPLE',
      address: 'One Apple Park Way, Cupertino, CA 95014'
    },
    theme: {
      primary: '#ffffff',
      secondary: '#A2AAAD'
    },
    showDonationForm: true // New property to control donation form visibility
  },
  vivo: {
    name: 'Vivo Communications',
    logo: '/images/vivo-logo.png',
    description: 'Leading smartphone brand focused on camera and music technology.',
    videoUrl: 'https://www.youtube.com/embed/5nL2h3gWpA4',
    contact: {
      email: 'support@vivo.com',
      phone: '+1-888-VIVO-123',
      address: 'No. 611, Huangpu Avenue, Guangzhou, China'
    },
    theme: {
      primary: '#3C60AB',
      secondary: '#FFFFFF'
    },
    showDonationForm: true // This organization doesn't show donation form
  }
};

// ... (generateMetadata function remains the same)

export default function OrgPage({ params }) {
  const { slug } = params;
  const org = mockOrganizations[slug];
  
  if (!org) {
    notFound();
  }
  
  return (
    <div className="min-h-screen flex flex-col" 
         style={{ 
           '--color-primary': org.theme.primary,
           '--color-secondary': org.theme.secondary
         }}>
      <OrgHeader org={org} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center">Welcome to {org.name}</h1>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto">
            {org.description}
          </p>
        </section>
        
        <section className="mb-12">
          <OrgVideo videoUrl={org.videoUrl} />
        </section>
        
        {/* Conditionally render donation form */}
        {org.showDonationForm && (
          <section className="mb-12">
            <DonationForm orgName={org.name} />
          </section>
        )}
        
        <section>
          <OrgContact contact={org.contact} />
        </section>
      </main>
      
      <OrgFooter org={org} />
    </div>
  );
}

// ... (generateStaticParams function remains the same)