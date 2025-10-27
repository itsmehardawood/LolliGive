// API Route: Elavon Hosted Payments Page (HPP) Session Token Generation
// This creates a session token and returns the HPP URL for redirect

import { NextResponse } from 'next/server';

// Environment configuration
const DEMO_MODE = process.env.ELAVON_ENVIRONMENT === 'demo';

const CONVERGE_CONFIG = DEMO_MODE ? {
  // Demo/UAT Environment
  apiUrl: 'https://api.demo.convergepay.com/hosted-payments/transaction_token',
  hppUrl: 'https://api.demo.convergepay.com/hosted-payments',
  merchantId: process.env.ELAVON_DEMO_MERCHANT_ID,
  userId: process.env.ELAVON_DEMO_USER_ID,
  pin: process.env.ELAVON_DEMO_PIN,
} : {
  // Production Environment
  apiUrl: 'https://api.convergepay.com/hosted-payments/transaction_token',
  hppUrl: 'https://api.convergepay.com/hosted-payments',
  merchantId: process.env.ELAVON_MERCHANT_ID,
  userId: process.env.ELAVON_USER_ID,
  pin: process.env.ELAVON_PIN,
};

export async function POST(request) {
  console.log('========== HPP Session Token Request ==========');
  console.log('Environment:', DEMO_MODE ? 'DEMO' : 'PRODUCTION');
  
  try {
    const body = await request.json();
    const { 
      amount, 
      firstName, 
      lastName, 
      email, 
      description, 
      invoiceNumber, 
      returnUrl,
      orgId 
    } = body;

    // Validate required fields
    if (!amount || !firstName || !email || !invoiceNumber || !returnUrl) {
      console.error('✗ Missing required fields');
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: amount, firstName, email, invoiceNumber, returnUrl' 
        },
        { status: 400 }
      );
    }

    // Validate credentials
    if (!CONVERGE_CONFIG.merchantId || !CONVERGE_CONFIG.userId || !CONVERGE_CONFIG.pin) {
      console.error('✗ Converge credentials not configured');
      console.error('Required env vars:', {
        merchantId: !!CONVERGE_CONFIG.merchantId,
        userId: !!CONVERGE_CONFIG.userId,
        pin: !!CONVERGE_CONFIG.pin
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment gateway not configured. Please contact support.' 
        },
        { status: 500 }
      );
    }

    console.log('→ Request details:', {
      amount,
      firstName,
      lastName,
      email,
      invoiceNumber,
      orgId
    });

    console.log('→ Using credentials:', {
      merchantId: CONVERGE_CONFIG.merchantId,
      userId: CONVERGE_CONFIG.userId,
      pin: CONVERGE_CONFIG.pin ? `${CONVERGE_CONFIG.pin.substring(0, 10)}...` : 'MISSING',
      apiUrl: CONVERGE_CONFIG.apiUrl
    });

    // Prepare form data for session token request
    const formData = new URLSearchParams({
      ssl_merchant_id: CONVERGE_CONFIG.merchantId,
      ssl_user_id: CONVERGE_CONFIG.userId,
      ssl_pin: CONVERGE_CONFIG.pin,
      ssl_transaction_type: 'ccsale', // Credit card sale
      ssl_amount: parseFloat(amount).toFixed(2),
      ssl_first_name: firstName,
      ssl_last_name: lastName || 'Donor',
      ssl_email: email,
      ssl_invoice_number: invoiceNumber,
      ssl_description: description || 'Donation',
      ssl_customer_code: orgId || 'GUEST',
      // Return URL configuration
      ssl_receipt_link_method: 'REDG', // Redirect GET method
      ssl_receipt_link_url: returnUrl,
      // Additional HPP settings
      ssl_result_format: 'HTML',
      ssl_show_form: 'true', // Show the payment form on HPP
    });

    console.log('→ Requesting session token from:', CONVERGE_CONFIG.apiUrl);
    console.log('→ Merchant ID:', CONVERGE_CONFIG.merchantId);
    console.log('→ User ID:', CONVERGE_CONFIG.userId);

    // Request session token from Converge
    const response = await fetch(CONVERGE_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const responseText = await response.text();
    console.log('← Response Status:', response.status);
    console.log('← Response Body:', responseText.substring(0, 500));

    if (!response.ok) {
      console.error('✗ API request failed:', response.status, response.statusText);
      console.error('✗ Response body:', responseText);
      
      // Parse error response if it's URL-encoded
      const errorParams = new URLSearchParams(responseText);
      const errorMessage = errorParams.get('errorMessage') || 
                          errorParams.get('ssl_result_message') || 
                          responseText.substring(0, 200);
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Authentication failed: ${errorMessage}. Please verify: 1) User ID has "Hosted Payment API User" status, 2) Server IP is whitelisted, 3) Credentials are correct for Converge API (not Virtual Merchant)`
        },
        { status: 500 }
      );
    }

    // Parse the response
    // Converge returns URL-encoded response like: ssl_result=0&ssl_token=xyz&ssl_txn_id=123
    const params = new URLSearchParams(responseText);
    const result = params.get('ssl_result');
    const token = params.get('ssl_token');
    const txnId = params.get('ssl_txn_id');
    const resultMessage = params.get('ssl_result_message');
    const errorCode = params.get('errorCode');
    const errorMessage = params.get('errorMessage');

    console.log('← Parsed response:', {
      result,
      token: token ? `${token.substring(0, 20)}...` : null,
      txnId,
      resultMessage,
      errorCode,
      errorMessage
    });

    // Check for errors
    if (result !== '0' || errorCode || errorMessage) {
      const error = errorMessage || resultMessage || 'Failed to create payment session';
      console.error('✗ Payment session error:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: error,
          errorCode: errorCode || result
        },
        { status: 400 }
      );
    }

    if (!token) {
      console.error('✗ No token received from Converge');
      return NextResponse.json(
        { 
          success: false, 
          error: 'No session token received from payment gateway' 
        },
        { status: 500 }
      );
    }

    // Build the HPP URL with the session token
    const hostedPaymentUrl = `${CONVERGE_CONFIG.hppUrl}?ssl_txn_auth_token=${token}`;

    console.log('✓ Session token created successfully');
    console.log('✓ Transaction ID:', txnId);
    console.log('✓ HPP URL:', hostedPaymentUrl.substring(0, 100) + '...');

    return NextResponse.json({
      success: true,
      token: token,
      txnId: txnId,
      hostedPaymentUrl: hostedPaymentUrl,
      paymentUrl: hostedPaymentUrl, // Alias for compatibility
      returnUrl: returnUrl,
      demo: DEMO_MODE
    });

  } catch (error) {
    console.error('✗ HPP session token error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to create payment session' 
      },
      { status: 500 }
    );
  }
}
