import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { amount } = await request.json();

    // Get credentials from environment variables
    const ssl_account_id = process.env.ELAVON_SSL_ACCOUNT_ID;
    const ssl_user_id = process.env.ELAVON_SSL_USER_ID;
    const ssl_pin = process.env.ELAVON_SSL_PIN;

    if (!ssl_account_id || !ssl_user_id || !ssl_pin) {
      return NextResponse.json(
        { error: 'Payment gateway credentials not configured' },
        { status: 500 }
      );
    }

    // Prepare the request body
    const requestBody = new URLSearchParams({
      ssl_account_id: ssl_account_id,
      ssl_user_id: ssl_user_id,
      ssl_pin: ssl_pin,
      ssl_transaction_type: 'ccsale',
      ssl_amount: amount,
      ssl_get_token: 'Y'
    });

    // Call Elavon API to get transaction token
    const response = await fetch('https://api.convergepay.com/hosted-payments/transaction_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody.toString()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Elavon API Error:', errorText);
      throw new Error(`Failed to get transaction token: ${response.status}`);
    }

    const token = await response.text();
    
    if (!token) {
      throw new Error('No transaction token received from payment gateway');
    }

    return NextResponse.json({ token });

  } catch (error) {
    console.error('Error in get-token API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate payment token' },
      { status: 500 }
    );
  }
}
