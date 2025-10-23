// File: app/api/elavon/payment-url/route.js

import { NextResponse } from 'next/server';

// Determine environment
const ENVIRONMENT = process.env.ELAVON_ENVIRONMENT || 'demo';
const isDemo = ENVIRONMENT === 'demo';

console.log('Payment URL - Current Environment:', ENVIRONMENT);
console.log('Payment URL - Using Demo Mode:', isDemo);

// Environment-specific configuration
const ELAVON_CONFIG = isDemo ? {
  merchantId: process.env.ELAVON_DEMO_MERCHANT_ID || 'demo',
  userId: process.env.ELAVON_DEMO_USER_ID || 'demo',
  pin: process.env.ELAVON_DEMO_PIN || 'demo',
  hostedUrl: process.env.ELAVON_DEMO_HOSTED_URL || 'https://demo.myvirtualmerchant.com/VirtualMerchant/process.do',
} : {
  merchantId: process.env.ELAVON_MERCHANT_ID,
  userId: process.env.ELAVON_USER_ID,
  pin: process.env.ELAVON_PIN,
  hostedUrl: process.env.ELAVON_PRODUCTION_HOSTED_URL || 'https://www.myvirtualmerchant.com/VirtualMerchant/process.do',
};

export async function POST(request) {
  console.log('========== Generating Elavon Payment URL ==========');
  
  try {
    const body = await request.json();
    const { amount, name, purpose, comment, orgId, invoiceNumber } = body;

    // Validate
    if (!amount || !name || !orgId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check credentials
    if (!ELAVON_CONFIG.merchantId || !ELAVON_CONFIG.userId || !ELAVON_CONFIG.pin) {
      console.error('Elavon credentials not configured');
      return NextResponse.json(
        { success: false, message: 'Payment system not configured' },
        { status: 500 }
      );
    }

    console.log('Credentials configured:', {
      merchantId: ELAVON_CONFIG.merchantId,
      userId: ELAVON_CONFIG.userId,
      pin: '***HIDDEN***'
    });

    const description = `${purpose} - ${comment || 'Donation'}`;

    // Return credentials and data to frontend (will be used in form POST)
    return NextResponse.json({
      success: true,
      hostedUrl: ELAVON_CONFIG.hostedUrl,
      formData: {
        ssl_merchant_id: ELAVON_CONFIG.merchantId,
        ssl_user_id: ELAVON_CONFIG.userId,
        ssl_pin: ELAVON_CONFIG.pin,
        ssl_transaction_type: 'ccsale',
        ssl_amount: parseFloat(amount).toFixed(2),
        ssl_first_name: name.split(' ')[0] || name,
        ssl_last_name: name.split(' ').slice(1).join(' ') || '',
        ssl_invoice_number: invoiceNumber,
        ssl_description: description,
        ssl_customer_code: orgId,
        ssl_show_form: 'true'
      }
    });

  } catch (error) {
    console.error('Error generating payment URL:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}