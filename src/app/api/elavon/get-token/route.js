import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('🟢 [API] get-token endpoint called');
  
  try {
    const { amount } = await request.json();
    console.log('💰 [API] Amount received:', amount);

    const ssl_account_id = process.env.ELAVON_SSL_ACCOUNT_ID;
    const ssl_user_id = process.env.ELAVON_SSL_USER_ID;
    const ssl_pin = process.env.ELAVON_SSL_PIN;

    console.log('🔑 [API] Credentials check:', {
      ssl_account_id: ssl_account_id ? `${ssl_account_id.substring(0, 5)}...` : 'MISSING',
      ssl_user_id: ssl_user_id ? `${ssl_user_id.substring(0, 5)}...` : 'MISSING',
      ssl_pin: ssl_pin ? '***' : 'MISSING',
    });

    if (!ssl_account_id || !ssl_user_id || !ssl_pin) {
      console.error('❌ [API] Missing payment gateway credentials:', {
        ssl_account_id: !!ssl_account_id,
        ssl_user_id: !!ssl_user_id,
        ssl_pin: !!ssl_pin,
      });
      return NextResponse.json(
        { error: 'Payment gateway credentials not configured' },
        { status: 500 }
      );
    }

    const amountString = parseFloat(amount).toFixed(2);
    console.log('💵 [API] Formatted amount:', amountString);

    const requestBody = new URLSearchParams({
      ssl_account_id,
      ssl_user_id,
      ssl_pin,
      ssl_transaction_type: 'ccsale',
      ssl_amount: amountString,
      ssl_get_token: 'Y' 
    });

    console.log('📋 [API] Request body params:', {
      ssl_account_id: ssl_account_id.substring(0, 5) + '...',
      ssl_user_id: ssl_user_id.substring(0, 5) + '...',
      ssl_pin: '***',
      ssl_transaction_type: 'ccsale',
      ssl_amount: amountString,
      ssl_get_token: 'Y'
    });

    console.log('📤 [API] Sending request to Elavon API');
    console.log('🌐 [API] URL: https://api.convergepay.com/hosted-payments/transaction_token');
    console.log('📝 [API] Content-Type: application/x-www-form-urlencoded');

    const response = await fetch('https://api.convergepay.com/hosted-payments/transaction_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: requestBody.toString()
    });

    console.log('📥 [API] Elavon response status:', response.status);
    console.log('📥 [API] Elavon response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('📄 [API] Elavon raw response:', responseText ? `${responseText.substring(0, 50)}...` : 'EMPTY');

    if (!response.ok) {
      console.error('🔴 [API] Elavon API returned error:', response.status, responseText);
      throw new Error(`Failed to get transaction token: ${response.status}`);
    }

    if (!responseText) {
      console.error('❌ [API] No transaction token received from payment gateway');
      throw new Error('No transaction token received from payment gateway');
    }

    console.log('✅ [API] Successfully generated token');
    console.log('🎫 [API] Token length:', responseText.length);

    return NextResponse.json({ token: responseText });

  } catch (error) {
    console.error('💥 [API] Error in get-token API:', error);
    console.error('💥 [API] Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to generate payment token' },
      { status: 500 }
    );
  }
}
