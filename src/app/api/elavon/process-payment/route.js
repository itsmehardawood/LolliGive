// API Route: Process Payment with Converge Token
// This takes a payment token from Converge and processes the actual charge

import { NextResponse } from 'next/server';

// Converge API Configuration
const DEMO_MODE = process.env.ELAVON_ENVIRONMENT === 'demo';

const CONVERGE_CONFIG = DEMO_MODE ? {
  apiUrl: 'https://api.demo.convergepay.com/VirtualMerchant/processxml.do',
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
  console.log('========== Processing Converge Payment with Token ==========');
  console.log('Environment:', DEMO_MODE ? 'DEMO' : 'PRODUCTION');
  
  try {
    const body = await request.json();
    const { token, amount, firstName, lastName, invoiceNumber, description, orgId } = body;

    // Validate required fields
    if (!token || !amount || !firstName || !invoiceNumber) {
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

    console.log('Processing payment for:', { invoiceNumber, amount, merchantId: CONVERGE_CONFIG.merchantId });

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

    // Prepare XML request for payment processing with token
    const xmlData = `<txn><ssl_merchant_id>${CONVERGE_CONFIG.merchantId}</ssl_merchant_id><ssl_user_id>${CONVERGE_CONFIG.userId}</ssl_user_id><ssl_pin>${CONVERGE_CONFIG.pin}</ssl_pin><ssl_transaction_type>ccsale</ssl_transaction_type><ssl_token>${escapeXml(token)}</ssl_token><ssl_amount>${parseFloat(amount).toFixed(2)}</ssl_amount><ssl_first_name>${escapeXml(firstName)}</ssl_first_name><ssl_last_name>${escapeXml(lastName || 'N/A')}</ssl_last_name><ssl_invoice_number>${escapeXml(invoiceNumber)}</ssl_invoice_number><ssl_description>${escapeXml(description || 'Donation')}</ssl_description><ssl_customer_code>${escapeXml(orgId)}</ssl_customer_code></txn>`;

    // URL encode the XML data
    const requestBody = `xmldata=${encodeURIComponent(xmlData)}`;

    console.log('Sending payment request to:', CONVERGE_CONFIG.apiUrl);

    // Call Converge API to process payment
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
    let txnId = null;
    let result = null;
    let resultMessage = null;
    let errorCode = null;
    let errorMessage = null;
    let approvalCode = null;

    // Simple XML parsing
    const txnIdMatch = responseText.match(/<ssl_txn_id>(.*?)<\/ssl_txn_id>/);
    const resultMatch = responseText.match(/<ssl_result>(.*?)<\/ssl_result>/);
    const resultMessageMatch = responseText.match(/<ssl_result_message>(.*?)<\/ssl_result_message>/);
    const errorCodeMatch = responseText.match(/<errorCode>(.*?)<\/errorCode>/);
    const errorMessageMatch = responseText.match(/<errorMessage>(.*?)<\/errorMessage>/);
    const approvalCodeMatch = responseText.match(/<ssl_approval_code>(.*?)<\/ssl_approval_code>/);

    if (txnIdMatch) txnId = txnIdMatch[1];
    if (resultMatch) result = resultMatch[1];
    if (resultMessageMatch) resultMessage = resultMessageMatch[1];
    if (errorCodeMatch) errorCode = errorCodeMatch[1];
    if (errorMessageMatch) errorMessage = errorMessageMatch[1];
    if (approvalCodeMatch) approvalCode = approvalCodeMatch[1];

    // Check for errors
    if (errorCode || errorMessage) {
      console.error('Converge Payment Error:', errorMessage || errorCode);
      return NextResponse.json(
        { 
          success: false, 
          message: errorMessage || `Error code: ${errorCode}`,
          errorCode 
        },
        { status: 400 }
      );
    }

    // Check result (0 = success in Converge)
    if (result === '0' && txnId) {
      console.log('Payment successful:', { txnId, approvalCode });
      return NextResponse.json({
        success: true,
        txnId,
        approvalCode,
        message: 'Payment processed successfully',
      });
    } else {
      console.error('Payment failed:', resultMessage || 'Unknown error');
      return NextResponse.json(
        { 
          success: false, 
          message: resultMessage || 'Payment failed',
          resultCode: result 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
