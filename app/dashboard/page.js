import { query } from '@/lib/db';
import Link from 'next/link';

async function getDashboardStats(userId) {
  try {
    const [postCount] = await query(
      'SELECT COUNT(*) as count FROM posts WHERE user_id = ?',
      [userId]
    );
    
    const [commentCount] = await query(
      'SELECT COUNT(*) as count FROM comments WHERE user_id = ?',
      [userId]
    );

    return {
      postCount: postCount.count,
      commentCount: commentCount.count
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { postCount: 0, commentCount: 0 };
  }
}

export default async function DashboardPage() {
  // Ini akan dihandle oleh middleware, user info ada di headers
  const stats = await getDashboardStats(1); // Untuk sementara, nanti diganti dengan user ID dari session

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        margin: '2rem 0'
      }}>
        <div className="stat-card" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#3498db', marginBottom: '0.5rem' }}>Total Posts</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            {stats.postCount}
          </p>
        </div>

        <div className="stat-card" style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Total Comments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            {stats.commentCount}
          </p>
        </div>
      </div>

      <div className="dashboard-actions" style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <Link href="/posts/create" className="btn">
          Create New Post
        </Link>
        <Link href="/dashboard/posts" className="btn btn-secondary">
          Manage Posts
        </Link>
        <form action="/api/auth/logout" method="POST">
          <button type="submit" className="btn" style={{ backgroundColor: '#95a5a6' }}>
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}