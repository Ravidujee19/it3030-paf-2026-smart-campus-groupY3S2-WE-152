import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import './NotificationDropdown.css';

const Icons = {
  Bell: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  Empty: () => (
    <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ opacity: 0.2 }}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  )
};

export default function NotificationDropdown({ userRole }) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkRead = async (e, id) => {
    e.stopPropagation(); // Don't trigger dropdown click
    await markAsRead(id);
    setIsOpen(false); // Requirement: Close automatically
  };

  const handleViewAll = () => {
    setIsOpen(false);
    const basePath = userRole === 'ADMIN' ? '/admin' : '/staff';
    navigate(`${basePath}/notifications`);
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMin = Math.floor((now - date) / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notif-dropdown-wrapper" ref={dropdownRef}>
      <button 
        className={`notif-bell-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        title="Notifications"
      >
        <Icons.Bell />
        {unreadCount > 0 && <span className="notif-badge-dot">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-dropdown-panel animate-slide-in">
          <div className="notif-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-link" onClick={markAllRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notif-dropdown-content custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="notif-empty-state">
                <Icons.Empty />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 5).map(notif => (
                <div 
                  key={notif.id} 
                  className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                >
                  <div className="notif-item-header">
                    <span className={`notif-type-tag ${notif.type.toLowerCase()}`}>
                      {notif.type}
                    </span>
                    <span className="notif-time">{getTimeAgo(notif.createdAt)}</span>
                  </div>
                  <h4 className="notif-item-title">{notif.title}</h4>
                  <p className="notif-item-msg">{notif.message}</p>
                  
                  {!notif.read && (
                    <button 
                      className="inline-mark-read" 
                      onClick={(e) => handleMarkRead(e, notif.id)}
                      title="Mark as read"
                    >
                      <Icons.Check />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="notif-dropdown-footer">
            <button className="view-all-btn" onClick={handleViewAll}>
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
