<template>
  <Toaster />
  <div class="w-screen h-screen flex flex-col bg-zinc-50 dark:bg-zinc-800">
    <!-- Header với chiều cao cố định -->
    <Header />

    <!-- Main container chiếm phần còn lại của màn hình -->
    <main class="flex flex-1 overflow-hidden">
      <!-- Sidebar: sử dụng h-full thay vì h-screen -->
      <Sidebar />

      <!-- Nội dung chính: cuộn nếu cần -->
      <div class="flex-1">
        <div class="w-full h-full flex flex-col">
          <!-- Phần nội dung chính không bo tròn ở dưới -->
          <div
            class="flex-1 bg-zinc-300 dark:bg-zinc-500 pr-4 pl-4 rounded-tl-xl"
          >
            <NuxtPage />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Import các component nếu cần
import Toaster from "@/components/ui/toast/Toaster.vue";
import Header from "@/components/Header.vue";
import Sidebar from "~/components/UserSidebar.vue";
</script>
