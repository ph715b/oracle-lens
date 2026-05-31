import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { readFileSync } from "fs"
import { extname } from "path"
import { config } from "dotenv"

// Load environment variables
config()

// R2 uses the S3 protocol so we can use the AWS S3 SDK
const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
})

// Usage: node upload-image.js <cardSlug> <imagePath>
// Example: node upload-image.js annie-fiery ./images/annie-fiery.jpg
async function uploadImage(cardSlug, imagePath) {
  // Read the image file from disk
  const fileContent = readFileSync(imagePath)
  
  // Determine the file type from the extension
  const ext = extname(imagePath).toLowerCase()
  const contentType = {
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png":  "image/png",
    ".webp": "image/webp",
    ".avif": "image/avif", 
  }[ext] ?? "image/jpeg"

  // The key is the filename in the bucket
  const key = `cards/${cardSlug}${ext}`

  console.log(`📤 Uploading ${imagePath} to R2 as ${key}...`)

  await s3.send(new PutObjectCommand({
    Bucket: process.env.CLOUDFLARE_R2_BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  }))

  // Build the public URL
  const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`
  console.log(`✅ Uploaded! Public URL: ${publicUrl}`)
  console.log(`\nAdd this to seed.js for ${cardSlug}:`)
  console.log(`imageUrl: "${publicUrl}",`)

  return publicUrl
}

// Get arguments from command line
const [,, cardSlug, imagePath] = process.argv

if (!cardSlug || !imagePath) {
  console.log("Usage: node upload-image.js <cardSlug> <imagePath>")
  console.log("Example: node upload-image.js annie-fiery ./images/annie-fiery.jpg")
  process.exit(1)
}

uploadImage(cardSlug, imagePath)
  .catch((e) => {
    console.error("❌ Upload failed:", e)
    process.exit(1)
  })