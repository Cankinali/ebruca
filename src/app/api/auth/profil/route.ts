import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface Body {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
}

/** Profil ve kayıtlı teslimat adresini günceller. E-posta ve şifre buradan değişmez. */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Bu işlem için giriş yapmalısınız.' }, { status: 401 });
    }

    const body = (await req.json()) as Body;
    const firstName = (body.firstName ?? user.firstName).trim();
    const lastName = (body.lastName ?? user.lastName).trim();

    if (!firstName || !lastName) {
      return NextResponse.json({ error: 'Ad ve soyad boş bırakılamaz.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        phone: (body.phone ?? user.phone).trim(),
        address: (body.address ?? user.address).trim(),
        city: (body.city ?? user.city).trim(),
        district: (body.district ?? user.district).trim(),
        postalCode: (body.postalCode ?? user.postalCode).trim(),
      },
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        address: updated.address,
        city: updated.city,
        district: updated.district,
        postalCode: updated.postalCode,
      },
    });
  } catch (err) {
    console.error('[PATCH /api/auth/profil]', err);
    return NextResponse.json({ error: 'Profil güncellenemedi.' }, { status: 500 });
  }
}
