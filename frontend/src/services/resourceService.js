import axios from 'axios';

const API_URL = 'http://localhost:8081/api/resources';

// We fetch the JWT token if necessary (assuming a getAuthToken util or we can just pass it directly if we rely on interceptors, but I'll add header just in case)
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getResources = async (params = {}) => {
    const response = await axios.get(API_URL, {
        params,
        headers: getAuthHeaders()
    });
    return response.data;
};

export const getResourceById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const createResource = async (resource) => {
    const response = await axios.post(API_URL, resource, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const updateResource = async (id, resource) => {
    const response = await axios.put(`${API_URL}/${id}`, resource, {
        headers: getAuthHeaders()
    });
    return response.data;
};

export const deleteResource = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeaders()
    });
    return response.data;
};
