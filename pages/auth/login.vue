<script setup lang="ts">
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ref } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { useAuthStore } from "@/stores/auth";

const email = ref("");
const password = ref("");
const isLoading = ref(false);
const { toast } = useToast();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền email và mật khẩu.",
        variant: "destructive",
      });
      return;
    }

    isLoading.value = true;
    await authStore.login(email.value, password.value);

    toast({
      title: "Thành công",
      description: "Đăng nhập thành công!",
    });
    email.value = "";
    password.value = "";
    navigateTo("/admin/dashboard");
  } catch (error) {
    toast({
      title: "Lỗi",
      description:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng nhập.",
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full mx-auto">
    <!-- Header có vị trí sticky -->
    <div class="sticky top-0 z-30 bg-zinc-300 dark:bg-zinc-500 pt-4 pb-4">
      <div
        class="w-full h-16 flex items-center justify-between bg-white dark:bg-zinc-800 z-30 rounded-xl p-4 border-zinc-300"
      >
        <!-- Bên trái - Breadcrumb -->
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Trang Chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/auth/login">Đăng Nhập</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
    <div class="h-full w-full flex items-center justify-center">
      <Card class="w-full max-w-sm bg-zinc-50 dark:bg-zinc-800">
        <CardHeader>
          <CardTitle class="text-2xl">Đăng Nhập</CardTitle>
          <CardDescription class="italic"
            >Nhập email của bạn để đăng nhập vào tài khoản</CardDescription
          >
        </CardHeader>
        <CardContent class="grid gap-4">
          <Progress v-if="isLoading" value="33" class="w-full" />
          <div class="grid gap-2">
            <Label for="email" class="">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="email"
              placeholder="example@gmail.com"
              required
              :disabled="isLoading"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password" class="">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              v-model="password"
              required
              :disabled="isLoading"
            />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-4">
          <Button class="w-full" @click="handleLogin" :disabled="isLoading">
            {{ isLoading ? "Đang xử lý..." : "Đăng nhập" }}
          </Button>
          <p class="text-sm text-zinc-400 text-center">
            Chưa có tài khoản?
            <NuxtLink to="/auth/register" class="hover:underline font-bold"
              >Đăng ký ngay</NuxtLink
            >

            <NuxtLink to="/admin/dashboard" class="hover:underline"
              >Admin</NuxtLink
            >
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
