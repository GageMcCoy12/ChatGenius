import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { auth } from '@clerk/nextjs/server';

// S3 configuration
const region = process.env.AWS_REGION;
const bucket = process.env.AWS_S3_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// Validate configuration
if (!region || !bucket || !accessKeyId || !secretAccessKey) {
  console.error('Missing AWS configuration:', {
    hasRegion: !!region,
    hasBucket: !!bucket,
    hasAccessKey: !!accessKeyId,
    hasSecretKey: !!secretAccessKey
  });
}

const s3Client = new S3Client({
  region: region || 'us-east-1',
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!region || !bucket || !accessKeyId || !secretAccessKey) {
      return new NextResponse("AWS configuration is incomplete", { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Buffer created, size:', buffer.length);

    // Generate unique key
    const key = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    console.log('Generated key:', key);

    // Upload to S3
    console.log('Starting S3 upload...');
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    const result = await s3Client.send(command);
    console.log('S3 upload successful:', result);

    // Return the URL (using the correct S3 URL format)
    const url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    console.log('Generated URL:', url);
    
    return NextResponse.json({ url, key });
  } catch (error) {
    console.error('Upload error details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(
      error instanceof Error ? error.message : "Upload failed", 
      { status: 500 }
    );
  }
} 