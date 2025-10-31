import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUserFromRequest } from '@/lib/auth'; // ✅ Gunakan yang untuk API

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const user = await getCurrentUserFromRequest(request); // ✅
    
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