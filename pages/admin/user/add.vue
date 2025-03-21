<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Toaster from '@/components/ui/toast/Toaster.vue'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast';
import type { SuccessResponse, ErrorResponse } from '~/interfaces/api/register'
import { API_ENDPOINTS } from '~/lib/api/constants'

definePageMeta({
  layout: 'admin'
})

const username = ref('')
const email = ref('')
const password = ref('')
const address = ref('')
const phone = ref('')
const role = ref('')
const isLoading = ref(false)

const { toast } = useToast()

const handleRegister = async () => {
  try {
    if (!username.value || !email.value || !password.value || !address.value || !phone.value) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin.',
        variant: 'destructive',
      })
      return
    }
    isLoading.value = true
    const { data, error } = await useFetch<SuccessResponse, ErrorResponse>(API_ENDPOINTS().USER_CREATE, {
      method: 'POST',
      body: {
        username: username.value,
        password: password.value, 
        email: email.value,
        address: address.value,
        phone: phone.value,
        role: role.value,
      },
    })
    isLoading.value = false
    console.log('Data:', data.value)
    console.log('Error:', error.value)

    // Kiểm tra lỗi từ server
    if (error.value) {
      // Lấy message từ error.value.data
      const errorMessage = error.value.data?.message || 'Có lỗi xảy ra khi đăng ký.'
      throw new Error(errorMessage)
    }

    // Kiểm tra dữ liệu thành công
    if (data.value?.statusCode === 201) {
      toast({
        title: 'Thành công',
        description: 'Tài khoản đã được tạo thành công!',
      })
    } else {
      throw new Error('Phản hồi không mong đợi từ server.')
    }
  } catch (error) {
    isLoading.value = false
    toast({
      title: 'Lỗi',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng ký.',
      variant: 'destructive',
    })
  }
}

</script>

<template>  
<Toaster />
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    <div class="flex items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#">
              Tài khoản
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Thêm tài khoản</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
  <form class="p-6 bg-white rounded-lg shadow-md space-y-2" @submit.prevent="handleRegister"> 
    <div class="flex space-x-4">
      <!-- User Name -->
      <div class="flex-1">
        <Label for="userName" class="text-sm font-medium text-gray-700">Tên tài khoản</Label>
        <Input v-model="username" id="userName" type="text" required placeholder="Nhập tên tài khoản" class="w-full" />
      </div>

      <div class="flex-1">
        <Label for="password" class="text-sm font-medium text-gray-700">Mật khẩu</Label>
        <Input v-model="password" id="password" type="password" placeholder="Nhập mật khẩu" class="w-full" />
      </div>

    </div>

    <div class="flex space-x-4">
      <div class="flex-1">
        <Label for="email" class="text-sm font-medium text-gray-700">Email</Label>
        <Input v-model="email" id="email" type="email" placeholder="Nhập email" class="w-full" />
      </div>

      <div class="flex-1">
        <Label for="depart" class="text-sm font-medium text-gray-700">Địa chỉ</Label>
        <Input v-model="address" id="address" type="address" placeholder="Nhập địa chỉ" class="w-full" />
      </div>
    </div>

    <div class="flex space-x-4">
      <div class="flex-1">
        <Label for="role" class="text-sm font-medium text-gray-700">Vai trò</Label>
        <Select v-model="role">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Lựa chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Vai trò</SelectLabel>
              <SelectItem value="admin">
                Quản trị viên
              </SelectItem>

              <SelectItem value="user">
                Người dùng 
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div class="flex-1">
        <Label for="depart" class="text-sm font-medium text-gray-700">Điện thoại</Label>
        <Input v-model="phone" id="phone" type="phone" placeholder="Nhập số điện thoại" class="w-full" />
      </div>
    </div>

    <div class="flex justify-center">
      <Button >
        Tạo tài khoản
      </Button>
    </div>
  </form>
</template>
