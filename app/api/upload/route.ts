import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const timecode = formData.get("timecode") as string;
  const camera = formData.get("camera") as string;

  if (!file || !timecode || !camera) {
    return NextResponse.json({ error: "Missing input" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join("/tmp", fileName);

  await writeFile(filePath, buffer);
  console.log(`[Saved] ${filePath} — ${timecode} @ ${camera}`);

  return NextResponse.json({ success: true, fileName });
}
