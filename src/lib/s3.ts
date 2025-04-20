import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: process.env.MY_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.MY_AWS_SECRET_KEY!,
  },
});

export const uploadToS3 = async (buffer: Buffer, fileName: string, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.MY_AWS_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

};

export const getSignedFileUrl = async (fileName: string) => {
  const command = new GetObjectCommand({
    Bucket: process.env.MY_AWS_BUCKET_NAME!,
    Key: fileName,
  });

  return await getSignedUrl(s3, command, { expiresIn: 604800 });
};
