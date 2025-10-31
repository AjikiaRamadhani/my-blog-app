import Link from 'next/link';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

async function getAllPosts() {
  try {
    const posts = await query(`
      SELECT p.*, c.name as category_name, u.name as author_name
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.published = true 
      ORDER BY p.created_at DESC
    `);
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await query(`
      SELECT c.*, COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id AND p.published = true
      GROUP BY c.id
      ORDER BY c.name
    `);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function PostsPage() {
  const [posts, categories, user] = await Promise.all([
    getAllPosts(),
    getCategories(),
    getCurrentUser()
  ]);

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1>All Blog Posts</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            {posts.length} posts found
          </p>
        </div>
        
        {user && (
          <Link href="/posts/create" className="btn">Create New Post</Link>
        )}
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Categories</h3>
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            flexWrap: 'wrap' 
          }}>
            <Link 
              href="/posts"
              className="category"
              style={{ 
                background: '#2c3e50',
                textDecoration: 'none'
              }}
            >
              All Posts
            </Link>
            {categories.map((category) => (
              <Link 
                key={category.id}
                href={`/posts?category=${category.id}`}
                className="category"
                style={{ textDecoration: 'none' }}
              >
                {category.name} ({category.post_count})
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <h2>{post.title}</h2>
              <p className="excerpt">{post.excerpt}</p>
              <div className="post-meta">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="category">{post.category_name}</span>
                  <span className="author" style={{fontSize: '0.8em', color: '#666'}}>
                    by {post.author_name}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="date" style={{ fontSize: '0.8em', color: '#999' }}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                  <Link href={`/posts/${post.id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>No posts available</h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            There are no published posts yet.
          </p>
          {user ? (
            <Link href="/posts/create" className="btn">
              Create the First Post
            </Link>
          ) : (
            <Link href="/auth/register" className="btn">
              Register to Start Writing
            </Link>
          )}
        </div>
      )}
    </div>
  );
}