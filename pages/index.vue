<script setup lang="ts">
import { ref } from 'vue'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import MainPages from '@/components/contents/MainPages.vue'
import FollowedPages from '@/components/contents/FollowedPages.vue'
// Theo dõi tab hiện tại
const activeTab = ref('main')
</script>

<template>
  <div class="w-full h-full">
    <Tabs v-model="activeTab" default-value="main" class="w-full h-full">
      <!-- Header có vị trí fixed -->
      <div class="sticky top-0 z-30 bg-zinc-300 dark:bg-zinc-500 pt-4 pb-2">
        <div
          class="w-full flex items-center justify-between bg-white dark:bg-zinc-800 z-30 rounded-xl px-4 py-2 border-zinc-300">
          <!-- Breadcrumb bên trái -->
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang Chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{{ activeTab === 'main' ? 'Mới Nhất' : 'Theo Dõi' }}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <!-- TabsList căn giữa -->
          <TabsList class="flex w-1/3 bg-zinc-300 dark:bg-zinc-900 px-4 py-2 rounded-lg">
            <TabsTrigger value="main"
              class="flex-1 w-full text-center data-[state=active]:bg-zinc-400 data-[state=active]:dark:bg-zinc-950">
              Trang Chủ
            </TabsTrigger>
            <TabsTrigger value="follow"
              class="flex-1 w-full text-center data-[state=active]:bg-zinc-400 data-[state=active]:dark:bg-zinc-950">
              Trang Theo Dõi
            </TabsTrigger>
          </TabsList>

          <!-- Chừa khoảng trống để căn giữa TabsList -->
          <div class="w-[150px]"></div>
        </div>
      </div>

      <!-- Nội dung các tab -->
      <TabsContent value="main" class="w-full">
        <div class="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-t-xl rounded-tr-xl h-[calc(100vh-150px)] overflow-auto">
          <MainPages />
        </div>
      </TabsContent>

      <TabsContent value="follow" class="w-full">
        <div class="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-t-xl rounded-tr-xl h-[calc(100vh-200px)] overflow-y-auto">
          <FollowedPages />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>