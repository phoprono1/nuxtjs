<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/components/ui/toast/use-toast'
import { ref } from 'vue';

const isLoading = ref(false);
const authStore = useAuthStore();
const handleLogout = async () => {
  try {
    isLoading.value = true;
    await authStore.logout();

    toast({
      title: 'Thành công',
      description: 'Đăng xuất thành công!',
    });
    navigateTo('/');
  } catch (error) {
    toast({
      title: 'Lỗi',
      description: error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng xuất.',
      variant: 'destructive',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <Button @click="handleLogout" :disabled="isLoading" variant="outline" class="w-full bg-rose-600 text-white">
    {{ isLoading ? 'Đang xử lý...' : 'Đăng Xuất' }}
  </Button>
</template>