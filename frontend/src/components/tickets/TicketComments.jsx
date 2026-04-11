import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ticketService from '../../services/ticketService';
import './TicketComments.css';

/**
 * Ticket Comments - Aligned with TicketCommentController.java
 */
const TicketComments = ({ ticketId, currentUserId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const data = await ticketService.getCommentsByTicket(ticketId);
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const commentData = {
        userId: currentUserId,
        content: newComment
      };
      await ticketService.addComment(ticketId, commentData);
      setNewComment('');
      fetchComments(); // Refresh list after successful post
    } catch (err) {
      // Error is already alerted by the service layer
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await ticketService.deleteComment(commentId, currentUserId);
      fetchComments();
    } catch (err) {
      // Error is already alerted by service
    }
  };

  const handleUpdateComment = async (commentId) => {
    if (!editValue.trim()) return;

    try {
      // CRITICAL: Aligned with CommentRequest { userId, content }
      await ticketService.editComment(commentId, { 
        userId: currentUserId, 
        content: editValue 
      });
      setEditingId(null);
      fetchComments();
    } catch (err) {
      // Error is already alerted by service
    }
  };

  /**
   * Ownership Enforcement: Check if user is the author or an Admin
   */
  const canModerate = (comment) => {
    return comment.authorId === currentUserId || user?.role === 'ADMIN';
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>Discussion Thread <span className="comment-count">{comments.length}</span></h3>
      </div>

      <div className="comment-input-area" style={{ background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <form onSubmit={handlePostComment}>
          <textarea
            className="comment-textarea"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
            style={{ color: '#1e293b', background: '#fff' }}
          />
          <button 
            type="submit" 
            className="btn-post-comment"
            disabled={loading || !newComment.trim()}
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      <div className="comments-list">
        {comments.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>No comments yet. Start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
              <div className="comment-meta" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="comment-author" style={{ fontWeight: '700', color: '#6366f1', fontSize: '0.85rem' }}>
                  {comment.authorName} {comment.authorId === currentUserId && '(You)'}
                  {user?.role === 'ADMIN' && comment.authorId !== currentUserId && (
                    <span style={{ color: '#ef4444', marginLeft: '5px' }}>[Moderator]</span>
                  )}
                </span>
                <span className="comment-date" style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {new Date(comment.createdAt).toLocaleString()}
                  {comment.edited && <span style={{ fontStyle: 'italic', marginLeft: '5px' }}>(edited)</span>}
                </span>
              </div>

              {editingId === comment.id ? (
                <div className="edit-mode-area">
                  <textarea
                    className="comment-textarea"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    style={{ color: '#1e293b', background: '#fff', border: '1px solid #6366f1' }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button className="btn-action btn-save" onClick={() => handleUpdateComment(comment.id)}>Save Change</button>
                    <button className="btn-action btn-cancel-edit" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="comment-text" style={{ color: '#334155', fontSize: '0.95rem', lineHeight: '1.5' }}>{comment.content}</p>
                  
                  {canModerate(comment) && (
                    <div className="comment-actions" style={{ borderTop: '1px solid #f1f5f9', marginTop: '12px', paddingTop: '8px', display: 'flex', gap: '15px' }}>
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => { setEditingId(comment.id); setEditValue(comment.content); }}
                        style={{ color: '#6366f1', padding: '0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ color: '#ef4444', padding: '0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketComments;
