import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// ✅ Force menggunakan Node.js runtime
export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verifikasi token dilakukan di sini, bukan di middleware
    const { verifyToken } = await import('@/lib/auth');
    const user = await verifyToken(token);
    
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Get fresh user data from database
    const users = await query(
      'SELECT id, username, email, name, role, created_at FROM users WHERE id = ?',
      [user.userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error('Error getting current user:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}