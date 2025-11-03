import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserType = "client" | "driver";

interface UserData {
  _id: string;
  name: string;
  email: string;
  city: string;
  phone: string;
  typeUser: UserType;
  photoProfile: string;
  googleId: string;
  acceptedTerms: boolean;
}

interface AuthStore {
  isAuthenticated: boolean;
  userData: UserData | null;
  token: string | null;
  login: (userData: UserData, token: string) => void;
  logout: () => void;
  updateUserData: (userData: UserData) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userData: null,
      token: null,

      login: (userData, token) =>
        set({ isAuthenticated: true, userData, token }),

      logout: () =>
        set({ isAuthenticated: false, userData: null, token: null }),
      
      updateUserData: (userData) => set((state) => ({ ...state, userData })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
