'use client';
import { useState } from 'react';

export default function CommentForm({ postId, user, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Komentar tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          content: content.trim()
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setContent('');
        onCommentAdded(data.comment);
      } else {
        setError(data.error || 'Gagal menambahkan komentar');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error menambahkan komentar');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div style={{ 
        background: '#f8f9fa', 
        padding: '1.5rem', 
        borderRadius: '8px',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Silakan <a href="/auth/login" style={{ color: '#3498db' }}>login</a> untuk menambahkan komentar
        </p>
      </div>
    );
  }

  return (
    <div className="comment-form-container" style={{ marginBottom: '2rem' }}>
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="comment-content">
            Tambah Komentar sebagai <strong>{user.name}</strong>
          </label>
          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis komentar Anda di sini..."
            rows="4"
            required
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'inherit',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>

        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '0.5rem', 
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading || !content.trim()}
          className="btn"
          style={{ fontSize: '0.9rem' }}
        >
          {loading ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
      </form>
    </div>
  );
}