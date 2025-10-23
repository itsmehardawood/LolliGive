// File: app/api/elavon/config/route.js

import { NextResponse } from 'next/server';

export async function GET() {
  const environment = process.env.ELAVON_ENVIRONMENT || 'demo';
  const isDemo = environment === 'demo';
  
  return NextResponse.json({
    environment,
    isDemo,
    message: isDemo ? 'Demo mode - no real charges' : 'Production mode - real charges',
    demoCredentials: isDemo ? {
      merchantId: process.env.ELAVON_DEMO_MERCHANT_ID || 'demo',
      userId: process.env.ELAVON_DEMO_USER_ID || 'demo',
    } : null
  });
}