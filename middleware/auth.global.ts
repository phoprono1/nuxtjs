// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  console.log("Middleware bắt đầu chạy"); // Kiểm tra xem middleware có được gọi không
  
  // Chỉ chạy ở phía client
  if (import.meta.client) {
    console.log("Đang chạy trên client");

    const authStore = useAuthStore();
    console.log("Middleware running for route:", to.path);
    console.log("Auth state:", authStore.isLoggedIn);

    const isAuthRoute = to.path.includes("/auth/");
    if (isAuthRoute && authStore.isLoggedIn) {
      console.log("User is logged in, redirecting from auth page");
      return navigateTo("/");
    }
  }
});
