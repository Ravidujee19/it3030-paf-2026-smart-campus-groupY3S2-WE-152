import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';
import { useNotificationSocket } from './useNotificationSocket';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Could not update notifications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time updates via Socket
  useNotificationSocket(user?.email, (newNotification) => {
    setNotifications(prev => {
      // Avoid duplicates
      if (prev.some(n => n.id === newNotification.id)) return prev;
      const updated = [newNotification, ...prev];
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  });

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
        setUnreadCount(updated.filter(n => !n.read).length);
        return updated;
      });
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        setUnreadCount(0);
        return updated;
      });
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllRead,
    refresh: fetchNotifications
  };
}
