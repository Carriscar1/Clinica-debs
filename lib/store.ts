import { create } from "zustand";
import { Profile } from "./supabase";

type AuthState = {
  profile: Profile | null;
  loading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: true,
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
}));
