'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      setShowDropdown(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = () => {
    if (user) {
      router.push(`/profile/${user.username}`);
    } else {
      router.push('/auth/login');
    }
    setShowDropdown(false);
  };

  return (
    <header className="header">
      <div className="container">
        <h1 className="logo">
          <Link href="/" onClick={() => setShowDropdown(false)}>
            CeritaKita
          </Link>
        </h1>
        
        <nav className="nav">
          {/* Main Navigation Links */}
          <Link href="/" className="nav-link">
            🏠 Beranda
          </Link>
          <Link href="/posts" className="nav-link">
            📚 Semua Cerita
          </Link>

          {loading ? (
            <span className="nav-loading">Loading...</span>
          ) : user ? (
            // User Menu dengan Dropdown
            <div className="user-menu-container" ref={dropdownRef}>
              <button 
                className="user-menu-trigger"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  👤
                </div>
                <span className="user-name">
                  {user.name}
                </span>
                <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>
                  ▼
                </span>
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  {/* User Info */}
                  <div className="dropdown-user-info">
                    <div className="dropdown-user-name">{user.name}</div>
                    <div className="dropdown-user-email">{user.email}</div>
                    {user.reputation_points && (
                      <div className="dropdown-user-reputation">
                        🏆 {user.reputation_points} Reputasi
                      </div>
                    )}
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Menu Items */}
                  <Link 
                    href={`/profile/${user.username}`} 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    👤 Profil Saya
                  </Link>
                  
                  <Link 
                    href="/posts/create" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    ✏️ Tulis Cerita
                  </Link>
                  
                  <Link 
                    href="/dashboard" 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    📊 Dashboard
                  </Link>

                  <div className="dropdown-divider"></div>

                  {/* Logout */}
                  <button 
                    onClick={handleLogout}
                    className="dropdown-item logout-btn"
                  >
                    🚪 Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Auth Links untuk non-logged in users
            <div className="auth-links">
              <Link href="/auth/login" className="nav-link login-btn">
                Masuk
              </Link>
              <Link href="/auth/register" className="nav-link register-btn">
                Daftar
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}