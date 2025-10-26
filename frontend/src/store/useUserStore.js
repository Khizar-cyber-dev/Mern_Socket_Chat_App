import { create } from 'zustand';
import axios, { SERVER_URL } from '../lib/axios';
import { toast } from 'react-hot-toast';

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  AllUsers: null,

  register: async ({ fullname, username, email, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
      set({ loading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const { data } = await axios.post('/auth/register', { fullname, username, email, password });
      set({ user: data.userData, loading: false, checkingAuth: false });
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
      set({ user: data.userData, loading: false, checkingAuth: false });
      toast.success(data.message || "User login successfully");
    } catch (error) {
      set({ loading: false });
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  checkAuth: async () => {
  const { user } = get();
  if (user) return;

  set({ checkingAuth: true });

  try {
    const { data } = await axios.get("/auth/me");
    set({ user: data.user, checkingAuth: false });
  } catch (error) {
    set({ checkingAuth: false, user: null });
  }
},


  allUsers: async () => {
    try {
      set({ loading: true });
      const { data } = await axios.get("/auth/allUsers");
      set({ AllUsers: data.users, loading: false });
    } catch (error) {
      console.log(error.message);
      set({ loading: false, AllUsers: null });
    }
  },

  logOut: async () => {
    try {
        await axios.post('/auth/logout');
        set({ user: null, checkingAuth: false, users: null });
        toast.success("LogOut SuccesFully.");
    } catch (error) {
        console.log(error);
        toast.error("LogOut Failed.")
    }
  },

  refreshToken: async () => {
  try {
    const response = await axios.post("/auth/refresh-token");
    return response.data;
  } catch (error) {
    set({ user: null });
    throw error;
  }
},

    handleSocialLogin: async (provider) => {
        set({ loading: true });
        try {
            const oAuthUrl = `${SERVER_URL}/api/auth/${provider}`;
            window.location.href = oAuthUrl;
        } catch (error) {
            console.log(error);
            toast.error("Social login failed. Please try again.");
        }
    }
}));


let refreshPromise = null;

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      try {
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalReq);
        }

        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalReq);
      } catch (err) {
        useUserStore.getState().logOut();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);