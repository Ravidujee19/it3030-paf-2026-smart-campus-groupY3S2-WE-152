import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../services/notificationService';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';
import './NotificationsPage.css';

function BellIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function CheckAllIcon() {
  return (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const TYPE_CONFIG = {
  SUCCESS: { label: 'Success', color: '#10b981', bg: '#d1fae5', icon: '✓' },
  ERROR:   { label: 'Error',   color: '#ef4444', bg: '#fee2e2', icon: '✗' },
  WARNING: { label: 'Warning', color: '#f59e0b', bg: '#fef3c7', icon: '!' },
  INFO:    { label: 'Info',    color: '#3b82f6', bg: '#dbeafe', icon: 'i' },
};

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || TYPE_CONFIG.INFO;
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr  = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60)  return 'just now';
  if (diffMin < 60)  return `${diffMin}m ago`;
  if (diffHr < 24)   return `${diffHr}h ago`;
  if (diffDay < 7)   return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

function NotificationCard({ notification, onMarkRead }) {
  const cfg = getTypeConfig(notification.type);

  return (
    <div className={`notif-card ${notification.read ? 'notif-card--read' : 'notif-card--unread'}`}>
      {/* Left: type indicator */}
      <div
        className="notif-type-dot"
        style={{ background: cfg.color }}
        title={cfg.label}
      >
        {cfg.icon}
      </div>

      {/* Middle: content */}
      <div className="notif-body">
        <div className="notif-header-row">
          <span
            className="notif-badge"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {cfg.label}
          </span>
          <span className="notif-time">{timeAgo(notification.createdAt)}</span>
        </div>
        <p className="notif-title">{notification.title}</p>
        <p className="notif-message">{notification.message}</p>
      </div>

      {/* Right: action */}
      {!notification.read && (
        <button
          className="notif-read-btn"
          onClick={() => onMarkRead(notification.id)}
          title="Mark as read"
        >
          Mark read
        </button>
      )}

      {/* Unread indicator dot */}
      {!notification.read && <span className="notif-unread-dot" />}
    </div>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); 

  const unreadCount = notifications.filter(n => !n.read).length;
  const fetchNotifications = useCallback(async () => {
    try {
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  useNotificationSocket(user?.email, (newNotification) => {
    setNotifications(prev => {
      if (prev.some(n => n.id === newNotification.id)) return prev;
      return [newNotification, ...prev];
    });
  });

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read')   return n.read;
    return true;
  });

  return (
    <div className="notif-page">
      {/* Header */}
      <div className="notif-page-header">
        <div className="notif-title-row">
          <div className="notif-title-icon">
            <BellIcon />
          </div>
          <div>
            <h1 className="notif-page-title">Notifications</h1>
            <p className="notif-page-subtitle">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up — no unread notifications'}
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button className="notif-mark-all-btn" onClick={handleMarkAllRead}>
            <CheckAllIcon />
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="notif-filter-tabs">
        {['all', 'unread', 'read'].map(f => (
          <button
            key={f}
            className={`notif-filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'unread' && unreadCount > 0 && (
              <span className="notif-tab-badge">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="notif-list-container">
        {loading && (
          <div className="notif-state-box">
            <div className="notif-spinner" />
            <p>Loading notifications…</p>
          </div>
        )}

        {!loading && error && (
          <div className="notif-state-box notif-state--error">
            <span className="notif-state-icon">⚠</span>
            <p>{error}</p>
            <button className="notif-retry-btn" onClick={fetchNotifications}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredNotifications.length === 0 && (
          <div className="notif-state-box">
            <span className="notif-state-icon notif-state-icon--empty">🔔</span>
            <p className="notif-empty-title">No notifications here</p>
            <p className="notif-empty-sub">
              {filter === 'unread'
                ? 'You have no unread notifications.'
                : filter === 'read'
                ? 'You have no read notifications yet.'
                : 'Notifications will appear here when you receive them.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredNotifications.length > 0 && (
          <div className="notif-list">
            {filteredNotifications.map(n => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
