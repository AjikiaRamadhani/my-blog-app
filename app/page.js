import Link from 'next/link';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

async function getRecentPosts() {
  try {
    const posts = await query(`
      SELECT p.*, c.name as category_name, u.name as author_name
      FROM posts p 
      LEFT JOIN categories c ON p.category_id = c.id 
      LEFT JOIN users u ON p.user_id = u.id
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

async function getCategories() {
  try {
    const categories = await query(`
      SELECT c.*, COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id AND p.published = true
      GROUP BY c.id
      ORDER BY post_count DESC
      LIMIT 4
    `);
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export default async function Home() {
  const [posts, categories, user] = await Promise.all([
    getRecentPosts(),
    getCategories(),
    getCurrentUser()
  ]);

  return (
    <div className="container">
      {/* Hero Section */}
      <section className="hero" style={{ 
        textAlign: 'center', 
        marginBottom: '4rem',
        padding: '4rem 0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          marginBottom: '1rem',
          fontWeight: 'bold'
        }}>
          Welcome to My Blog
        </h1>
        <p style={{ 
          fontSize: '1.3rem', 
          marginBottom: '2rem',
          opacity: 0.9
        }}>
          Discover amazing stories and share your thoughts
        </p>
        
        {!user ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn" style={{
              background: 'white',
              color: '#667eea',
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}>
              Get Started
            </Link>
            <Link href="/posts" className="btn" style={{
              background: 'transparent',
              border: '2px solid white',
              fontSize: '1.1rem',
              padding: '1rem 2rem'
            }}>
              Browse Posts
            </Link>
          </div>
        ) : (
          <Link href="/posts/create" className="btn" style={{
            background: '#27ae60',
            fontSize: '1.1rem',
            padding: '1rem 2rem'
          }}>
            Create New Post
          </Link>
        )}
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
            Popular Categories
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/posts?category=${category.id}`}
                className="category-card"
                style={{
                  background: 'white',
                  padding: '2rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  color: '#2c3e50',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
              >
                <h3 style={{ marginBottom: '0.5rem' }}>{category.name}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {category.post_count} posts
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts Section */}
      <section className="recent-posts">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: '#2c3e50' }}>Recent Posts</h2>
          <Link href="/posts" className="btn btn-secondary">
            View All Posts
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <h3 style={{ fontSize: '1.3rem' }}>{post.title}</h3>
                <p className="excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span className="category">{post.category_name}</span>
                  <span className="author" style={{fontSize: '0.8em', color: '#666'}}>
                    by {post.author_name}
                  </span>
                  <Link href={`/posts/${post.id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <h3>No posts yet</h3>
            <p>Be the first to create a post!</p>
            {!user && (
              <Link href="/auth/register" className="btn" style={{ marginTop: '1rem' }}>
                Register to Get Started
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section style={{ 
        textAlign: 'center', 
        marginTop: '4rem',
        padding: '3rem',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>
          Join Our Community
        </h2>
        <p style={{ color: '#666', marginBottom: '2rem', fontSize: '1.1rem' }}>
          Share your stories, read amazing content, and connect with other writers
        </p>
        {!user && (
          <Link href="/auth/register" className="btn" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Start Writing Today
          </Link>
        )}
      </section>
    </div>
  );
}