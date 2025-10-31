import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth'; // ✅ Tambah import ini

// GET semua komentar untuk sebuah post
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID diperlukan' },
        { status: 400 }
      );
    }

    const comments = await query(`
      SELECT c.*, u.name as author_name, u.username
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ? 
      ORDER BY c.created_at ASC
    `, [parseInt(postId)]);

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Error mengambil komentar' },
      { status: 500 }
    );
  }
}

// POST komentar baru (bisa jadi komentar utama atau reply)
export async function POST(request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login untuk berkomentar' },
        { status: 401 }
      );
    }

    const { post_id, content, parent_id } = await request.json();

    if (!post_id || !content) {
      return NextResponse.json(
        { error: 'Post ID dan konten komentar diperlukan' },
        { status: 400 }
      );
    }

    // Insert komentar baru
    const result = await query(
      `INSERT INTO comments (post_id, user_id, content, parent_id) 
       VALUES (?, ?, ?, ?)`,
      [parseInt(post_id), user.userId, content, parent_id || null]
    );

    // Ambil data komentar yang baru dibuat
    const newComment = await query(`
      SELECT c.*, u.name as author_name, u.username
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `, [result.insertId]);

    return NextResponse.json(
      { 
        message: 'Komentar berhasil ditambahkan',
        comment: newComment[0]
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Error menambahkan komentar' },
      { status: 500 }
    );
  }
}