// stores/auth.ts
import { defineStore } from "pinia";

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
      // Bỏ tham số token vì dùng cookie
      try {
        const response = await $fetch<UserResponse>("/api/user/profile", {
          baseURL: "http://localhost:3005",
          credentials: "include", // Gửi cookie tự động
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
      try {
        const response = await $fetch<LoginResponse>("/api/user/login", {
          baseURL: "http://localhost:3005",
          method: "POST",
          body: { email, password },
          credentials: "include", // Đảm bảo nhận cookie từ backend
        });
        console.log("login response:", response);
        if (response.statusCode === 201) {
          this.token = response.data.token; // Lưu token trong state (không cần localStorage)
          await this.fetchProfile(); // Gọi fetchProfile dùng cookie
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
      try {
        await $fetch("/api/user/logout", {
          baseURL: "http://localhost:3005",
          method: "POST",
          credentials: "include", // Gửi cookie để logout
        });
      } catch (e) {
        console.error("logout failed:", e);
      } finally {
        this.user = null;
        this.token = null;
      }
    },

    // Kiểm tra xem user đã đăng nhập chưa dựa trên cookie
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
