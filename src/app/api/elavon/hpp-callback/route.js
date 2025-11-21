// // /app/api/elavon/hpp-callback/route.js
// export const dynamic = "force-dynamic";
// export const fetchCache = "force-no-store";
// export const runtime = "nodejs";

// import { NextResponse } from "next/server";

// // Helper function to parse URL-encoded body from Converge HPP
// async function parseBody(req) {
//   try {
//     const rawBody = await req.text();
//     console.log('📄 [CALLBACK] Raw body received:', rawBody.substring(0, 200) + '...');
//     const params = new URLSearchParams(rawBody);
//     return Object.fromEntries(params.entries());
//   } catch (error) {
//     console.error('❌ [CALLBACK] Error parsing body:', error);
//     throw error;
//   }
// }

// export async function POST(req) {
//   console.log('🔔 [CALLBACK] HPP callback endpoint called');
//   console.log('📋 [CALLBACK] Request headers:', Object.fromEntries(req.headers.entries()));
  
//   try {
//     const data = await parseBody(req);

//     console.log("🔔 [CALLBACK] Payment response received from Converge HPP");
//     console.log('📊 [CALLBACK] Full response data:', JSON.stringify(data, null, 2));

//     // Validate that we received data
//     if (!data || Object.keys(data).length === 0) {
//       console.error('❌ [CALLBACK] Empty or invalid payload received');
//       return NextResponse.json(
//         { received: false, error: 'Empty payload' },
//         { status: 400 }
//       );
//     }

//     // Check if payment approved (ssl_result === "0" means approved)
//     if (data.ssl_result === "0") {
//       console.log('✅ [CALLBACK] Payment APPROVED:');
//       console.log(`   Transaction ID: ${data.ssl_txn_id}`);
//       console.log(`   Approval Code: ${data.ssl_approval_code}`);
//       console.log(`   Amount: ${data.ssl_amount}`);
//       console.log(`   Card Type: ${data.ssl_card_short_description || 'N/A'}`);
//       console.log(`   Last 4 Digits: ${data.ssl_card_number || 'N/A'}`);
      
//       // TODO: Update your database, mark donation as completed
//       // Example: await updateDonationStatus(data.ssl_txn_id, 'completed', data);
//     } else {
//       console.warn('❌ [CALLBACK] Payment FAILED or DECLINED:');
//       console.warn(`   Transaction ID: ${data.ssl_txn_id}`);
//       console.warn(`   Result: ${data.ssl_result}`);
//       console.warn(`   Result Message: ${data.ssl_result_message || 'N/A'}`);
//       console.warn(`   Error: ${data.errorMessage || data.ssl_error || 'Unknown error'}`);
      
//       // TODO: Handle failed payment (notify user/admin, log to DB, etc.)
//       // Example: await updateDonationStatus(data.ssl_txn_id, 'failed', data);
//     }

//     // Always respond quickly to HPP to acknowledge receipt
//     return NextResponse.json({ received: true }, { status: 200 });
//   } catch (error) {
//     console.error("💥 [CALLBACK] Error processing payment callback:", error);
//     console.error("💥 [CALLBACK] Error stack:", error.stack);
//     // Still return 200 to prevent HPP from retrying
//     return NextResponse.json({ received: true, error: error.message }, { status: 200 });
//   }
// }





import { NextResponse } from 'next/server';
import { parse } from 'querystring';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const text = await req.text();
    if (!text) {
      console.warn('Empty HPP payload');
      return new NextResponse('Empty payload', { status: 400 });
    }

    const payload = parse(text);

    const {
      ssl_result,
      ssl_result_message,
      ssl_txn_id,
      ssl_approval_code,
      ssl_amount,
      ssl_error,
      ssl_avs_response,
      ssl_cvv2_response
    } = payload;

    console.log('📄 [HPP CALLBACK] Payment result:', {
      ssl_result,
      ssl_result_message,
      ssl_txn_id,
      ssl_approval_code,
      ssl_amount,
      ssl_error,
      ssl_avs_response,
      ssl_cvv2_response
    });

    // TODO: save transaction to DB, send confirmation email, etc.

    return new NextResponse('OK', { status: 200 });
  } catch (err) {
    console.error('[HPP CALLBACK] Error parsing payload:', err);
    return new NextResponse('Failed to parse payload', { status: 500 });
  }
}
