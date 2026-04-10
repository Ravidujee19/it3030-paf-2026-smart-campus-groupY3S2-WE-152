import React, { useState, useEffect } from 'react';
import ticketService from '../../services/ticketService';
import './TicketComments.css';

/**
 * Ticket Comments component with full CRUD operations and ownership rules.
 */
const TicketComments = ({ ticketId, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchComments();
  }, [ticketId]);

  const fetchComments = async () => {
    try {
      const data = await ticketService.getCommentsByTicket(ticketId);
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const commentData = {
        userId: currentUserId,
        content: newComment,
        createdAt: new Date().toISOString()
      };
      await ticketService.addComment(ticketId, commentData);
      setNewComment('');
      fetchComments(); // Refresh thread
    } catch (err) {
      alert('Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await ticketService.deleteComment(commentId, currentUserId);
      fetchComments(); // Refresh thread
    } catch (err) {
      alert('Failed to delete comment. You may not be the owner.');
    }
  };

  const startEditing = (comment) => {
    setEditingId(comment.id);
    setEditValue(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await ticketService.editComment(commentId, { content: editValue });
      setEditingId(null);
      fetchComments(); // Refresh thread
    } catch (err) {
      alert('Failed to update comment.');
    }
  };

  return (
    <div className="comments-section">
      <div className="comments-header">
        <h3>
          Discussion
          <span className="comment-count">{comments.length}</span>
        </h3>
      </div>

      {/* New Comment Input */}
      <div className="comment-input-area">
        <form onSubmit={handlePostComment}>
          <textarea
            className="comment-textarea"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
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

      {/* Comments Thread */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-meta">
              <span className="comment-author">
                User #{comment.userId} {comment.userId === currentUserId && '(You)'}
              </span>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>

            {editingId === comment.id ? (
              <div className="edit-mode-area">
                <textarea
                  className="comment-textarea"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn-action btn-save" onClick={() => handleUpdateComment(comment.id)}>Save Changes</button>
                  <button className="btn-action btn-cancel-edit" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p className="comment-text">{comment.content}</p>
                
                {/* Ownership Rules: Only owner can Edit/Delete */}
                {comment.userId === currentUserId && (
                  <div className="comment-actions">
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => startEditing(comment)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p style={{ color: '#636e72', textAlign: 'center' }}>No comments yet. Start the conversation!</p>
        )}
      </div>
    </div>
  );
};

export default TicketComments;
