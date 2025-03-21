<script setup lang="ts">
definePageMeta({
  layout: "empty",
});
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { Toaster } from '@/components/ui/toast'
import { useToast } from '@/components/ui/toast/use-toast'
import { NuxtLink } from '#components';
const email = ref('')
const password = ref('')
const isLoading = ref(false);
const { toast } = useToast();
const authStore = useAuthStore();

const handleLogin = async () => {
  try {
    if (!email.value || !password.value) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền email và mật khẩu.',
        variant: 'destructive',
      });
      return;
    }

    isLoading.value = true;
    await authStore.login(email.value, password.value);

    toast({
      title: 'Thành công',
      description: 'Đăng nhập thành công!',
    });
    email.value = '';
    password.value = '';
    navigateTo('/admin/dashboard');
  } catch (error) {
    toast({
      title: 'Lỗi',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng nhập.',
      variant: 'destructive',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>


<template>
  <Toaster />
  <!-- <form @submit.prevent="submit"> -->
  <Card class="mx-auto">
    <CardHeader>
      <CardTitle class="text-2xl">
        Đăng Nhập
      </CardTitle>
      <CardDescription>
        Nhập email và mật khẩu để đăng nhập vào hệ thống
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Nhập Email</Label>
          <Input v-model="email" id="email" type="text" placeholder="m@example.com" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Mật khẩu</Label>
            <a href="#" class="ml-auto inline-block text-sm underline">
              Quên mật khẩu
            </a>
          </div>
          <Input v-model="password" id="password" type="password" required />
        </div>
        <Button @click="handleLogin" type="submit" class="w-full">
          Đăng nhập
        </Button>

      </div>
      <div class="mt-4 text-center text-sm">
        Chưa có tài khoản?
        <NuxtLink to="/admin/auth/register" class="underline">
          Đăng ký
        </NuxtLink>
      </div>
    </CardContent>
  </Card>

</template>
