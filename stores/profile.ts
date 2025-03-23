// stores/profile.ts
import { defineStore } from "pinia";
import { useRuntimeConfig } from "nuxt/app"; // Thêm import này để lấy runtimeConfig

// Interface cho thông tin người dùng (dựa trên API /api/user/me)
export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  wallet: string;
  address: string;
  phone: string;
  tokenBalance: number;
  role: "user" | "admin" | "user-silver" | "user-gold" | "user-diamond";
  status: "active" | "banned";
  createdAt: string;
  updatedAt: string;
}

// Interface cho phản hồi từ API (BaseResponse)
interface BaseResponse<T> {
  statusCode: number;
  message: string; 
  data: T;
}

// Định nghĩa store
export const useProfileStore = defineStore("profile", {
  state: () => ({
    user: null as UserProfile | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUserProfile() {
      const config = useRuntimeConfig(); // Lấy runtimeConfig
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<BaseResponse<UserProfile>>(
          "/api/user/me",
          {
            baseURL: config.public.backendUrl as string, // Sử dụng backendUrl từ runtimeConfig
            method: "GET",
            credentials: "include", // Gửi cookie tự động
          }
        );

        this.user = response.data;
      } catch (error: any) {
        this.error = error.data?.message || "Failed to fetch user profile";
        this.user = null;
      } finally {
        this.loading = false;
      }
    },

    resetProfile() {
      this.user = null;
      this.error = null;
      this.loading = false;
    },
  },

  getters: {
    isProfileLoaded: (state) => !!state.user,
    userRole: (state) => state.user?.role || "user",
  },
});