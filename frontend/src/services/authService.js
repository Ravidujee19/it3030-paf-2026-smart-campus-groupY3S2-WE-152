import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

export const getCurrentUser = async () => {
  const response = await API.get("/api/users/me");
  return response.data;
};

export default API;