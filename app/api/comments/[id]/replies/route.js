import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET semua replies untuk sebuah komentar
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'ID komentar tidak valid' },
        { status: 400 }
      );
    }

    const replies = await query(`
      SELECT c.*, u.name as author_name, u.username
      FROM comments c 
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.parent_id = ? 
      ORDER BY c.created_at ASC
    `, [parseInt(id)]);

    return NextResponse.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Error mengambil balasan komentar' },
      { status: 500 }
    );
  }
}