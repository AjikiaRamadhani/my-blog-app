import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.published = true 
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching posts' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, content, excerpt, slug, category_id } = await request.json();
    
    const result = await query(
      `INSERT INTO posts (title, content, excerpt, slug, category_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [title, content, excerpt, slug, category_id]
    );

    return NextResponse.json(
      { message: 'Post created successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Error creating post' },
      { status: 500 }
    );
  }
}