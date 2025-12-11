"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import OrganizationLanding from '../../components/Organization/OrganizationLanding';
import Link from 'next/link';

export default function OrganizationPage() {
  const params = useParams();
  const slug = params.slug;
  const [organizationData, setOrganizationData] = useState(null);
  const [orgId, setOrgId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch organization data from API
  const fetchOrganizationData = async (organizationSlug) => {
    try {
      // Make API call to fetch organization data
      const response = await fetch(`/api/organizations/${organizationSlug}`);
      
      if (!response.ok) {
        throw new Error('Organization not found');
      }
      
      const apiData = await response.json();
      
      // Store orgId for donation functionality
      setOrgId(apiData.orgId);
      
      // Map API response to component data structure
      const mappedData = {
        organizationName: apiData.name,
        isVideo: apiData.isVideo || false, // Flag to determine if hero uses video or image
        heroData: {
          backgroundImage: apiData.mainImage || "https://cdn.pixabay.com/photo/2024/06/21/11/15/ai-generated-8844184_1280.jpg",
          backgroundVideo: apiData.mainImage || "", // Will be video URL when isVideo is true
          title: `Welcome to ${apiData.name} - Making a difference in our community through faith and giving.`,
          buttonText: "GIVE | DONATE NOW",
          buttonAction: () => {
            const element = document.querySelector('#donate');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
        },
        welcomeData: {
          title: "You are Welcome",
          description: apiData.welcomeText || `We are excited for your visit and exploring more about ${apiData.name}. Together, we can make a lasting impact on our community through your generous support.`,
          buttonText: "Learn More",
          buttonAction: () => {
            document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
          }
        },
        aboutData: {
          title: apiData.name,
          description: [
            apiData.aboutUsText || `At ${apiData.name}, we believe in the power of community and the importance of giving back. Our mission is to create positive change through various programs and initiatives that support those in need.`,
            apiData.testimonyText || "We provide a trusted platform where our community can come together to support meaningful causes. Every contribution helps us expand our reach and impact more lives."
          ],
          backgroundImage: apiData.aboutUsImage || "https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg"
        },
        contactData: {
          title: "Contact Us",
          subtitle: "Have any questions? We'd love to hear from you and help in any way we can.",
          contactImage: "https://cdn.pixabay.com/photo/2015/11/07/08/49/hand-1030565_1280.jpg",
          contactInfo: {
            address: (apiData.contactInfo && apiData.contactInfo.length > 0) ? 
              apiData.contactInfo[0].address : "123 Community Street, Your City, State 12345",
            phone: (apiData.contactInfo && apiData.contactInfo.length > 0) ? 
              apiData.contactInfo[0].phone : "+1 (555) 123-4567",
            email: (apiData.contactInfo && apiData.contactInfo.length > 0) ? 
              apiData.contactInfo[0].email : `info@${organizationSlug}.org`
          },
          formAction: (formData) => {
            // console.log('Contact form submitted:', formData);
            alert('Thank you for your message! We will get back to you soon.');
          }
        },
        videoData: {
          videoUrl: apiData.videoUrl || null
        },
        navbarData: {
          logo: apiData.logo || "LolliGive",
          organizationName: apiData.name,
          menuItems: [
            { label: "Home", href: "#home" },
            { label: "About", href: "#about-us" },
            { label: "Contact", href: "#contact" },
            { label: "Ministry | Groups", href: "#about-us" }
          ],
          donateButton: {
            text: "Donate Now",
            action: () => {
              const element = document.querySelector('#donate');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          }
        },
        donationData: {
          title: `Give to ${apiData.name}`,
          subtitle: apiData.donationMessage || "Your generous donation helps us continue our important work in the community and spread God's love.",
          backgroundImage: "https://cdn.pixabay.com/photo/2017/08/06/12/52/money-2590776_1280.jpg",
          suggestedAmounts: [25, 50, 100, 250, 500],
          donationReasons: apiData.purpose_reason ? 
            apiData.purpose_reason.map(reason => ({
              value: reason.toLowerCase().replace(/\s+/g, '_'),
              label: reason
            })) : 
            [
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
        footerData: {
          organizationName: apiData.name,
          sections: {
            connect: {
              title: "Connect",
              phone: (apiData.contactInfo && apiData.contactInfo.length > 0) ? 
                apiData.contactInfo[0].phone : "+1 (555) 123-4567",
              email: (apiData.contactInfo && apiData.contactInfo.length > 0) ? 
                apiData.contactInfo[0].email : `info@${organizationSlug}.org`,
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
      
      return mappedData;
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
      orgId={orgId}
    />
  );
}
