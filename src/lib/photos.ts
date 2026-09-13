import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { pool } from "./db";
import type { Photo } from "./types";

const FULL_DIR = path.join(process.cwd(), "public", "uploads", "full");
const THUMB_DIR = path.join(process.cwd(), "public", "uploads", "thumbs");

export const UPLOAD_LIMITS = {
  maxFileBytes: 10 * 1024 * 1024, // 10MB per photo, before compression
  maxFilesPerUpload: 8,
  allowedMimeTypes: new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]),
};

export async function getAllPhotos(): Promise<Photo[]> {
  const result = await pool.query(
    "SELECT id, filename, thumb_filename as \"thumbFilename\", caption, uploader_name as \"uploaderName\", uploader_guest_id as \"uploaderGuestId\", width, height, size_bytes as \"sizeBytes\", created_at as \"createdAt\" FROM photos ORDER BY created_at DESC"
  );
  return result.rows;
}

export async function deletePhoto(id: string): Promise<boolean> {
  const res = await pool.query("DELETE FROM photos WHERE id = $1 RETURNING filename, thumb_filename as \"thumbFilename\"", [id]);
  const removed = res.rows[0];
  if (!removed) return false;

  await Promise.allSettled([
    fs.unlink(path.join(FULL_DIR, removed.filename)),
    fs.unlink(path.join(THUMB_DIR, removed.thumbFilename)),
  ]);
  return true;
}

export interface RejectedFile {
  name: string;
  reason: string;
}

export interface SaveUploadResult {
  saved: Photo[];
  rejected: RejectedFile[];
}

export async function saveUploadedPhotos(
  files: File[],
  meta: { caption: string; uploaderName: string; uploaderGuestId: string | null }
): Promise<SaveUploadResult> {
  await fs.mkdir(FULL_DIR, { recursive: true });
  await fs.mkdir(THUMB_DIR, { recursive: true });

  const saved: Photo[] = [];
  const rejected: RejectedFile[] = [];

  const files2 = files.slice(0, UPLOAD_LIMITS.maxFilesPerUpload);
  for (const extra of files.slice(UPLOAD_LIMITS.maxFilesPerUpload)) {
    rejected.push({ name: extra.name, reason: `Only ${UPLOAD_LIMITS.maxFilesPerUpload} photos per upload.` });
  }

  for (const file of files2) {
    if (file.size > UPLOAD_LIMITS.maxFileBytes) {
      rejected.push({ name: file.name, reason: "File is too large (10MB max)." });
      continue;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !UPLOAD_LIMITS.allowedMimeTypes.has(detected.mime)) {
      rejected.push({ name: file.name, reason: "Not a supported image file." });
      continue;
    }

    let pipeline;
    try {
      pipeline = sharp(buffer, { failOn: "error" }).rotate();
      const probe = await pipeline.metadata();
      if (!probe.width || !probe.height) throw new Error("no dimensions");
    } catch {
      rejected.push({ name: file.name, reason: "Image file appears to be corrupted." });
      continue;
    }

    const id = nanoid(12);
    const filename = `${id}.webp`;
    const thumbFilename = `${id}-thumb.webp`;

    const fullBuffer = await sharp(buffer).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const thumbBuffer = await sharp(buffer).rotate().resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
    const finalMeta = await sharp(fullBuffer).metadata();

    await fs.writeFile(path.join(FULL_DIR, filename), fullBuffer);
    await fs.writeFile(path.join(THUMB_DIR, thumbFilename), thumbBuffer);

    const createdAt = new Date().toISOString();
    
    await pool.query(
      `INSERT INTO photos (id, filename, thumb_filename, caption, uploader_name, uploader_guest_id, width, height, size_bytes, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id,
        filename,
        thumbFilename,
        meta.caption.slice(0, 280),
        meta.uploaderName ? meta.uploaderName.slice(0, 60) : null,
        meta.uploaderGuestId,
        finalMeta.width ?? 0,
        finalMeta.height ?? 0,
        fullBuffer.byteLength,
        createdAt,
      ]
    );

    saved.push({
      id,
      filename,
      thumbFilename,
      caption: meta.caption.slice(0, 280),
      uploaderName: meta.uploaderName ? meta.uploaderName.slice(0, 60) : null,
      uploaderGuestId: meta.uploaderGuestId,
      width: finalMeta.width ?? 0,
      height: finalMeta.height ?? 0,
      sizeBytes: fullBuffer.byteLength,
      createdAt,
    });
  }

  return { saved, rejected };
}
