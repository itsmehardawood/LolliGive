import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.formData();
  const data = Object.fromEntries(body.entries());

  console.log("🔔 [ELAVON CALLBACK] Payment response received:");
  console.log(JSON.stringify(data, null, 2));

  return NextResponse.json({ received: true });
}
