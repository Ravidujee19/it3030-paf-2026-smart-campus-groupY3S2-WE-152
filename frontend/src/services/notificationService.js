import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true,
});

export const getNotifications = async () => {
  const response = await API.get('/api/notifications');
  return response.data;
};


export const markNotificationAsRead = async (id) => {
  const response = await API.put(`/api/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await API.put('/api/notifications/read-all');
  return response.data;
};

export default {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
