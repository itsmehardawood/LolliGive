// import { NextResponse } from 'next/server';

// // ⚠️ TEMPORARY MOCK - This needs to be replaced with actual Elavon API integration
// // We need the Elavon API documentation to implement the real session creation

// export async function POST(request) {
//   try {
//     const { amount, currency, orderId } = await request.json();

//     console.log('Creating Elavon payment session:', { amount, currency, orderId });
//     console.log('⚠️ WARNING: Using mock session - implement real Elavon API call');

//     // TODO: Replace this with actual Elavon API call
//     // The Elavon documentation should specify:
//     // 1. The correct API endpoint for creating payment sessions
//     // 2. The required request format (JSON, XML, form-encoded, etc.)
//     // 3. The authentication method (API keys, credentials, etc.)
//     // 4. The response format and session ID field name

//     // For now, return a mock session ID to test the frontend
//     const mockSessionId = `mock-session-${Date.now()}-${Math.random().toString(36).substring(7)}`;

//     console.log('⚠️ Returning MOCK session ID:', mockSessionId);
//     console.log('❌ This will NOT work with real Elavon Hosted Fields');
//     console.log('📚 Please provide Elavon API documentation for payment session creation');

//     return NextResponse.json({
//       success: true,
//       sessionId: mockSessionId,
//       _warning: 'This is a mock session ID - implement real Elavon API integration',
//     });

//   } catch (error) {
//     console.error('Error in create-session endpoint:', error);
//     return NextResponse.json(
//       {
//         success: false,
//         error: error.message || 'Failed to create payment session',
//       },
//       { status: 500 }
//     );
//   }
// }



// app/api/elavon/create-session/route.js
import { NextResponse } from 'next/server';

// TEMPORARY: Always return mock session for testing
// Set to false once you have real Elavon credentials
const FORCE_DEMO = false;

// Environment variables
const DEMO_MODE = process.env.DEMO_MODE === 'true' || FORCE_DEMO;
const ELAVON_API_URL = process.env.ELAVON_API_URL || 'https://api.convergepay.com/hosted-payments';
const ELAVON_MERCHANT_ID = process.env.ELAVON_MERCHANT_ID;
const ELAVON_ACCOUNT_ID = process.env.ELAVON_ACCOUNT_ID;
const ELAVON_API_KEY = process.env.ELAVON_API_KEY;

export async function POST(request) {
  try {
    console.log('═══════════════════════════════════════');
    console.log('🔷 Elavon Create Session API Called');
    console.log('═══════════════════════════════════════');

    const body = await request.json();
    const { amount, currency, orderId, shopperEmailAddress, description } = body;

    console.log('📥 Request data:', { amount, currency, orderId, shopperEmailAddress });
    console.log('🔧 Environment:', {
      DEMO_MODE,
      FORCE_DEMO,
      hasMerchantId: !!ELAVON_MERCHANT_ID,
      hasApiKey: !!ELAVON_API_KEY,
      apiUrl: ELAVON_API_URL
    });

    // DEMO MODE - Return mock session immediately
    if (DEMO_MODE || FORCE_DEMO) {
      console.log('🧪 Running in DEMO mode');
      const mockSessionId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      
      console.log('✅ Mock session created:', mockSessionId);
      console.log('═══════════════════════════════════════\n');
      
      return NextResponse.json({
        success: true,
        sessionId: mockSessionId,
        demo: true,
        message: 'Demo mode - no real transaction will occur'
      });
    }

    // PRODUCTION MODE - Real Elavon API call
    console.log('🔴 Production mode - attempting real API call');

    // Validate credentials
    if (!ELAVON_MERCHANT_ID || !ELAVON_API_KEY) {
      console.error('❌ Missing Elavon credentials!');
      console.error('   ELAVON_MERCHANT_ID:', ELAVON_MERCHANT_ID ? '✓ Set' : '✗ Missing');
      console.error('   ELAVON_API_KEY:', ELAVON_API_KEY ? '✓ Set' : '✗ Missing');
      
      return NextResponse.json(
        { 
          error: 'Payment gateway not configured',
          details: 'Missing ELAVON_MERCHANT_ID or ELAVON_API_KEY in environment variables'
        },
        { status: 500 }
      );
    }

    const originUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                      (request.headers.get('origin') || 'http://localhost:3000');

    console.log('🌐 Origin URL:', originUrl);

    // Prepare session data for Elavon API
    const sessionData = {
      merchant: ELAVON_MERCHANT_ID,
      account: ELAVON_ACCOUNT_ID || ELAVON_MERCHANT_ID,
      amount: {
        total: parseFloat(amount),
        currency: currency || 'USD'
      },
      orderId: orderId,
      hppType: 'hostedPaymentFields',
      originUrl: originUrl,
      doCreateTransaction: true,
      shopperEmailAddress: shopperEmailAddress,
      transactionType: 'sale',
      description: description || 'Donation'
    };

    console.log('📤 Sending to Elavon:', JSON.stringify(sessionData, null, 2));

    const apiResponse = await fetch(`${ELAVON_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ELAVON_API_KEY}`
      },
      body: JSON.stringify(sessionData)
    });

    console.log('📨 Elavon response status:', apiResponse.status);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error('❌ Elavon API error:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Failed to create payment session',
          statusCode: apiResponse.status,
          details: errorText
        },
        { status: 500 }
      );
    }

    const responseData = await apiResponse.json();
    console.log('✅ Session created successfully:', responseData.id);
    console.log('═══════════════════════════════════════\n');

    return NextResponse.json({
      success: true,
      sessionId: responseData.id,
      expiresAt: responseData.expiresAt
    });

  } catch (error) {
    console.error('═══════════════════════════════════════');
    console.error('❌ CRITICAL ERROR in create-session API');
    console.error('═══════════════════════════════════════');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('═══════════════════════════════════════\n');

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint for debugging
export async function GET() {
  return NextResponse.json({
    status: 'API route is working',
    demoMode: DEMO_MODE,
    timestamp: new Date().toISOString(),
    env: {
      hasMerchantId: !!ELAVON_MERCHANT_ID,
      hasApiKey: !!ELAVON_API_KEY,
      apiUrl: ELAVON_API_URL
    }
  });
}