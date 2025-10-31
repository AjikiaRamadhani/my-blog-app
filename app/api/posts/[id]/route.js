import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET single post
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
      `SELECT p.*, c.name as category_name 
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
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
    const { id } = await params;
    const { title, content, excerpt, slug, category_id } = await request.json();
    
    console.log('Updating post:', { id, title, category_id });
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    // Check if post exists
    const existingPost = await query(
      'SELECT id FROM posts WHERE id = ?',
      [parseInt(id)]
    );

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Update post
    await query(
      `UPDATE posts 
       SET title = ?, content = ?, excerpt = ?, slug = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [title, content, excerpt, slug, parseInt(category_id), parseInt(id)]
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
    const { id } = await params;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const existingPost = await query(
      'SELECT id FROM posts WHERE id = ?',
      [parseInt(id)]
    );

    if (existingPost.length === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
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