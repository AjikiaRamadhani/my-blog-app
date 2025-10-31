import Link from 'next/link';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import DeleteButton from './DeleteButton';

async function getPost(id) {
  try {
    if (!id || isNaN(parseInt(id))) return null;

    const posts = await query(
      `SELECT p.*, c.name as category_name, u.username, u.name as author_name, u.id as author_id
       FROM posts p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = ? AND p.published = true`,
      [parseInt(id)]
    );
    
    return posts[0] || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

async function getComments(postId) {
  try {
    if (!postId || isNaN(parseInt(postId))) return [];

    const comments = await query(
      `SELECT c.*, u.username, u.name as author_name 
       FROM comments c 
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ? 
       ORDER BY c.created_at DESC`,
      [parseInt(postId)]
    );
    
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  const comments = await getComments(id);
  
  // ✅ Sekarang panggil dengan await
  const user = await getCurrentUser();

  if (!post) {
    return (
      <div className="container">
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <Link href="/posts" className="btn">Back to Posts</Link>
      </div>
    );
  }

  // Debug: Lihat user dan post data
  console.log('User:', user);
  console.log('Post user_id:', post.user_id);
  console.log('Post author_id:', post.author_id);

  // ✅ Cek ownership dengan benar
  const isOwner = user && (user.userId === post.user_id || user.userId === post.author_id || user.role === 'admin');

  return (
    <div className="container">
      {/* Action Buttons - Hanya show untuk pemilik */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/posts" className="btn btn-secondary">← Back to Posts</Link>
        
        {isOwner ? (
          <>
            <Link href={`/posts/${id}/edit`} className="btn">Edit Post</Link>
            <DeleteButton postId={id} postTitle={post.title} />
          </>
        ) : user ? (
          <span style={{ color: '#666', fontStyle: 'italic' }}>
            You can only edit your own posts
          </span>
        ) : (
          <Link href={`/auth/login?from=/posts/${id}`} className="btn">
            Login to Manage Posts
          </Link>
        )}
      </div>

      <article className="single-post">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="category">{post.category_name}</span>
            <span className="author">By {post.author_name}</span>
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
              <div className="comment-author">
                {comment.author_name || comment.author_name}
                {comment.user_id && <span style={{fontSize: '0.8em', color: '#666', marginLeft: '0.5rem'}}>(User)</span>}
              </div>
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