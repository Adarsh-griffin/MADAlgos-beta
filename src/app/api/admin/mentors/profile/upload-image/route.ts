import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { BlobServiceClient } from "@azure/storage-blob";
import { getSessionFromRequestCookies } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";
import MentorProfileModel from "@/models/MentorProfile";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getSessionFromRequestCookies();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return null;
  }
  return session;
}

/**
 * Admin uploads a profile image for a mentor user (same storage as /api/mentor/profile/upload-image).
 */
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const userIdRaw = formData.get("userId");
  const file = formData.get("image");

  if (!userIdRaw || typeof userIdRaw !== "string") {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }
  if (!mongoose.Types.ObjectId.isValid(userIdRaw)) {
    return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
  }
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No image file provided" }, { status: 400 });
  }

  const contentType = file.type || "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Invalid file type. Please upload an image." }, { status: 400 });
  }

  if ("size" in file && typeof (file as Blob).size === "number" && (file as Blob).size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image too large (max 5MB)." }, { status: 400 });
  }

  const blobConn = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
  if (!blobConn) {
    return NextResponse.json({ error: "Missing NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING" }, { status: 500 });
  }

  await connectDB();
  const user = await UserModel.findById(userIdRaw).exec();
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const containerName = "mentor-images";

  try {
    const blobServiceClient = BlobServiceClient.fromConnectionString(blobConn);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const originalName = (file as File).name ? String((file as File).name) : "image";
    const ext = originalName.includes(".") ? originalName.split(".").pop() : "jpg";
    const blobName = `admin_${randomUUID()}_${originalName.replaceAll("/", "_")}.${ext}`.replaceAll("__", "_");

    const arrayBuffer = await (file as File).arrayBuffer();
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(Buffer.from(arrayBuffer), {
      blobHTTPHeaders: { blobContentType: contentType || "image/jpeg" },
    });

    const imageUrl = blockBlobClient.url;

    await MentorProfileModel.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userIdRaw) },
      { $set: { imageUrl } },
      { upsert: true, new: true }
    ).exec();

    return NextResponse.json({ ok: true, imageUrl });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
