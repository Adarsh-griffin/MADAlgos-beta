import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import MentorProfileModel from "@/models/MentorProfile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireMentor() {
  const session = await getSessionFromRequestCookies();
  if (!session || session.role !== "MENTOR") return null;
  return session;
}

export async function POST(req: Request) {
  const session = await requireMentor();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("image");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  const contentType = file.type || "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 });
  }

  // Safety limit: 5MB (adjust if you want).
  if ("size" in file && typeof (file as any).size === "number" && (file as any).size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 5MB)." }, { status: 400 });
  }

  const blobConn = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
  if (!blobConn) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING" }, { status: 500 });
  }

  const containerName = "mentor-images";

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(blobConn);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const originalName = (file as any).name ? String((file as any).name) : "image";
    const ext = originalName.includes(".") ? originalName.split(".").pop() : "jpg";
    const blobName = `${randomUUID()}_${originalName.replaceAll("/", "_")}_${ext}`.replaceAll("__", "_");

    const arrayBuffer = await (file as any).arrayBuffer();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(Buffer.from(arrayBuffer), {
      blobHTTPHeaders: { blobContentType: contentType || "image/jpeg" },
    });

    const imageUrl = blockBlobClient.url;

    // Keep the image in the mentor profile record; it will be published on admin approve.
    await connectDB();
    await MentorProfileModel.findOneAndUpdate(
      { userId: session.uid },
      { $set: { imageUrl, reviewStatus: "PENDING_REVIEW", rejectionReason: null } },
      { upsert: true }
    ).exec();

    return NextResponse.json({ ok: true, imageUrl });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 }
    );
  }
}

