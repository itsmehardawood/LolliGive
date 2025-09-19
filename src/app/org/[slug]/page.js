"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import OrganizationLanding from '../../components/Organization/OrganizationLanding';
import Link from 'next/link';

export default function OrganizationPage() {
  const params = useParams();
  const slug = params.slug;
  const [organizationData, setOrganizationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock function to fetch organization data
  // In a real application, this would fetch from your API/database
  const fetchOrganizationData = async (organizationSlug) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock organization data - replace with actual API call
      const mockData = {
        organizationName: organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1),
        heroData: {
          backgroundImage: "https://cdn.pixabay.com/photo/2024/06/21/11/15/ai-generated-8844184_1280.jpg",
          title: `Welcome to ${organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1)} - Making a difference in our community through faith and giving.`,
          buttonText: "DONATE NOW",
          buttonAction: () => {
            // Smooth scroll to donation section
            const element = document.querySelector('#donate');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        },
        welcomeData: {
          title: "You are Welcome",
          description: `We are excited for your visit and exploring more about ${organizationSlug}. Together, we can make a lasting impact on our community through your generous support.`,
          buttonText: "Learn More",
          buttonAction: () => {
            document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
          }
        },
        aboutData: {
          title: organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1),
          description: [
            `At ${organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1)}, we believe in the power of community and the importance of giving back. Our mission is to create positive change through various programs and initiatives that support those in need.`,
            "We provide a trusted platform where our community can come together to support meaningful causes. Every contribution helps us expand our reach and impact more lives.",
            "Our commitment to transparency means that every dollar donated is used effectively to further our mission and help those who need it most.",
            "Join us in making a difference. Together, we can build a stronger, more compassionate community for everyone."
          ],
          backgroundImage: "https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg"
        },
        contactData: {
          title: "Contact Us",
          subtitle: "Have any questions? We'd love to hear from you and help in any way we can.",
          contactImage: "https://cdn.pixabay.com/photo/2015/11/07/08/49/hand-1030565_1280.jpg",
          contactInfo: {
            address: "123 Community Street, Your City, State 12345",
            phone: "+1 (555) 123-4567",
            email: `info@${organizationSlug}.org`
          },
          formAction: (formData) => {
            console.log('Contact form submitted:', formData);
            alert('Thank you for your message! We will get back to you soon.');
          }
        },
        navbarData: {
          logo: "LolliGive",
          organizationName: organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1),
          menuItems: [
            { label: "Home", href: "#home" },
            { label: "About", href: "#about-us" },
            { label: "Service Times", href: "#service-times" },
            { label: "Contact", href: "#contact" },
            { label: "Ministry", href: "#ministry" }
          ],
          donateButton: {
            text: "Donate Now",
            action: () => {
              // Smooth scroll to donation section
              const element = document.querySelector('#donate');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }
        },
        serviceTimesData: {
          title: "Service Times",
          subtitle: "Join us for worship and fellowship. All are welcome!",
          services: [
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
          additionalInfo: "For special events and holiday service times, please contact us or check our announcements."
        },
        donationData: {
          title: `Support ${organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1)}`,
          subtitle: "Your generous donation helps us continue our important work in the community and spread God's love.",
          backgroundImage: "https://cdn.pixabay.com/photo/2017/08/06/12/52/money-2590776_1280.jpg",
          suggestedAmounts: [25, 50, 100, 250, 500],
          donationReasons: [
            { value: "general", label: "General Donation" },
            { value: "tithe", label: "Tithe" },
            { value: "offering", label: "Offering" },
            { value: "building_fund", label: "Building Fund" },
            { value: "missions", label: "Missions" },
            { value: "youth_ministry", label: "Youth Ministry" },
            { value: "community_outreach", label: "Community Outreach" },
            { value: "emergency_relief", label: "Emergency Relief" }
          ]
        },
        preachingData: {
          title: `${organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1)} Ministry`,
          subtitle: "Spreading God's word through powerful preaching and community outreach",
          currentSeries: {
            title: "Walking in Faith",
            description: "Join us as we explore what it means to live a life of faith in today's world. This series will inspire and challenge you to grow deeper in your relationship with God.",
            image: "https://cdn.pixabay.com/photo/2017/01/31/13/14/bible-2023558_1280.jpg",
            duration: "6 Weeks"
          },
          upcomingEvents: [
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
          ]
        },
    
        faqData: {
          faqs: [
            {
              question: `What is ${organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1)}?`,
              answer: `${organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1)} is a community-focused organization dedicated to making a positive impact through various programs and initiatives that support those in need.`
            },
            {
              question: "How can I donate?",
              answer: "You can donate securely through our online platform. Simply click the 'Donate Now' button and choose your preferred donation method."
            },
            {
              question: "Are donations tax-deductible?",
              answer: "Yes, donations to our organization are tax-deductible. You will receive a receipt for your records after making a donation."
            },
            {
              question: "How do you use the donations?",
              answer: "All donations go directly to funding our programs and services. We maintain complete transparency in how funds are used and regularly report on our impact."
            },
            {
              question: "Can I volunteer?",
              answer: "Absolutely! We welcome volunteers and have various opportunities available. Please contact us to learn more about how you can get involved."
            }
          ]
        },
        footerData: {
          organizationName: organizationSlug.charAt(0).toUpperCase() + organizationSlug.slice(1),
          sections: {
            connect: {
              title: "Connect",
              phone: "+1 (555) 123-4567",
              email: `info@${organizationSlug}.org`,
              socialLinks: [
                { icon: "FaFacebook", href: "#" },
                { icon: "FaTwitter", href: "#" },
                { icon: "FaInstagram", href: "#" }
              ]
            },
            communityDevelopment: {
              title: "Our Programs",
              links: [
                { text: "Community Outreach", href: "#" },
                { text: "Educational Support", href: "#" },
                { text: "Youth Development", href: "#" },
                { text: "Emergency Relief", href: "#" }
              ]
            },
            disasters: {
              title: "Support",
              links: [
                { text: "How to Donate", href: "#" },
                { text: "Volunteer", href: "#" },
                { text: "Partner with Us", href: "#" }
              ]
            },
            aboutUs: {
              title: "About",
              links: [
                { text: "Our Mission", href: "#" },
                { text: "Our Team", href: "#" },
                { text: "Annual Reports", href: "#" },
                { text: "Contact Us", href: "#" }
              ]
            }
          }
        }
      };
      
      return mockData;
    } catch (err) {
      throw new Error('Failed to fetch organization data');
    }
  };

  useEffect(() => {
    const loadOrganizationData = async () => {
      try {
        setLoading(true);
        const data = await fetchOrganizationData(slug);
        setOrganizationData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadOrganizationData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Organization Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link 
            href="/" 
            className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <OrganizationLanding 
      organizationData={organizationData} 
      organizationSlug={slug}
    />
  );
}
