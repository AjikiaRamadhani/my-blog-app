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

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link href="/">CeritaKita</Link>
        </h1>
        <nav className="nav">
          <Link href="/">Beranda</Link>
          <Link href="/posts">Semua Cerita</Link>
          
          {loading ? (
            <span style={{ color: '#ecf0f1' }}>Loading...</span>
          ) : user ? (
            <Link href="/dashboard">Akun</Link>
          ) : (
            <>
              <Link href="/auth/login">Masuk</Link>
              <Link href="/auth/register">Daftar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}