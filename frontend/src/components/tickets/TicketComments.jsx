import React, { useState, useEffect } from 'react';
import {
  getCommentsByTicket,
  addComment,
  editComment,
  deleteComment,
} from '../../services/ticketService';
import './TicketComments.css';

const TicketComments = ({ ticketId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCommentsByTicket(ticketId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load comments.');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const commentData = {
        text: newCommentText.trim(),
        userId: currentUserId,
      };
      const newComment = await addComment(ticketId, commentData);
      setComments([...comments, newComment]);
      setNewCommentText('');
    } catch (err) {
      setError('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editingText.trim()) return;

    setEditError(null);
    try {
      const updatedComment = await editComment(commentId, {
        text: editingText.trim(),
      });
      setComments(
        comments.map((c) => (c.id === commentId ? updatedComment : c))
      );
      setEditingCommentId(null);
      setEditingText('');
    } catch (err) {
      setEditError('Failed to update comment.');
      console.error('Error editing comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId, currentUserId);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError('Failed to delete comment.');
      console.error('Error deleting comment:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  /**
   * CHECK OWNERSHIP: Only show Edit/Delete if userId === currentUserId
   */
  const canEditComment = (comment) => comment.userId === currentUserId;
  const canDeleteComment = (comment) => comment.userId === currentUserId;

  if (loading) {
    return (
      <div className="comments-section">
        <div className="comments-loading">
          <div className="loading-spinner"></div>
          <p>Loading comments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="comments-section">
      {/* Add New Comment Form */}
      <div className="comment-form-container">
        <div className="form-header">💬 Add a Comment</div>
        {error && <div className="comment-error">{error}</div>}
        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Type your comment here..."
            rows="3"
            className="comment-input"
            disabled={submitting}
          />
          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit-comment"
              disabled={submitting || !newCommentText.trim()}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner"></span> Posting...
                </>
              ) : (
                '✓ Post Comment'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="comments-empty">
            <p>📝 No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="comment-meta">
                  <span className="comment-author">
                    {comment.userName || `User #${comment.userId}`}
                  </span>
                  <span className="comment-time">{formatDate(comment.createdAt)}</span>
                </div>

                {/* OWNERSHIP RULES: show Edit/Delete only if userId === currentUserId */}
                <div className="comment-actions">
                  {canEditComment(comment) && (
                    <button
                      className="btn-edit-comment"
                      onClick={() => {
                        setEditingCommentId(comment.id);
                        setEditingText(comment.text);
                        setEditError(null);
                      }}
                      title="Edit this comment"
                    >
                      ✏️ Edit
                    </button>
                  )}
                  {canDeleteComment(comment) && (
                    <button
                      className="btn-delete-comment"
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Delete this comment"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Comment Body or Edit Form */}
              {editingCommentId === comment.id ? (
                <div className="comment-edit-form">
                  {editError && <div className="edit-error">{editError}</div>}
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="edit-input"
                    rows="3"
                  />
                  <div className="edit-actions">
                    <button
                      className="btn-save-edit"
                      onClick={() => handleEditComment(comment.id)}
                    >
                      ✓ Save
                    </button>
                    <button
                      className="btn-cancel-edit"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingText('');
                        setEditError(null);
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="comment-text">{comment.text}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketComments;
