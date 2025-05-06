<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "~/components/ui/toast";
import { getUserById, updateUser } from "~/lib/api/user";
import Toaster from "@/components/ui/toast/Toaster.vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const route = useRoute();
const userId = route.params.id as string;

interface UserData {
  username: string;
  password?: string;
  email: string;
  wallet: string;
  address: string;
  phone: string;
  role: string;
  status: string;
}

const userData = ref<UserData>({
  username: "",
  password: "",
  email: "",
  wallet: "",
  address: "",
  phone: "",
  role: "",
  status: "",
});

const userUpdate = ref<Partial<UserProfile>>({});

onMounted(async () => {
  try {
    const response = await getUserById(userId);
    if (response.statusCode === 200) {
      userData.value = { ...response.data };
    }
  } catch (error) {
    toast({
      title: "Lỗi",
      description: "Không thể tải dữ liệu người dùng.",
    });
    console.error("Lỗi tải dữ liệu người dùng:", error);
  }
});

const handleSubmit = async () => {
  try {
    // Lọc bỏ các trường trống trước khi gửi
    const dataToUpdate = Object.fromEntries(
      Object.entries(userData.value).filter(([_, v]) => v !== "")
    );

    await updateUser(userId, dataToUpdate);

    toast({
      title: "Thành công",
      description: "Cập nhật người dùng thành công",
    });
  } catch (error: any) {
    const errorMessage = error.statusMessage || "Không thể cập nhật thông tin.";

    toast({
      title: "Lỗi",
      description: errorMessage,
      duration: 5000,
    });
    console.error("Lỗi cập nhật người dùng:", error);
  }
};

definePageMeta({
  layout: "admin",
});
</script>

<template>
  <Toaster />
  <header class="flex h-16 items-center gap-2 px-4">
    <SidebarTrigger class="-ml-1" />
    <Separator orientation="vertical" class="mr-2 h-4" />
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Tài khoản</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Chỉnh sửa thông tin</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </header>

  <form
    @submit.prevent="handleSubmit"
    class="p-6 bg-white rounded-lg shadow-md space-y-6"
  >
    <div class="flex space-x-4">
      <div class="flex-1">
        <Label for="userName">Tên đăng nhập</Label>
        <Input id="userName" type="text" required v-model="userData.username" />
      </div>
      <div class="flex-1">
        <Label for="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          placeholder="Không thay đổi nếu để trống"
          v-model="userData.password"
        />
      </div>
    </div>

    <div class="flex space-x-4">
      <div class="flex-1">
        <Label for="email">Email</Label>
        <Input id="email" type="email" required v-model="userData.email" />
      </div>
      <div class="flex-1">
        <Label for="address">Địa chỉ</Label>
        <Input id="address" type="text" required v-model="userData.address" />
      </div>
    </div>

    <div class="flex space-x-4">
      <div class="flex-1">
        <Label for="phone">Điện thoại</Label>
        <Input id="phone" type="phone" required v-model="userData.phone" />
      </div>
      <div class="flex-1">
        <Label for="wallet">Ví khách hàng</Label>
        <Input id="wallet" type="text" required v-model="userData.wallet" />
      </div>
    </div>

    <div class="flex space-x-4">
      <div class="flex-1">
        <Label for="status">Trạng thái</Label>
        <Select v-model="userData.status">
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="userData.status || 'Chọn trạng thái'" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="BLOCKED">Bị chặn</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="flex-1">
        <Label for="role">Vai trò</Label>
        <Select v-model="userData.role">
          <SelectTrigger class="w-full">
            <SelectValue :placeholder="userData.role || 'Chọn vai trò'" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="ADMIN">Quản trị viên</SelectItem>
              <SelectItem value="EMPLOYEE">Nhân viên</SelectItem>
              <SelectItem value="MANAGER">Quản lý</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <Button type="submit">Cập nhật</Button>
    </div>
  </form>
</template>
