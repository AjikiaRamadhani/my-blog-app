import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// GET single post - PUBLIC (bisa diakses semua orang)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const posts = await query(
      `SELECT p.*, c.name as category_name, u.username, u.name as author_name
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = ? AND p.published = true`,
      [parseInt(id)]
    );

    if (posts.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(posts[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Error fetching post' },
      { status: 500 }
    );
  }
}

// UPDATE post
export async function PUT(request, { params }) {
  try {
    const user = await getCurrentUserFromRequest(request); // ✅
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { title, content, excerpt, slug, category_id } = await request.json();
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Check if post exists dan cek ownership
    const existingPost = await query(
      'SELECT * FROM posts WHERE id = ?',
      [parseInt(id)]
    );

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const post = existingPost[0];

    // Authorization check: Hanya pemilik post atau admin yang bisa edit
    if (post.user_id !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You can only edit your own posts' },
        { status: 403 }
      );
    }

    // Update post
    await query(
      `UPDATE posts 
       SET title = ?, content = ?, excerpt = ?, slug = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, content, excerpt, slug, category_id, parseInt(id)]
    );

    return NextResponse.json({ 
      message: 'Post updated successfully',
      id: parseInt(id)
    });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Error updating post: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE post
export async function DELETE(request, { params }) {
  try {
    const user = await getCurrentUserFromRequest(request); // ✅
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Check if post exists dan cek ownership
    const existingPost = await query(
      'SELECT * FROM posts WHERE id = ?',
      [parseInt(id)]
    );

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const post = existingPost[0];

    // Authorization check: Hanya pemilik post atau admin yang bisa hapus
    if (post.user_id !== user.userId && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You can only delete your own posts' },
        { status: 403 }
      );
    }

    await query(
      'DELETE FROM posts WHERE id = ?',
      [parseInt(id)]
    );

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Error deleting post' },
      { status: 500 }
    );
  }
}