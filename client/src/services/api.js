import axios from "axios";

const API_URL = "http://localhost:5002/api";

// Create an axios instance with default headers
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication
export const register = (userData) => api.post("/auth/register", userData);
export const login = (credentials) => api.post("/auth/login", credentials);

// User
export const getUserDetails = () => api.get("/user/details");
export const updateUserDetails = (userData) => api.put("/user", userData);
export const deleteUserAccount = () => api.delete("/user");

// Audio
export const getUserAudios = () => api.get("/audio/list");
export const getAudioDetails = (audioId) => api.get(`/audio/${audioId}`);
export const updateAudioDetails = (audioId, updateData) =>
  api.put(`/audio/${audioId}`, updateData);
export const uploadAudio = (formData) =>
  api.post("/audio/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const deleteAudio = (audioId) => api.delete(`/audio/${audioId}`);
export const getAudioStream = (audioId) => {
  const token = localStorage.getItem("token");
  const url = `${API_URL}/audio/stream/${audioId}`;
  console.log("Audio stream URL:", url);
  return {
    url,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// This function can be used to get the audio file for playback
export const getAudioFile = (audioId) => `${API_URL}/audio/play/${audioId}`;

export default api;
