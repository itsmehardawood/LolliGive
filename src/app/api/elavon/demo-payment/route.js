// File: app/api/elavon/demo-payment/route.js

import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log('========== DEMO PAYMENT SIMULATION ==========');
  
  try {
    const body = await request.json();
    const { amount, name, purpose, comment, orgId, invoiceNumber } = body;

    // Simulate a successful demo payment
    console.log('Demo payment details:', {
      amount,
      name,
      purpose,
      comment,
      orgId,
      invoiceNumber
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return demo success response
    return NextResponse.json({
      success: true,
      isDemo: true,
      message: 'Demo payment completed successfully',
      transactionId: `DEMO-${Date.now()}`,
      amount: parseFloat(amount).toFixed(2),
      status: 'approved',
      invoiceNumber,
      demoNote: 'This was a simulated payment - no real money was charged'
    });

  } catch (error) {
    console.error('Demo payment error:', error);
    return NextResponse.json(
      { 
        success: false,
        isDemo: true,
        message: 'Demo payment failed',
        error: error.message 
      },
      { status: 500 }
    );
  }
}