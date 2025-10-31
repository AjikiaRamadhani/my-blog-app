'use client';
import { useState, useEffect } from 'react';
import CommentForm from '@/app/posts/[id]/comments/form';
import CommentItem from './CommentItem';

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
        // Filter hanya komentar utama (tidak ada parent_id)
        const mainComments = data.filter(comment => !comment.parent_id);
        setComments(mainComments);
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
    if (newComment.parent_id) {
      // Jika ini adalah reply, kita perlu refetch untuk mendapatkan struktur yang benar
      fetchComments();
    } else {
      // Jika ini komentar utama, langsung tambahkan
      setComments(prev => [...prev, newComment]);
    }
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
        // Juga hapus dari replies jika ada
        fetchComments(); // Refetch untuk pastikan data konsisten
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
      
      {/* Form Komentar Utama */}
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
            <CommentItem
              key={comment.id}
              comment={comment}
              user={user}
              postId={postId}
              onDeleteComment={handleDeleteComment}
              onCommentAdded={handleCommentAdded}
            />
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