'use client';
import { useState } from 'react';

export default function CommentForm({ 
  postId, 
  user, 
  parentId = null,
  onCommentAdded,
  onCancel 
}) {
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
          content: content.trim(),
          parent_id: parentId
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
    <div className="comment-form-container" style={{ marginBottom: '1rem' }}>
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="form-group">
          <label htmlFor="comment-content">
            {parentId ? 'Balas sebagai' : 'Tambah Komentar sebagai'} <strong>{user.name}</strong>
          </label>
          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={parentId ? "Tulis balasan Anda..." : "Tulis komentar Anda di sini..."}
            rows="3"
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

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            type="submit" 
            disabled={loading || !content.trim()}
            className="btn"
            style={{ fontSize: '0.9rem' }}
          >
            {loading ? 'Mengirim...' : (parentId ? 'Kirim Balasan' : 'Kirim Komentar')}
          </button>
          
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              style={{ fontSize: '0.9rem' }}
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
}