import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("Printful Webhook Received:", body);

  return NextResponse.json({ message: "Webhook processed successfully" });
}
