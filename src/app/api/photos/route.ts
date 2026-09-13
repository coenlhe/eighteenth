import { NextResponse } from "next/server";
import { config } from "@/lib/config";
import { getAllPhotos, saveUploadedPhotos, UPLOAD_LIMITS } from "@/lib/photos";

export async function GET() {
  if (config.eventPhase !== "after") {
    return NextResponse.json({ phase: config.eventPhase, photos: [] });
  }
  const photos = await getAllPhotos();
  return NextResponse.json({ phase: config.eventPhase, photos });
}

export async function POST(request: Request) {
  if (config.eventPhase !== "after") {
    return NextResponse.json({ error: "The gallery isn't open yet." }, { status: 403 });
  }

  const form = await request.formData();
  const guestId = form.get("guestId");
  const caption = form.get("caption");
  const uploaderName = form.get("uploaderName");
  const files = form.getAll("files").filter((f): f is File => f instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: "No photos were attached." }, { status: 400 });
  }
  if (files.length > UPLOAD_LIMITS.maxFilesPerUpload) {
    return NextResponse.json(
      { error: `You can upload up to ${UPLOAD_LIMITS.maxFilesPerUpload} photos at a time.` },
      { status: 400 }
    );
  }

  const result = await saveUploadedPhotos(files, {
    caption: typeof caption === "string" ? caption : "",
    uploaderName: typeof uploaderName === "string" ? uploaderName.trim() : "",
    uploaderGuestId: typeof guestId === "string" && guestId ? guestId : null,
  });

  return NextResponse.json(result);
}
