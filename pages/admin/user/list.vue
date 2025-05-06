<script setup lang="ts">
definePageMeta({
  layout: "admin",
});
import { listUser, deleteUser } from "~/lib/api/user";
import { ref, onMounted } from "vue";
import Button from "~/components/ui/button/Button.vue";
import { useToast } from "@/components/ui/toast/use-toast";
import Toaster from "@/components/ui/toast/Toaster.vue";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  phone: string;
  status: string;
}

const users = ref<User[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = 5;
const { toast } = useToast();

const fetchUsers = async (page: number) => {
  try {
    console.log("haha");
    const response = await listUser(page, limit);
    users.value = response.data;
    totalPages.value = Math.max(response.totalPages, 1);
    console.log("API Response:", response);
    console.log("Total Pages:", totalPages.value);
    toast({
      title: "Thành công",
      description: "Danh sách người dùng",
    });
  } catch (e) {
    console.error("Error loading users:", e);
  }
};

const handlePageChange = async (page: number) => {
  currentPage.value = page;
  await fetchUsers(page);
};

onMounted(() => {
  fetchUsers(1);
});

const handleDeleteUser = async (id: string) => {
  try {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa người dùng này?"
    );
    if (!confirmed) return;

    const response = await deleteUser(id);

    if (response.statusCode == 201) {
      console.log(response.statusCode);
      toast({
        title: "Thành công",
        description: "Xóa người dùng thành công",
      });
      await fetchUsers(currentPage.value);
    } else {
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng",
      });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const handleEditUser = async (id: string) => {
  return navigateTo(`/admin/user/${id}`);
};
</script>

<template>
  <Toaster />
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
  >
    <div class="flex items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#"> Tài khoản </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Danh sách tài khoản</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
  <div>
    <Table>
      <!-- <TableCaption>Danh sách nhân sự</TableCaption> -->
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">STT</TableHead>
          <TableHead>Tên</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Vai trò</TableHead>
          <TableHead>Điện thoại</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Công cụ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(user, index) in users" :key="user._id">
          <TableCell class="font-medium">{{
            (currentPage - 1) * limit + index + 1
          }}</TableCell>
          <TableCell>{{ user.username }}</TableCell>
          <TableCell>{{ user.email }}</TableCell>
          <TableCell>
            <template v-if="user.role === 'admin'"> Quản trị viên </template>

            <template v-else> Người dùng </template>
          </TableCell>
          <TableCell>{{ user.phone ? user.phone : "Chưa đăng ký" }}</TableCell>

          <TableCell>
            {{ user.status ? "Hợp lệ" : "Đã chặn" }}
          </TableCell>

          <TableCell>
            <Button @click="handleDeleteUser(user._id)"> Xóa </Button>
            <Button @click="handleEditUser(user._id)" class="ml-2">
              Sửa
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex items-center justify-center gap-2 py-4">
      <Button
        class="w-10 h-10 p-0"
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        @click="handlePageChange(1)"
      >
        First
      </Button>
      <Button
        class="w-10 h-10 p-0"
        variant="outline"
        size="sm"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        Prev
      </Button>

      <div class="flex items-center gap-1">
        <template v-for="pageNum in totalPages" :key="pageNum">
          <Button
            class="w-10 h-10 p-0"
            size="sm"
            :variant="pageNum === currentPage ? 'default' : 'outline'"
            @click="handlePageChange(pageNum)"
          >
            {{ pageNum }}
          </Button>
        </template>
      </div>

      <Button
        class="w-10 h-10 p-0"
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)"
      >
        Next
      </Button>
      <Button
        class="w-10 h-10 p-0"
        variant="outline"
        size="sm"
        :disabled="currentPage === totalPages"
        @click="handlePageChange(totalPages)"
      >
        Last
      </Button>
      <!-- <Icon name="uil:github" style="color: black" /> -->
    </div>
  </div>
</template>
