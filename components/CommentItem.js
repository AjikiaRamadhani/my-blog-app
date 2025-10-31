'use client';
import { useState, useEffect } from 'react';
import CommentForm from '@/app/posts/[id]/comments/form';

export default function CommentItem({ 
  comment, 
  user, 
  postId, 
  onDeleteComment,
  onCommentAdded,
  level = 0 
}) {
  const [replies, setReplies] = useState([]);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes_count || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);

  // Fetch like status
  useEffect(() => {
    if (user) {
      fetchLikeStatus();
    }
  }, [comment.id, user]);

  // Fetch replies jika ada dan level < 2 (max 2 level nested)
  useEffect(() => {
    if (showReplies && level < 2) {
      fetchReplies();
    }
  }, [showReplies]);

  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(`/api/comments/${comment.id}/like`);
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.liked);
      }
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

  const fetchReplies = async () => {
    try {
      setLoadingReplies(true);
      const response = await fetch(`/api/comments/${comment.id}/replies`);
      
      if (response.ok) {
        const data = await response.json();
        setReplies(data);
      }
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoadingReplies(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Silakan login untuk like komentar');
      return;
    }

    setLoadingLike(true);
    try {
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLikesCount(data.likes_count);
        setIsLiked(data.action === 'liked');
      } else {
        const error = await response.json();
        alert(error.error || 'Gagal memproses like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error memproses like');
    } finally {
      setLoadingLike(false);
    }
  };

  const handleReplyAdded = (newReply) => {
  setReplies(prev => [...prev, newReply]);
  setShowReplyForm(false);
  setShowReplies(true);
};

  const hasReplies = replies.length > 0;

  return (
    <div className={`comment-item ${level > 0 ? 'comment-reply' : ''}`}>
      <div className="comment">
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
            
            {/* Tombol Like */}
            <button
              onClick={handleLike}
              disabled={loadingLike}
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              ❤️ {likesCount > 0 && <span>{likesCount}</span>}
            </button>

            {/* Tombal Reply */}
            {level < 2 && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="reply-btn"
              >
                💬 Balas
              </button>
            )}

            {/* Tombol hapus hanya untuk pemilik komentar atau admin */}
            {user && (user.userId === comment.user_id || user.role === 'admin') && (
              <button
                onClick={() => onDeleteComment(comment.id)}
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

        {/* Reply Form */}
        {showReplyForm && (
          <div className="reply-form-container" style={{ marginTop: '1rem' }}>
            <CommentForm 
              postId={postId} 
              user={user}
              parentId={comment.id}
              onCommentAdded={handleReplyAdded}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {/* Show Replies Toggle */}
        {hasReplies && level < 2 && (
          <div className="replies-toggle" style={{ marginTop: '1rem' }}>
            <button
              onClick={() => setShowReplies(!showReplies)}
              className="show-replies-btn"
            >
              {showReplies ? '▲ Sembunyikan' : '▼ Lihat'} {replies.length || comment.likes_count} balasan
            </button>
          </div>
        )}

        {/* Replies List */}
        {showReplies && level < 2 && (
          <div className="replies-list" style={{ 
            marginLeft: level > 0 ? '2rem' : '1rem',
            marginTop: '1rem',
            borderLeft: level > 0 ? '2px solid #e0e0e0' : 'none',
            paddingLeft: level > 0 ? '1rem' : '0'
          }}>
            {loadingReplies ? (
              <p>Memuat balasan...</p>
            ) : (
              replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  user={user}
                  postId={postId}
                  onDeleteComment={onDeleteComment}
                  onCommentAdded={handleReplyAdded}
                  level={level + 1}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}