import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: process.env.DO_SPACES_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET!,
  },
});

function getFilePath(fileName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `teamlypro/${year}/${month}/${day}/${fileName}`;
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(async (file) => {
    const filePath = getFilePath(file.name);
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Create a command to upload the file
    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: filePath,
      Body: uint8Array,
      ContentType: file.type,
      ACL: 'public-read',
    });

    // Upload the file
    await s3Client.send(command);
    
    // Return the public URL
    return `${process.env.DO_SPACES_ENDPOINT}/${process.env.DO_SPACES_BUCKET}/${filePath}`;
  });

  return Promise.all(uploadPromises);
}