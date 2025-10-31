import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth'; // ✅ Tambah import

// POST like/unlike komentar
export async function POST(request, { params }) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login untuk like komentar' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID komentar tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah user sudah like komentar ini
    const existingLike = await query(
      'SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?',
      [parseInt(id), user.userId]
    );

    let action;
    
    if (existingLike.length > 0) {
      // Unlike
      await query(
        'DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?',
        [parseInt(id), user.userId]
      );
      await query(
        'UPDATE comments SET likes_count = likes_count - 1 WHERE id = ?',
        [parseInt(id)]
      );
      action = 'unliked';
    } else {
      // Like
      await query(
        'INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)',
        [parseInt(id), user.userId]
      );
      await query(
        'UPDATE comments SET likes_count = likes_count + 1 WHERE id = ?',
        [parseInt(id)]
      );
      action = 'liked';
    }

    // Ambil jumlah like terbaru
    const [updatedComment] = await query(
      'SELECT likes_count FROM comments WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({
      action: action,
      likes_count: updatedComment.likes_count
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json(
      { error: 'Error memproses like' },
      { status: 500 }
    );
  }
}

// GET status like user untuk komentar ini
export async function GET(request, { params }) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json({ liked: false });
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID komentar tidak valid' },
        { status: 400 }
      );
    }

    const existingLike = await query(
      'SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ?',
      [parseInt(id), user.userId]
    );

    return NextResponse.json({
      liked: existingLike.length > 0
    });
  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json({ liked: false });
  }
}