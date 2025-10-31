'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ postCount: 0, commentCount: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user data
      const userRes = await fetch('/api/auth/me');
      if (userRes.ok) {
        const userData = await userRes.json();
        setUser(userData.user);
        
        if (userData.user) {
          // Fetch stats
          const statsRes = await fetch(`/api/dashboard/stats?userId=${userData.user.id}`);
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p>Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          margin: '2rem auto'
        }}>
          <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Akses Ditolak</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Silakan login untuk mengakses dashboard.
          </p>
          <Link href="/auth/login" className="btn">Masuk</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header dengan ucapan selamat datang dan tombol keluar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1>{user.name}</h1>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>
            Selamat datang kembali, <strong>{user.name}</strong>! 👋
          </p>
        </div>
        <button 
          onClick={handleLogout}
          className="btn"
          style={{ backgroundColor: '#95a5a6' }}
        >
          Keluar
        </button>
      </div>
      
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
          <h3 style={{ color: '#3498db', marginBottom: '0.5rem' }}>Total Cerita</h3>
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
          <h3 style={{ color: '#e74c3c', marginBottom: '0.5rem' }}>Total Komentar</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2c3e50' }}>
            {stats.commentCount}
          </p>
        </div>
      </div>

      <div className="dashboard-actions" style={{
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
        marginTop: '2rem'
      }}>
        <Link href="/posts/create" className="btn">
          📝 Tulis Cerita Baru
        </Link>
        <Link href="/posts" className="btn btn-secondary">
          📚 Lihat Semua Cerita
        </Link>
      </div>

      {/* Recent Activity Section */}
      <section style={{ marginTop: '3rem' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Aktivitas Terbaru</h2>
        <div style={{
          background: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {stats.postCount === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Belum ada cerita yang dibuat.
              </p>
              <Link href="/posts/create" className="btn">
                Mulai Tulis Cerita Pertamamu!
              </Link>
            </div>
          ) : (
            <div>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                🎉 Kamu telah membuat <strong>{stats.postCount}</strong> cerita!
              </p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Terus berkarya dan bagikan pengalamanmu dengan komunitas!
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}