import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { BlobServiceClient } from "@azure/storage-blob";
import { getSessionFromRequestCookies } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSessionFromRequestCookies();
  if (!session) return null;
  return session.role === "ADMIN" || session.role === "SUPER_ADMIN" ? session : null;
}

export async function POST(req: Request) {
  const session = await requireAdmin();
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

  if ("size" in file && typeof file.size === "number" && file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 8MB)." }, { status: 400 });
  }

  const blobConn = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
  if (!blobConn) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING" }, { status: 500 });
  }

  const containerName = "practice-media";

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(blobConn);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({ access: "blob" });
    const acl = await containerClient.getAccessPolicy();
    if (acl.blobPublicAccess !== "blob") {
      await containerClient.setAccessPolicy("blob");
    }

    const originalName = file.name ? String(file.name) : "image";
    const safeOriginal = originalName.replaceAll("/", "_").replaceAll("\\", "_");
    const ext = safeOriginal.includes(".") ? safeOriginal.split(".").pop() : "jpg";
    const blobName = `${randomUUID()}_${safeOriginal}_${ext}`.replaceAll("__", "_");

    const arrayBuffer = await file.arrayBuffer();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(Buffer.from(arrayBuffer), {
      blobHTTPHeaders: { blobContentType: contentType || "image/jpeg" },
    });

    return NextResponse.json({ ok: true, imageUrl: blockBlobClient.url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

