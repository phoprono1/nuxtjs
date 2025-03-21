<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <Button as-child class="w-full">
    <NuxtLink to="/auth/login">
      Đăng Nhập
    </NuxtLink>
  </Button>
</template>