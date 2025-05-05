import { defineStore } from "pinia";
import { useRuntimeConfig } from "nuxt/app"; // Thêm import này

interface UserResponse {
  statusCode: number;
  message: string;
  data: {
    id: string;
    role: string;
    username: string;
  };
}

interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    token: string;
  };
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as UserResponse["data"] | null,
    token: null as string | null,
  }),
  actions: {
    async fetchProfile() {
      const config = useRuntimeConfig(); // Lấy runtimeConfig
      try {
        const response = await $fetch<UserResponse>("/api/user/profile", {
          baseURL: config.public.backendUrl as string, // Sử dụng backendUrl từ runtimeConfig
          credentials: "include",
        });
        console.log("fetchProfile response:", response);
        this.user = response.statusCode === 200 ? response.data : null;
      } catch (e) {
        console.error("fetchProfile failed:", e);
        this.user = null;
        throw e;
      }
    },
    async login(email: string, password: string) {
      const config = useRuntimeConfig(); // Lấy runtimeConfig
      try {
        const response = await $fetch<LoginResponse>("/api/user/login", {
          baseURL: config.public.backendUrl as string, // Sử dụng backendUrl từ runtimeConfig
          method: "POST",
          body: { email, password },
          credentials: "include",
        });
        console.log("login response:", response);
        if (response.statusCode === 201) {
          this.token = response.data.token;
          await this.fetchProfile();
          console.log("login completed, user:", this.user);
        }
      } catch (e: any) {
        console.error("login failed:", e);
        this.token = null;
        this.user = null;
        throw new Error(e.data?.message || "Có lỗi xảy ra khi đăng nhập.");
      }
    },
    async logout() {
      const config = useRuntimeConfig(); // Lấy runtimeConfig
      try {
        await $fetch("/api/user/logout", {
          baseURL: config.public.backendUrl as string, // Sử dụng backendUrl từ runtimeConfig
          method: "POST",
          credentials: "include",
        });
        console.log("logout response:", "Logout successful");
      } catch (e) {
        console.error("logout failed:", e);
      } finally {
        this.user = null;
        this.token = null;
      }
    },
    async checkAuth() {
      if (!this.user) {
        try {
          await this.fetchProfile();
        } catch (e) {
          this.token = null;
          this.user = null;
        }
      }
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
});