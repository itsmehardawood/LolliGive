// Test endpoint to verify Elavon credentials
import { NextResponse } from 'next/server';

const DEMO_MODE = process.env.ELAVON_ENVIRONMENT === 'demo';

export async function GET() {
  console.log('========== Testing Elavon Credentials ==========');
  
  const config = DEMO_MODE ? {
    environment: 'DEMO',
    merchantId: process.env.ELAVON_DEMO_MERCHANT_ID,
    userId: process.env.ELAVON_DEMO_USER_ID,
    pin: process.env.ELAVON_DEMO_PIN,
    apiUrl: 'https://api.demo.convergepay.com/hosted-payments/transaction_token'
  } : {
    environment: 'PRODUCTION',
    merchantId: process.env.ELAVON_MERCHANT_ID,
    userId: process.env.ELAVON_USER_ID,
    pin: process.env.ELAVON_PIN,
    apiUrl: 'https://api.convergepay.com/hosted-payments/transaction_token'
  };

  console.log('Environment:', config.environment);
  console.log('Merchant ID:', config.merchantId || 'MISSING');
  console.log('User ID:', config.userId || 'MISSING');
  console.log('PIN:', config.pin ? `${config.pin.substring(0, 10)}...` : 'MISSING');
  console.log('API URL:', config.apiUrl);

  // Check if all credentials are present
  const issues = [];
  
  if (!config.merchantId) issues.push('ELAVON_MERCHANT_ID is missing');
  if (!config.userId) issues.push('ELAVON_USER_ID is missing');
  if (!config.pin) issues.push('ELAVON_PIN is missing');

  if (issues.length > 0) {
    return NextResponse.json({
      status: 'error',
      message: 'Missing credentials',
      issues: issues,
      environment: config.environment,
      tip: 'Check your .env file and restart the server'
    }, { status: 500 });
  }

  // Test the credentials with Converge API
  try {
    const formData = new URLSearchParams({
      ssl_merchant_id: config.merchantId,
      ssl_user_id: config.userId,
      ssl_pin: config.pin,
      ssl_transaction_type: 'ccsale',
      ssl_amount: '1.00',
      ssl_test_mode: 'true' // Test mode flag
    });

    console.log('→ Testing credentials with Converge...');
    
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    console.log('← Response Status:', response.status);
    console.log('← Response:', responseText.substring(0, 300));

    if (response.status === 401) {
      return NextResponse.json({
        status: 'authentication_failed',
        message: '401 Unauthorized - Credentials rejected by Converge',
        details: responseText.substring(0, 500),
        possibleCauses: [
          '1. User ID does not have "Hosted Payment API User" permission',
          '2. Server IP address is not whitelisted with Elavon',
          '3. Credentials are for Virtual Merchant, not Converge API',
          '4. Wrong environment (production credentials with demo URL)'
        ],
        nextSteps: [
          'Contact Elavon Support: 1-800-377-3962 → Option 2 → Option 2',
          'Email: sedevportalsupport@elavon.com',
          'Request: Enable API access and whitelist your IP'
        ],
        credentials: {
          merchantId: config.merchantId,
          userId: config.userId,
          pinLength: config.pin.length,
          environment: config.environment
        }
      }, { status: 401 });
    }

    if (!response.ok) {
      return NextResponse.json({
        status: 'api_error',
        message: `Converge API returned ${response.status}`,
        response: responseText.substring(0, 500)
      }, { status: response.status });
    }

    // Parse response
    const params = new URLSearchParams(responseText);
    const result = params.get('ssl_result');
    const resultMessage = params.get('ssl_result_message');
    const token = params.get('ssl_token');

    return NextResponse.json({
      status: 'success',
      message: '✅ Credentials are valid!',
      environment: config.environment,
      convergeResponse: {
        result: result,
        message: resultMessage,
        hasToken: !!token
      },
      credentials: {
        merchantId: config.merchantId,
        userId: config.userId,
        pinLength: config.pin.length
      },
      nextSteps: [
        'Your credentials are working!',
        'You can now use the donation form.',
        'If donations still fail, check the detailed error messages.'
      ]
    });

  } catch (error) {
    console.error('✗ Test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Test failed',
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
