import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/storage';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Dosya yok.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Yalnızca JPG, PNG, WebP, GIF kabul edilir.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Dosya 5 MB sınırını aşıyor.' }, { status: 400 });
    }

    const { url } = await uploadImage(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/admin/upload]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
