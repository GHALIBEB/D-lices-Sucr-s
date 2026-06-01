import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File | null;
  const type = (data.get('type') as string) || 'image';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

  const maxSize = type === 'video' ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json(
      { error: `File too large (max ${type === 'video' ? '100' : '5'}MB)` },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: 'delice_sucre',
          resource_type: type === 'video' ? 'video' : 'image',
        },
        (err, res) => (err ? reject(err) : resolve(res as any))
      )
      .end(buffer);
  });

  return NextResponse.json({ url: result.secure_url });
}
