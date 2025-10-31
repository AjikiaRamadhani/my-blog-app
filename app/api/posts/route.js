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