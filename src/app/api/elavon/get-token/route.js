import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  let body;

  // Parse JSON body safely
  try {
    body = await req.json();
  } catch (err) {
    console.error('❌ Invalid JSON body:', err);
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const amount = parseFloat(body.amount);
  if (!amount || isNaN(amount)) {
    console.error('❌ Invalid or missing amount:', body.amount);
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
  }

  // Fetch Converge credentials from environment
  const ssl_account_id = process.env.ELAVON_SSL_ACCOUNT_ID;
  const ssl_user_id = process.env.ELAVON_SSL_USER_ID;
  const ssl_pin = process.env.ELAVON_SSL_PIN;

  if (!ssl_account_id || !ssl_user_id || !ssl_pin) {
    console.error('❌ Missing payment gateway credentials');
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  // Prepare request body for Converge
  const requestBody = new URLSearchParams({
    ssl_amount: amount.toFixed(2),
    ssl_user_id,
    ssl_pin,
    ssl_transaction_type: 'ccsale',
    ssl_show_form: 'false',
    ssl_account_id,
    ssl_get_token: 'Y', // ensure token is returned
  });

  try {
    console.log('📤 Sending request to Converge...');
    const response = await fetch(
      'https://api.convergepay.com/hosted-payments/transaction_token',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: requestBody.toString(),
      }
    );

    const token = await response.text(); // Converge returns plain string

    if (!token) {
      console.error('❌ No token received from Converge');
      return NextResponse.json({ error: 'No token received from Converge' }, { status: 502 });
    }

    console.log('✅ Token received:', token.substring(0, 10) + '...');
    return NextResponse.json({ token });
  } catch (err) {
    console.error('💥 Error fetching token from Converge:', err);
    return NextResponse.json({ error: 'Failed to fetch token from Converge' }, { status: 502 });
  }
}
