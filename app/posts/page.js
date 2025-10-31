import Link from 'next/link';
import { query } from '@/lib/db';

async function getAllPosts() {
  try {
    const posts = await query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.published = true 
      ORDER BY p.created_at DESC
    `);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="container">
      <div className="page-header">
        <h1>All Blog Posts</h1>
        <Link href="/posts/create" className="btn">Create New Post</Link>
      </div>

      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p className="excerpt">{post.excerpt}</p>
              <div className="post-meta">
                <span className="category">{post.category_name}</span>
                <span className="date">
                  {new Date(post.created_at).toLocaleDateString()}
                </span>
                {/* ✅ Pastikan link menggunakan string */}
                <Link href={`/posts/${post.id}`} className="read-more">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
}