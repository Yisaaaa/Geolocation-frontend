import { api } from "@/lib/api";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  initAuth: () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      set({
        user: JSON.parse(storedUser),
        token: storedToken,
        isLoading: false,
      });
    } else {
      set({ isLoading: false }); // No user is logged in
    }
  },

  login: async (email: string, password: string) => {
    const response = await api.post("/login", { email, password });
    console.log(response);
    const { token, user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ token, user, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({ user: null, token: null });
  },
}));
