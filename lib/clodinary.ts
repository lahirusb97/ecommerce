import { v2 as Cloudinary } from "cloudinary";

Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer or base64 string to Cloudinary.
 * @param fileBuffer - Buffer or base64 string of the image
 * @param folder - Optional Cloudinary folder (e.g., "products")
 * @returns Promise<CloudinaryUploadResult>
 */
export async function uploadFile(
  fileBuffer: Buffer | string,
  folder = "uploads"
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = Cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("No result from Cloudinary"));
        } else {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );
    if (typeof fileBuffer === "string") {
      uploadStream.end(Buffer.from(fileBuffer, "base64"));
    } else {
      uploadStream.end(fileBuffer);
    }
  });
}

//delete img usingpublic id
export async function deleteFile(public_id: string) {
  return Cloudinary.uploader.destroy(public_id);
}
