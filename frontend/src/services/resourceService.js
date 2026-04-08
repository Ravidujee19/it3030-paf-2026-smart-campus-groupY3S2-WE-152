import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

export const getAllResources = async (filters = {}) => {
  const { type, capacity, location } = filters;
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  if (capacity) params.append("capacity", capacity);
  if (location) params.append("location", location);

  const response = await API.get(`/api/resources?${params.toString()}`);
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await API.get(`/api/resources/${id}`);
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await API.post("/api/resources", resourceData);
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await API.put(`/api/resources/${id}`, resourceData);
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await API.delete(`/api/resources/${id}`);
  return response.data;
};

export default {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
