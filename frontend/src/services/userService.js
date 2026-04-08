import API from "./authService";

export const updateProfile = async (profileData) => {
  const response = await API.put("/api/users/me", profileData);
  return response.data;
};
