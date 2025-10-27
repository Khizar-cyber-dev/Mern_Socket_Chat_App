import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import axios from '../lib/axios';
import { toast } from 'react-hot-toast';

const useUserStore = create(devtools(
  (set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,
  allUsersData: [],

  setUser: (userData) => {
    set({ user: userData });
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
  },

  register: async (credentials) => {
    set({ loading: true });
    try {
      const { data } = await axios.post("/auth/register", credentials);
      get().setUser(data.userData);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
    set({ loading: false, checkingAuth: false });
  },

  login: async ({ username, password }) => {
    set({ loading: true });
    try {
      const { data } = await axios.post("/auth/login", { username, password });
      get().setUser(data.userData);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
    set({ loading: false, checkingAuth: false });
  },

  checkAuth: async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }

    try {
      const { data } = await axios.get("/auth/me");
      get().setUser(data.user);
    } catch {
      get().setUser(null);
    }

    set({ checkingAuth: false });
  },

  fetchAllUsers: async () => {
    try {
      const { data } = await axios.get("/auth/allUsers");
      set({ allUsersData: data.users });
      console.log(data.users);
    } catch {
      set({ allUsersData: [] });
      console.log("Other users not found");
    }
  },

  logOut: async () => {
    try {
      await axios.post("/auth/logout");
    } catch {}

    get().setUser(null);
    set({
      checkingAuth: false,
      loading: false,
      allUsersData: [],
    });

    toast.success("Logged out successfully");
  },

  refreshToken: async () => {
    try {
      const { data } = await axios.post("/auth/refresh-token");
      return data;
    } catch (err) {
      get().setUser(null);
      set({ checkingAuth: false });
      throw err;
    }
  },
})));

let refreshPromise = null;

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalReq = error.config;

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      if (originalReq.url.includes("/auth/me")) {
        useUserStore.getState().setUser(null);
        useUserStore.setState({ checkingAuth: false });
        return Promise.reject(error);
      }

      try {
        if (!refreshPromise) {
          refreshPromise = useUserStore.getState().refreshToken();
        }
        await refreshPromise;
        refreshPromise = null;
        return axios(originalReq);
      } catch (err) {
        refreshPromise = null;
        useUserStore.getState().logOut();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { useUserStore };


// Enable devtools in development
if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('UserStore', useUserStore);
}