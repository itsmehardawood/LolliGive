export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const runtime = "nodejs";
export const dynamicIO = false;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

import { NextResponse } from "next/server";

export async function POST(request) {
  // Read raw request body
  const rawBody = await request.text();
  
  // Parse URL-encoded body into a JavaScript object
  const params = new URLSearchParams(rawBody);
  const data = Object.fromEntries(params.entries());

  console.log("🔔 [ELAVON CALLBACK] Payment response received:");
  console.log(JSON.stringify(data, null, 2));

  return NextResponse.json({ received: true });
}
