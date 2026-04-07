import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8081',
  withCredentials: true,
});

export const requestBooking = async (bookingData) => {
  const response = await API.post('/api/bookings/request', bookingData);
  return response.data;
};

export const getMyBookings = async () => {
  const response = await API.get('/api/bookings/my');
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await API.post(`/api/bookings/${id}/cancel`);
  return response.data;
};

export const getAllBookings = async (status = '') => {
  const response = await API.get(`/api/bookings/all`, {
    params: { status: status || undefined }
  });
  return response.data;
};

export const reviewBooking = async (id, status, reason) => {
  const response = await API.post(`/api/bookings/${id}/review`, { status, reason });
  return response.data;
};

export default {
  requestBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  reviewBooking,
};
