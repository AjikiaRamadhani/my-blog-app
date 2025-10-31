import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID diperlukan' },
        { status: 400 }
      );
    }

    const [postCount] = await query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
      [parseInt(userId)]
    );
    
    const [commentCount] = await query(
      'SELECT COUNT(*) as count FROM comments WHERE user_id = ?',
      [parseInt(userId)]
    );

    return NextResponse.json({
      postCount: postCount.count,
      commentCount: commentCount.count
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error mengambil data statistik' },
      { status: 500 }
    );
  }
}