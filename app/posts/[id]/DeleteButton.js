'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({ postId, postTitle }) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/posts');
        router.refresh(); // Refresh the page data
      } else {
        const error = await response.json();
        alert(error.error || 'Error deleting post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting post');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button 
        className="btn"
        style={{ backgroundColor: '#e74c3c' }}
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete Post'}
      </button>

      {showConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{postTitle}"? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                onClick={handleDelete}
                disabled={loading}
                style={{
                  background: '#e74c3c',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                style={{
                  background: '#95a5a6',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}