// API Route: Generate Converge Session Token
// This creates a secure session token for Converge Hosted Payment Page

import { NextResponse } from 'next/server';

// Converge API Configuration
const DEMO_MODE = process.env.ELAVON_ENVIRONMENT === 'demo';

const CONVERGE_CONFIG = DEMO_MODE ? {
  apiUrl: 'https://api.demo.convergepay.com/VirtualMerchantDemo/processxml.do',
  merchantId: process.env.ELAVON_DEMO_MERCHANT_ID,
  userId: process.env.ELAVON_DEMO_USER_ID,
  pin: process.env.ELAVON_DEMO_PIN,
} : {
  apiUrl: 'https://api.convergepay.com/VirtualMerchant/processxml.do',
  merchantId: process.env.ELAVON_MERCHANT_ID,
  userId: process.env.ELAVON_USER_ID,
  pin: process.env.ELAVON_PIN,
};

export async function POST(request) {
  console.log('========== Generating Converge Session Token ==========');
  console.log('Environment:', DEMO_MODE ? 'DEMO' : 'PRODUCTION');
  
  try {
    const body = await request.json();
    const { amount, firstName, lastName, invoiceNumber, description, returnUrl } = body;

    // Validate required fields
    if (!amount || !firstName || !invoiceNumber || !returnUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate credentials
    if (!CONVERGE_CONFIG.merchantId || !CONVERGE_CONFIG.userId || !CONVERGE_CONFIG.pin) {
      console.error('Converge credentials not configured');
      return NextResponse.json(
        { success: false, message: 'Payment system not configured' },
        { status: 500 }
      );
    }

    console.log('Using Merchant ID:', CONVERGE_CONFIG.merchantId);
    console.log('Using User ID:', CONVERGE_CONFIG.userId);

    // Escape XML special characters
    const escapeXml = (str) => {
      if (!str) return '';
      return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    // Prepare XML request for Converge (simplified format without XML declaration)
    const xmlData = `<txn><ssl_merchant_id>${CONVERGE_CONFIG.merchantId}</ssl_merchant_id><ssl_user_id>${CONVERGE_CONFIG.userId}</ssl_user_id><ssl_pin>${CONVERGE_CONFIG.pin}</ssl_pin><ssl_transaction_type>ccgettoken</ssl_transaction_type><ssl_amount>${parseFloat(amount).toFixed(2)}</ssl_amount><ssl_first_name>${escapeXml(firstName)}</ssl_first_name><ssl_last_name>${escapeXml(lastName || 'N/A')}</ssl_last_name><ssl_invoice_number>${escapeXml(invoiceNumber)}</ssl_invoice_number><ssl_description>${escapeXml(description || 'Donation')}</ssl_description></txn>`;

    // URL encode the XML data
    const requestBody = `xmldata=${encodeURIComponent(xmlData)}`;

    console.log('Requesting session token from:', CONVERGE_CONFIG.apiUrl);
    console.log('XML Data (unencoded):', xmlData);
    console.log('Request Body (encoded):', requestBody.substring(0, 150) + '...');

    // Call Converge API to generate session token
    const response = await fetch(CONVERGE_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    });

    const responseText = await response.text();
    console.log('Converge API Response Status:', response.status);
    console.log('Converge API Response:', responseText);

    // Parse XML response
    let token = null;
    let txnId = null;
    let errorCode = null;
    let errorMessage = null;
    let resultMessage = null;

    // Simple XML parsing (you could use a library, but this works for simple cases)
    const tokenMatch = responseText.match(/<ssl_token>(.*?)<\/ssl_token>/);
    const txnIdMatch = responseText.match(/<ssl_txn_id>(.*?)<\/ssl_txn_id>/);
    const errorCodeMatch = responseText.match(/<errorCode>(.*?)<\/errorCode>/);
    const errorMessageMatch = responseText.match(/<errorMessage>(.*?)<\/errorMessage>/);
    const resultMessageMatch = responseText.match(/<ssl_result_message>(.*?)<\/ssl_result_message>/);

    if (tokenMatch) token = tokenMatch[1];
    if (txnIdMatch) txnId = txnIdMatch[1];
    if (errorCodeMatch) errorCode = errorCodeMatch[1];
    if (errorMessageMatch) errorMessage = errorMessageMatch[1];
    if (resultMessageMatch) resultMessage = resultMessageMatch[1];

    // Check for errors
    if (errorCode || errorMessage) {
      console.error('Converge API Error:', errorMessage || errorCode);
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage || `Error code: ${errorCode}`,
          errorCode 
        },
        { status: 400 }
      );
    }

    if (token) {
      // Success - return token and hosted payment URL with token embedded
      const paymentUrl = DEMO_MODE 
        ? `https://demo.convergepay.com/hosted-payments?ssl_txn_auth_token=${token}`
        : `https://www.convergepay.com/hosted-payments?ssl_txn_auth_token=${token}`;

      console.log('Session token generated successfully');
      console.log('Transaction ID:', txnId);
      console.log('Token:', token);
      console.log('Payment URL:', paymentUrl);
      
      return NextResponse.json({
        success: true,
        token,
        txnId,
        paymentUrl,
        hostedPaymentUrl: paymentUrl, // Keep for backward compatibility
        returnUrl,
      });
    } else {
      // Error from Converge
      console.error('Converge API Error:', resultMessage || 'No token returned');
      return NextResponse.json(
        { 
          success: false, 
          message: resultMessage || 'Failed to generate payment session - no token returned',
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error generating session token:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
