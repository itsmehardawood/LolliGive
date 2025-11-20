import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount } = await request.json();

    // Get credentials from environment variables
    const ssl_account_id = process.env.ELAVON_SSL_ACCOUNT_ID;
    const ssl_user_id = process.env.ELAVON_SSL_USER_ID;
    const ssl_pin = process.env.ELAVON_SSL_PIN;

    // Check if credentials exist
    if (!ssl_account_id || !ssl_user_id || !ssl_pin) {
      console.error('Missing payment gateway credentials:', {
        ssl_account_id: !!ssl_account_id,
        ssl_user_id: !!ssl_user_id,
        ssl_pin: !!ssl_pin,
      });
      return NextResponse.json(
        { error: 'Payment gateway credentials not configured' },
        { status: 500 }
      );
    }

    // Prepare the request body
    const amountString = parseFloat(amount).toFixed(2);

    const requestBody = new URLSearchParams({
      ssl_account_id,
      ssl_user_id,
      ssl_pin,
      ssl_transaction_type: 'ccsale',
      ssl_amount: amountString,
      ssl_get_token: 'Y'
    });

    console.log('Sending request to Elavon with body:', requestBody.toString());

    // Call Elavon API
    const response = await fetch('https://api.convergepay.com/hosted-payments/transaction_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: requestBody.toString()
    });

    const responseText = await response.text();
    console.log('Converge API response:', responseText);

    if (!response.ok) {
      console.error('Elavon API returned error:', response.status, responseText);
      throw new Error(`Failed to get transaction token: ${response.status}`);
    }

    if (!responseText) {
      throw new Error('No transaction token received from payment gateway');
    }

    return NextResponse.json({ token: responseText });

  } catch (error) {
    console.error('Error in get-token API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate payment token' },
      { status: 500 }
    );
  }
}
