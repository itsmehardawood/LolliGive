// /app/api/elavon/hpp-callback/route.js
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

export const config = {
  api: {
    bodyParser: false, // Important for raw POST from HPP
    externalResolver: true
  }
};

import { NextResponse } from "next/server";

// Helper function to parse URL-encoded body
async function parseBody(req) {
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
}

export async function POST(req) {
  try {
    const data = await parseBody(req);

    console.log("🔔 [ELAVON CALLBACK] Payment response received:");
    console.log(JSON.stringify(data, null, 2));

    // Example: check if payment approved
    if (data.ssl_result === "0") {
      console.log(`✅ Payment approved for txn_id: ${data.ssl_txn_id}, approval_code: ${data.ssl_approval_code}`);
      // TODO: Update your database, mark donation as completed
    } else {
      console.warn(`❌ Payment failed for txn_id: ${data.ssl_txn_id}, error: ${data.ssl_error || "Unknown error"}`);
      // TODO: Handle failed payment (notify user/admin, log, etc.)
    }

    // Always respond quickly to HPP
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("💥 [ELAVON CALLBACK] Error parsing payment callback:", error);
    return NextResponse.json({ received: false, error: error.message }, { status: 500 });
  }
}
