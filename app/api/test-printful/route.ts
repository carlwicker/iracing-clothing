import { createPrintfulOrder } from "@/lib/printful";
import { NextResponse } from "next/server";

export async function GET() {
  const imageUrl = "https://via.placeholder.com/1500x1500.png?text=Test+Shirt";
  const metadata = { timecode: "12:34", camera: "TV1" };

  try {
    const result = await createPrintfulOrder(imageUrl, metadata);
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Printful error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 500 }
    );
  }
}
