import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = { 
  token: string | null; 
  setToken: (t: string) => void; 
  logout: () => void; 
  isAuthenticated: () => boolean;
};

export const useAuthStore = create<AuthState>()(  
  persist(
    (set, get) => ({
      token: null,
      setToken: (t: string) => {
        localStorage.setItem("token", t);
        set({ token: t });
      },
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("personaId");
        set({ token: null });
      },
      isAuthenticated: () => {
        const token = get().token;
        if (!token) return false;
        
        try {
          // Verificar si el token no ha expirado
          const payload = JSON.parse(atob(token.split('.')[1]));
          const now = Date.now() / 1000;
          return payload.exp > now;
        } catch {
          return false;
        }
      }
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
