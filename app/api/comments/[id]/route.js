import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUserFromRequest } from '@/lib/auth'; // ✅ Tambah import

// DELETE komentar
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login untuk menghapus komentar' },
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

    // Check jika komentar exists dan cek ownership
    const existingComment = await query(
      'SELECT * FROM comments WHERE id = ?',
      [parseInt(id)]
    );

    if (existingComment.length === 0) {
      return NextResponse.json(
        { error: 'Komentar tidak ditemukan' },
        { status: 404 }
      );
    }

    const comment = existingComment[0];

    // Authorization: Hanya pemilik komentar atau admin yang bisa hapus
    if (comment.user_id !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Kamu hanya bisa menghapus komentar milikmu sendiri' },
        { status: 403 }
      );
    }

    // Hapus komentar
    await query(
      'DELETE FROM comments WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({ message: 'Komentar berhasil dihapus' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json(
      { error: 'Error menghapus komentar' },
      { status: 500 }
    );
  }
}