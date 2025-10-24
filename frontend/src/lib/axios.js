import axios from "axios";

export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
	withCredentials: true,
});


export default axiosInstance;