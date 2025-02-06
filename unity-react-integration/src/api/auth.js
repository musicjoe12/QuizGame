import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Your backend URL

// Register User
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

// Login User
export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};
