import { create } from 'zustand';
import axios, { SERVER_URL } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  register: async ({ fullname, username, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await axios.post('/auth/register', { fullname, username, email, password });
      set({ user: data.userData, loading: false });
      toast.success(data.message || "User registered successfully");
    } catch (error) {
      set({ loading: false });
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  login: async ({ username, password }) => {
    set({ loading: true });

    try {
      const { data } = await axios.post('/auth/login', { username, password });
      set({ user: data.userData, loading: false });
      toast.success(data.message || "User login successfully");
    } catch (error) {
      set({ loading: false });
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  checkAuth: async () => {
  set({ checkingAuth: true });
   try {
    const { data } = await axios.get("/auth/me");
    set({ user: data.user, checkingAuth: false });
   } catch (error) {
     console.log(error.message);
     set({ checkingAuth: false, user: null });
   }
  },

  logOut: async () => {
    try {
        await axios.post('/auth/logout');
        set({ user: null });
        toast.success("LogOut SuccesFully.");
    } catch (error) {
        console.log(error);
        toast.error("LogOut Failed.")
    }
  },

  refreshToken: async () => {
		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},

    handleSocialLogin: async (provider) => {
        set({ loading: true });
        try {
            const oAuthUrl = `${SERVER_URL}/auth/${provider}`;
            window.location.href = oAuthUrl;
        } catch (error) {
            console.log(error);
            toast.error("Social login failed. Please try again.");
        }
    }
}));


let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);