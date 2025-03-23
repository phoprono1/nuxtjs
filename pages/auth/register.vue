<script lang="ts">
// Chỉ giữ metadata nếu cần
export const description =
  "A sign up form with first name, last name, email, and password. There's an option to sign up with GitHub and a link to login if you already have an account.";
export const iframeHeight = "600px";
export const containerClass =
  "w-full h-screen flex items-center justify-center px-4";
</script>

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
import { Progress } from "@/components/ui/progress"; // Import Progress
import { ref } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import type { SuccessResponse, ErrorResponse } from "@/interfaces/api/register";
import { useRuntimeConfig } from "nuxt/app"; // Thêm import này

const config = useRuntimeConfig();
const backendUrl = config.public.backendUrl;

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const isLoading = ref(false); // Trạng thái loading

const { toast } = useToast();

const handleRegister = async () => {
  try {
    const username = `${firstName.value} ${lastName.value}`.trim();

    if (!username || !email.value || !password.value) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin.",
        variant: "destructive",
      });
      return;
    }

    isLoading.value = true;

    // Sử dụng backendUrl thay vì URL hardcode
    const { data, error } = await useFetch<SuccessResponse, ErrorResponse>(
      `${backendUrl}/api/user/create`,
      {
        method: "POST",
        body: {
          username,
          email: email.value,
          password: password.value,
        },
      }
    );

    isLoading.value = false;

    console.log("Data:", data.value);
    console.log("Error:", error.value);

    // Kiểm tra lỗi từ server
    if (error.value) {
      // Lấy message từ error.value.data
      const errorMessage =
        error.value.data?.message || "Có lỗi xảy ra khi đăng ký.";
      throw new Error(errorMessage);
    }

    // Kiểm tra dữ liệu thành công
    if (data.value?.statusCode === 201) {
      toast({
        title: "Thành công",
        description: data.value.message || "Tài khoản đã được tạo thành công!",
      });
      firstName.value = "";
      lastName.value = "";
      email.value = "";
      password.value = "";
    } else {
      throw new Error("Phản hồi không mong đợi từ server.");
    }
  } catch (error) {
    isLoading.value = false;
    toast({
      title: "Lỗi",
      description:
        error instanceof Error ? error.message : "Có lỗi xảy ra khi đăng ký.",
      variant: "destructive",
    });
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
              <BreadcrumbLink href="/auth/register">Đăng Ký</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
    <div class="h-full w-full flex items-center justify-center">
      <Card class="w-full max-w-sm bg-zinc-50 dark:bg-zinc-800">
        <CardHeader>
          <CardTitle class="text-2xl"> Đăng Ký </CardTitle>
          <CardDescription class="italic">
            Nhập thông tin của bạn để tạo tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent class="grid gap-4">
          <!-- Hiển thị Progress khi loading -->
          <Progress v-if="isLoading" value="33" class="w-full" />
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="first-name" class="">Họ</Label>
              <Input
                id="first-name"
                v-model="firstName"
                placeholder="Ví dụ: Nguyễn"
                required
              />
            </div>
            <div class="grid gap-2">
              <Label for="last-name" class="">Tên</Label>
              <Input
                id="last-name"
                v-model="lastName"
                placeholder="Ví dụ: Văn A"
                required
              />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email" class="">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="email"
              placeholder="example@gmail.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="password" class="">Mật khẩu</Label>
            <Input id="password" type="password" v-model="password" required />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-4">
          <Button class="w-full" @click="handleRegister">
            {{ isLoading ? "Đang xử lý..." : "Tạo tài khoản" }}
          </Button>
          <Button variant="outline" class="w-full">
            Đăng ký bằng GitHub
          </Button>
          <p class="text-sm text-zinc-400 text-center">
            Đã có tài khoản?
            <NuxtLink to="/auth/login" class="font-bold hover:underline">
              Đăng nhập
            </NuxtLink>
          </p>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
