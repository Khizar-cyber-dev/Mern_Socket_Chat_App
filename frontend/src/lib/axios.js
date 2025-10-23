import axios from "axios";

export const SERVER_URL = import.meta.env.SERVER_URL;

const axiosInstance = axios.create({
	baseURL: `${SERVER_URL}/api`,
	withCredentials: true,
});


export default axiosInstance;