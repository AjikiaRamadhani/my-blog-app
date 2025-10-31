import Link from 'next/link';
import { query } from '@/lib/db';

async function getRecentPosts() {
  try {
    const posts = await query(`
      SELECT p.*, c.name as category_name 
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.published = true 
      ORDER BY p.created_at DESC 
      LIMIT 6
    `);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function Home() {
  const posts = await getRecentPosts();

  return (
    <div className="container">
      <section className="hero">
        <h1>Welcome to My Blog</h1>
        <p>A simple blog built with Next.js and MySQL</p>
        <Link href="/posts/create" className="btn">Create New Post</Link>
      </section>

      <section className="recent-posts">
        <h2>Recent Posts</h2>
        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <h3>{post.title}</h3>
                <p className="excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span className="category">{post.category_name}</span>
                  {/* ✅ Pastikan link menggunakan string */}
                  <Link href={`/posts/${post.id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </div>
  );
}