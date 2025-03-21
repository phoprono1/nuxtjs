// plugins/auth-check.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();

  // Kiểm tra xác thực khi ứng dụng khởi động
  if (process.client) {
    await authStore.checkAuth();
  }

  return {
    provide: {
      authCheck: () => authStore.checkAuth(),
    },
  };
});
