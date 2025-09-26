import { NextResponse } from 'next/server';

// Mock API for development - replace with actual database/API call
const mockOrganizations = {
  'hope-church': {
    "orgId": "12345",
    "name": "Hope Community Church",
    "logo": "",
    "mainImage": "https://cdn.pixabay.com/photo/2024/06/21/11/15/ai-generated-8844184_1280.jpg",
    "welcomeText": "Welcome to Hope Community Church!",
    "testimonyText": "This community has transformed our lives.",
    "aboutUsText": "We are a faith-based organization serving our community.",
    "aboutUsImage": "https://cdn.pixabay.com/photo/2017/09/03/12/14/hand-2710098_1280.jpg",
    "donationMessage": "Support our mission to bring hope to families.",
    "videoUrl": "https://youtube.com/embed/abcd1234",
    "contactInfo": {
      "address": "123 Main St, Lahore",
      "phone": "+923001234567",
      "email": "info@hopechurch.org"
    },
    "purpose_reason": [
      "Charity work",
      "Education support", 
      "Community development"
    ],
    "updatedAt": "2025-09-25T10:30:00Z"
  },
"hope": {
  "orgId": "78910",
  "name": "Hope Foundation",
  "logo": "Hope",
  "mainImage": "https://cdn.pixabay.com/photo/2017/04/25/06/15/father-and-son-2258681_1280.jpg",
  "welcomeText": "Welcome to the Hope Foundation! We are a passionate community of changemakers dedicated to building a future where every individual has equal access to basic necessities, education, and opportunities to thrive.",
  "testimonyText": "At Hope Foundation, we believe that real progress begins with unity, compassion, and a shared vision. By working hand in hand with local communities, volunteers, and supporters worldwide, we are shaping a society where no one is left behind and where kindness paves the way for sustainable growth.",
  "aboutUsText": "Founded with the mission to uplift the underprivileged, Hope Foundation has been tirelessly working to bridge gaps in healthcare, education, and social welfare. Our programs focus on providing medical aid to families in need, offering scholarships to bright young students, and creating livelihood opportunities that empower individuals to become self-reliant. Beyond just support, we aim to inspire long-term change by nurturing dignity, resilience, and hope in every life we touch.",
  "aboutUsImage": "https://images.unsplash.com/photo-1576560665905-28b4d4ea3380?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "donationMessage": "Every contribution you make to the Hope Foundation becomes a stepping stone for someone’s brighter tomorrow. Your generous donations allow us to expand healthcare programs, send children to school, and provide relief during times of crisis. Together, we can transform despair into hope and build stronger communities for generations to come.",
  "videoUrl": "https://www.youtube.com/watch?v=RQu7jpcNUWI",
  "contactInfo": {
    "address": "12 Hope Street, LOS ANGELES, USA",
    "phone": "+1332342322",
    "email": "contact@hopefoundation.org"
  },
  "purpose_reason": [
    "Healthcare Assistance for vulnerable families and communities in need of urgent support.",
    "Educational Scholarships that enable children and young adults to pursue quality learning opportunities.",
    "Women Empowerment initiatives aimed at providing skills, resources, and confidence to lead independent lives.",
    "Disaster Relief programs that respond quickly to natural calamities and provide immediate humanitarian aid."
  ],
  "updatedAt": "2025-09-26T12:45:00Z"
}

};

export async function GET(request, { params }) {
  try {
    const { slug } = params;
    
    // In production, replace this with actual database/API call
    // const organizationData = await fetchOrganizationFromDatabase(slug);
    
    const organizationData = mockOrganizations[slug];
    
    if (!organizationData) {
      return NextResponse.json(
        { error: 'Organization not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(organizationData);
  } catch (error) {
    console.error('Error fetching organization data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Optional: Handle POST requests for updating organization data
export async function POST(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    
    // In production, implement organization data update logic
    // const updatedOrganization = await updateOrganizationInDatabase(slug, body);
    
    return NextResponse.json({ 
      message: 'Organization updated successfully',
      organization: body 
    });
  } catch (error) {
    console.error('Error updating organization data:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}