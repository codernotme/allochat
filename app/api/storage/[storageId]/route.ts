import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storageId: string }> }
) {
  const { storageId } = await params;
  const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.cloud', '.site');

  if (!CONVEX_SITE_URL) {
    return new NextResponse('Convex URL not configured', { status: 500 });
  }

  return NextResponse.redirect(`${CONVEX_SITE_URL}/api/storage/${storageId}`);
}
