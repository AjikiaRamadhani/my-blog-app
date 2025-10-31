'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link href="/">My Blog</Link>
        </h1>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/posts">All Posts</Link>
          
          {loading ? (
            <span style={{ color: '#ecf0f1' }}>Loading...</span>
          ) : user ? (
            <>
              <Link href="/posts/create" className="btn-create">Create Post</Link>
              <span style={{ 
                color: '#ecf0f1', 
                marginLeft: '1.5rem',
                fontSize: '0.9rem'
              }}>
                Hello, {user.name}
              </span>
              <Link href="/dashboard" style={{ marginLeft: '1rem' }}>Dashboard</Link>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  marginLeft: '1.5rem'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login">Login</Link>
              <Link href="/auth/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}