import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth'; // ✅ Tambah import ini

export async function GET() {
  try {
    const posts = await query(`
      SELECT p.*, c.name as category_name, u.username, u.name as author_name
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.published = true 
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error mengambil cerita' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content, category_id, slug, excerpt } = await request.json();
    
    const result = await query(
      `INSERT INTO posts (title, content, excerpt, slug, category_id, user_id) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, excerpt, slug, category_id, user.userId]
    );

    return NextResponse.json(
      { message: 'Cerita berhasil dibuat', id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error membuat cerita' },
      { status: 500 }
    );
  }
}