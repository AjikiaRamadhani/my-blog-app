'use client';
import { useState, useEffect } from 'react';
import CommentForm from '@/app/posts/[id]/comments/form';

export default function CommentsSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments?postId=${postId}`);
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Gagal memuat komentar');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Error memuat komentar');
    } finally {
      setLoading(false);
    }
  };

  const handleCommentAdded = (newComment) => {
    setComments(prev => [...prev, newComment]);
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal menghapus komentar');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error menghapus komentar');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  if (loading) {
    return (
      <section className="comments-section">
        <h3>Komentar</h3>
        <p>Memuat komentar...</p>
      </section>
    );
  }

  return (
    <section className="comments-section">
      <h3>Komentar ({comments.length})</h3>
      
      {/* Form Komentar */}
      <CommentForm 
        postId={postId} 
        user={user}
        onCommentAdded={handleCommentAdded}
      />

      {/* Daftar Komentar */}
      {error && (
        <div style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '1rem', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <div className="comment-author">
                  <strong>
                    {comment.author_name || 'Anonim'}
                    {comment.user_id && <span className="user-badge">👤</span>}
                  </strong>
                </div>
                <div className="comment-actions">
                  <span className="comment-date">
                    {new Date(comment.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {/* Tombol hapus hanya untuk pemilik komentar atau admin */}
                  {user && (user.userId === comment.user_id || user.role === 'admin') && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="delete-comment-btn"
                      title="Hapus komentar"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#666',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <p>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
        </div>
      )}
    </section>
  );
}