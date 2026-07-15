import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT, // from Cloudflare dashboard
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

router.post("/get-upload-url", verifyClerkAuth, async (req, res) => {
  const { fileName, fileType } = req.body;
  const key = `uploads/${req.userId}/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const signedUrl = await getSignedUrl(r2, command, { expiresIn: 60 });
  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  res.json({ signedUrl, publicUrl, key });
});