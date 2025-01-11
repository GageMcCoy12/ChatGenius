import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { s3Client, AWS_S3_BUCKET } from './aws-config';

export type UploadResponse = {
  url: string;
  key: string;
};

/**
 * Uploads a file to AWS S3 using presigned URLs
 * @param file The file to upload
 * @param onProgress Optional callback for upload progress
 * @returns Promise with the uploaded file URL and key
 */
export async function uploadToS3(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  try {
    // Generate a unique key for the file
    const key = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Get presigned post data
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: AWS_S3_BUCKET,
      Key: key,
      Conditions: [
        ['content-length-range', 0, 10 * 1024 * 1024], // 10MB max
        ['starts-with', '$Content-Type', file.type],
      ],
      Fields: {
        'Content-Type': file.type,
      },
      Expires: 600, // URL expires in 10 minutes
    });

    // Prepare form data for upload
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append('file', file);

    // Upload the file
    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!upload.ok) {
      throw new Error('Upload failed');
    }

    // Construct the final URL
    const fileUrl = `https://${AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    return {
      url: fileUrl,
      key,
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
} 