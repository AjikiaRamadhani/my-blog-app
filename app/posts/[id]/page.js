import Link from 'next/link';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import DeleteButton from './DeleteButton';
import CommentsSection from '@/components/CommentsSection'; // ✅ Import komponen komentar

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

export default async function PostPage({ params }) {
  const { id } = await params;
  const post = await getPost(id);
  const user = await getCurrentUser();

  if (!post) {
    return (
      <div className="container">
        <h1>Cerita Tidak Ditemukan</h1>
        <p>Cerita yang Anda cari tidak ditemukan.</p>
        <Link href="/posts" className="btn">Kembali ke Semua Cerita</Link>
      </div>
    );
  }

  const isOwner = user && (user.userId === post.user_id || user.userId === post.author_id || user.role === 'admin');

  return (
    <div className="container">
      {/* Action Buttons */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link href="/posts" className="btn btn-secondary">← Kembali ke Semua Cerita</Link>
        
        {isOwner ? (
          <>
            <Link href={`/posts/${id}/edit`} className="btn">Edit Cerita</Link>
            <DeleteButton postId={id} postTitle={post.title} />
          </>
        ) : user ? (
          <span style={{ color: '#666', fontStyle: 'italic' }}>
            Anda hanya bisa mengedit cerita milik sendiri
          </span>
        ) : (
          <Link href={`/auth/login?from=/posts/${id}`} className="btn">
            Login untuk Kelola Cerita
          </Link>
        )}
      </div>

      <article className="single-post">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          <div className="post-meta">
            <span className="category">{post.category_name}</span>
            <span className="author">Oleh {post.author_name}</span>
            <span className="date">
              Dipublikasikan pada {new Date(post.created_at).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </header>

        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>

      {/* ✅ Comments Section */}
      <CommentsSection postId={id} user={user} />
    </div>
  );
}