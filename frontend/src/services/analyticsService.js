import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
});

export const getAnalyticsSummary = async () => {
  const response = await API.get("/api/analytics/summary");
  return response.data;
};

export default {
  getAnalyticsSummary,
};
