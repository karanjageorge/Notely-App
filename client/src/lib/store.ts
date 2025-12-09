/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface AuthState {
  user: any | null;
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  setToken: (token) => {
    set({ token, isAuthenticated: true });
    localStorage.setItem("token", token);
  },

  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
}));
