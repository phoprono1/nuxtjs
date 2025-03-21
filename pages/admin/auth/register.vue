<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress' // Import Progress
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import type { SuccessResponse, ErrorResponse } from '@/interfaces/api/register'
import { Toaster } from '@/components/ui/toast'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const isLoading = ref(false) // Trạng thái loading

const { toast } = useToast()

const handleRegister = async () => {
  try {
    const username = `${firstName.value} ${lastName.value}`.trim()

    if (!username || !email.value || !password.value) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin.',
        variant: 'destructive',
      })
      return
    }

    isLoading.value = true

    // Dùng generic type với interfaces từ file riêng
    const { data, error } = await useFetch<SuccessResponse, ErrorResponse>('http://localhost:3005/api/user/create', {
      method: 'POST',
      body: {
        username,
        email: email.value,
        password: password.value,
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
        description: data.value.message || 'Tài khoản đã được tạo thành công!',
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

definePageMeta({
  layout: 'empty'
})
</script>

<template>
  <Toaster />
  <div class="h-full w-full flex items-center justify-center">
    <form class="p-2 space-y-2" @submit.prevent="handleRegister">
    <Card class="w-full max-w-sm ">
      <CardHeader>
        <CardTitle class="text-2xl ">
          Đăng Ký
        </CardTitle>
        <CardDescription>
          Nhập thông tin của bạn để tạo tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent class="grid gap-4">
        <!-- Hiển thị Progress khi loading -->
        <Progress v-if="isLoading" value="33" class="w-full" />
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="first-name" class="">Họ</Label>
              <Input id="first-name" v-model="firstName" placeholder="Ví dụ: Nguyễn" required />
            </div>
            <div class="grid gap-2">
              <Label for="last-name" class="">Tên</Label>
              <Input id="last-name" v-model="lastName" placeholder="Ví dụ: Văn A" required />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email" class="">Email</Label>
            <Input id="email" type="email" v-model="email" placeholder="example@gmail.com" required />
          </div>
          <div class="grid gap-2">
            <Label for="password" class="">Mật khẩu</Label>
            <Input id="password" type="password" v-model="password" required />
          </div>
        </CardContent>
        <CardFooter class="flex flex-col gap-4">
          <Button class="w-full">
       Tạo tài khoản
        </Button>
        <Button variant="outline" class="w-full">
          Đăng ký bằng GitHub
        </Button>
        <p class="text-sm text-center">
          Đã có tài khoản?
          <NuxtLink to="/admin/auth/login" class=" hover:underline">
            Đăng nhập
          </NuxtLink>
        </p>
      </CardFooter>
    </Card>
  </form>
  </div>
</template>
