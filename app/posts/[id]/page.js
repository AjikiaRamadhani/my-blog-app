import Link from 'next/link';
import { query } from '@/lib/db';
import DeleteButton from './DeleteButton';

async function getPost(id) {
  try {
    // ✅ Pastikan id valid sebelum query
    if (!id || isNaN(parseInt(id))) {
      return null;
    }

    const posts = await query(
      `SELECT p.*, c.name as category_name 
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ? AND p.published = true`,
      [parseInt(id)] // ✅ Konversi ke number
    );
    
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getComments(postId) {
  try {
    // ✅ Pastikan postId valid
    if (!postId || isNaN(parseInt(postId))) {
      return [];
    }

    const comments = await query(
      `SELECT * FROM comments 
       WHERE post_id = ? 
       ORDER BY created_at DESC`,
      [parseInt(postId)] // ✅ Konversi ke number
    );
    
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export default async function PostPage({ params }) {
  // ✅ Tunggu params selesai
  const { id } = await params;
  
  const post = await getPost(id);
  const comments = await getComments(id);

  if (!post) {
    return (
      <div className="container">
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <Link href="/posts" className="btn">Back to Posts</Link>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Action Buttons */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/posts" className="btn btn-secondary">← Back to Posts</Link>
        <Link href={`/posts/${id}/edit`} className="btn">Edit Post</Link>
        <DeleteButton postId={id} postTitle={post.title} />
      </div>

      <article className="single-post">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="category">{post.category_name}</span>
            <span className="date">
              Published on {new Date(post.created_at).toLocaleDateString()}
            </span>
          </div>
        </header>

        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="comments-section">
        <h3>Comments ({comments.length})</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-author">{comment.author_name}</div>
              <div className="comment-date">
                {new Date(comment.created_at).toLocaleDateString()}
              </div>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </section>
    </div>
  );
}