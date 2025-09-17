// app/org/[slug]/page.js (updated)
import { notFound } from 'next/navigation';
import OrgHeader from '@/app/components/Organization/OrgHeader';
import OrgFooter from '@/app/components/Organization/OrgFooter';
import OrgHero from '@/app/components/Organization/OrgHero';
import OrgAbout from '@/app/components/Organization/OrgAbout';
import OrgPrograms from '@/app/components/Organization/OrgPrograms';
import OrgVideo from '@/app/components/Organization/OrgVideo';
import OrgImpact from '@/app/components/Organization/OrgImpact';
import OrgHelp from '@/app/components/Organization/OrgHelp';
import OrgNews from '@/app/components/Organization/OrgNews';
import OrgContact from '@/app/components/Organization/OrgContact';
import LoadingSpinner from '@/app/components/Organization/LoadingSpinner';
import DonationForm from '@/app/components/Organization/DonationForm';  
// This would typically come from your database


const mockOrganizations = {
  apple: {
    name: 'Apple Inc.',
    logo: '/images/apple-logo.png',
    description: 'A global technology leader that designs, develops, and sells consumer electronics, computer software, and online services. Known for iPhone, Mac, and its strong ecosystem of services.',
videoUrl: 'https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4',
    contact: {
      email: 'contact@apple.com',
      phone: '+1-800-MY-APPLE',
      address: 'One Apple Park Way, Cupertino, CA 95014, USA'
    },
    theme: {
      primary: '#ffffff',
      secondary: '#A2AAAD'
    },
    showDonationForm: false
  },
  vivo: {
    name: 'Vivo Communications',
    logo: '/images/vivo-logo.png',
    description: 'A leading global smartphone manufacturer with a focus on mobile photography and audio innovation, making technology accessible worldwide.',
videoUrl: 'https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4',
    contact: {
      email: 'support@vivo.com',
      phone: '+1-888-VIVO-123',
      address: 'No. 611, Huangpu Avenue, Guangzhou, China'
    },
    theme: {
      primary: '#3C60AB',
      secondary: '#FFFFFF'
    },
    showDonationForm: false
  },
  redCross: {
    name: 'International Red Cross',
    logo: '/images/redcross-logo.png',
    description: 'A humanitarian NGO providing emergency assistance, disaster relief, and education across the globe, dedicated to protecting human life and dignity.',
videoUrl: 'https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4',
    contact: {
      email: 'info@icrc.org',
      phone: '+41-22-734-6001',
      address: '19 Avenue de la Paix, 1202 Geneva, Switzerland'
    },
    theme: {
      primary: '#ED1B2E',
      secondary: '#FFFFFF'
    },
    showDonationForm: true
  },
  unicef: {
    name: 'UNICEF',
    logo: '/images/unicef-logo.png',
    description: `The United Nations Children’s Fund (UNICEF) is a global organization committed to safeguarding the rights and well-being of every child, regardless of their background, circumstance, or location. Established in 1946 in the aftermath of World War II, UNICEF began its journey by providing emergency food and healthcare to children in devastated regions. Since then, it has grown into one of the world’s most influential humanitarian and development organizations, working tirelessly across more than 190 countries and territories. Its mission is rooted in a simple but powerful principle: every child deserves the chance to survive, thrive, and realize their full potential.  

UNICEF’s work spans a wide range of areas that directly impact the lives of children and families. These include health, nutrition, education, protection from violence and exploitation, and emergency response. By focusing on these fundamental needs, the organization strives not only to address immediate challenges but also to create long-term systems of support and resilience. For example, through its vaccination campaigns, UNICEF has helped save millions of young lives from preventable diseases such as polio and measles. In addition, it works to ensure expectant mothers have access to essential care, giving children a stronger start in life.  

Education is another cornerstone of UNICEF’s efforts. Millions of children around the world are deprived of the chance to go to school due to poverty, conflict, or discrimination. UNICEF partners with governments, NGOs, and local communities to expand access to quality education, especially for girls and marginalized groups. Education is more than just literacy and numeracy; it empowers children to shape their futures, break cycles of poverty, and contribute positively to their societies.  

In times of crisis, UNICEF is often among the first organizations on the ground. Whether responding to natural disasters, armed conflicts, or public health emergencies, UNICEF provides life-saving assistance such as clean water, nutrition, shelter, and psychosocial support. Beyond meeting urgent needs, it advocates for the protection of children in conflict zones, ensuring that their rights are not forgotten amid chaos and upheaval.  

What makes UNICEF’s work unique is its global reach combined with local impact. While it operates worldwide, its strength lies in the partnerships it forms with local communities, governments, and organizations. This collaborative approach ensures that solutions are sustainable and culturally appropriate. Furthermore, UNICEF’s commitment to transparency, accountability, and evidence-based practices means that resources are used effectively to maximize impact.  

At its heart, UNICEF is not just about providing aid; it is about creating opportunities for children to flourish. It envisions a world where every child has access to healthcare, education, protection, and a safe environment. Its programs emphasize equity, aiming to reach the most disadvantaged and vulnerable populations first.  

For nearly eight decades, UNICEF has stood as a symbol of hope for children everywhere. Its tireless advocacy and programs remind the world that investing in children is not just a moral responsibility but also a foundation for sustainable development and a brighter, more peaceful future. Through its unwavering dedication, UNICEF continues to give voice to the voiceless and ensures that children remain at the center of global development efforts.`,
    
videoUrl: 'https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4',
    contact: {
      email: 'info@unicef.org',
      phone: '+1-212-326-7000',
      address: '3 United Nations Plaza, New York, NY 10017, USA'
    },
    theme: {
      primary: '#1CABE2',
      secondary: '#FFFFFF'
    },
    showDonationForm: true
  },
  edhi: {
    name: 'Edhi Foundation',
    logo: '/images/edhi-logo.png',
    description: 'Pakistan’s largest non-profit social welfare organization providing ambulance services, orphanages, hospitals, and free aid for the underprivileged.',
videoUrl: 'https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4',
    contact: {
      email: 'info@edhi.org',
      phone: '+92-21-32413232',
      address: 'Sarafa Bazar, Mithadar, Karachi, Pakistan'
    },
    theme: {
      primary: '#0C4A6E',
      secondary: '#F9FAFB'
    },
    showDonationForm: true
  },
  salvationArmy: {
    name: 'The Salvation Army',
    logo: '/images/salvationarmy-logo.png',
    description: 'An international Christian church and charitable organization focused on poverty alleviation, disaster relief, rehabilitation, and community services.',
videoUrl: 'https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4',
    contact: {
      email: 'info@salvationarmy.org',
      phone: '+44-20-7367-4800',
      address: '101 Queen Victoria Street, London, EC4P 4EP, United Kingdom'
    },
    theme: {
      primary: '#D71A28',
      secondary: '#FFFFFF'
    },
    showDonationForm: true
  },
  hillsong: {
    name: 'Hillsong Church',
    logo: '/images/hillsong-logo.png',
    description: 'A global Christian megachurch known for its worship music, community support programs, and strong focus on faith-based services.',
videoUrl: 'https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4',
    contact: {
      email: 'info@hillsong.com',
      phone: '+61-2-8853-5300',
      address: '1-9 Solent Circuit, Baulkham Hills, NSW 2153, Australia'
    },
    theme: {
      primary: '#1E293B',
      secondary: '#E2E8F0'
    },
    showDonationForm: true
  }
};


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
      
      {/* Hero Section */}
      <OrgHero org={org} />
      
      {/* About Us Section */}
      <OrgAbout org={org} />
  
      
      {/* Video Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <OrgVideo videoUrl={org.videoUrl} />
        </div>
      </section>
      
      {/* Impact Section */}
      <OrgImpact org={org} />
      

      {/* Donation Form Section */}
      {org.showDonationForm && (
        <section id="donate" className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Support <span style={{ color: org.theme.primary }}>{org.name}</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your generous donation helps us continue our mission and expand our reach to help more people in need.
              </p>
            </div>
            <DonationForm orgName={org.name} />
          </div>
        </section>
      )}
      
      {/* Contact Section */}
      <OrgContact contact={org.contact} org={org} />
      
      <OrgFooter org={org} />
    </div>
  );
}

