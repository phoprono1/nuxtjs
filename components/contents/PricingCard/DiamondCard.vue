<template>
  <div class="relative max-w-md w-full">
    <div class="absolute top-0 right-0 overflow-hidden w-full h-32 z-10">
      <div
        class="absolute top-0 right-0 transform translate-x-14 translate-y-8 rotate-45 bg-gradient-to-r from-cyan-500 to-cyan-700 text-white text-center py-2 px-14 shadow-md"
      >
        <span class="text-xs font-semibold">Hạng Kim Cương</span>
      </div>
    </div>

    <Card
      class="w-full border border-cyan-700 border-opacity-30 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <CardHeader
        class="flex flex-col items-center space-y-4 pb-2 border-b border-cyan-200"
      >
        <div class="flex flex-col items-center">
          <CardTitle class="text-2xl font-bold text-cyan-800"
            >Thành Viên Kim Cương</CardTitle
          >
          <CardDescription class="text-cyan-700 font-medium mt-1"
            >Tài Khoản Tối Ưu</CardDescription
          >
        </div>
        <div class="flex items-baseline">
          <span class="text-3xl font-bold text-cyan-800">200,000₫</span>
          <span class="text-gray-500 ml-1">/tháng</span>
        </div>
      </CardHeader>
      <CardContent class="py-6">
        <ul class="space-y-4">
          <li class="flex items-start">
            <div class="flex-shrink-0 mr-2 mt-1 text-cyan-600">
              <CheckIcon class="w-4 h-4" />
            </div>
            <span>Huy hiệu</span>
            <Badge class="ml-4 bg-cyan-200 text-gray-800 hover:bg-cyan-100"
              >Thành Viên</Badge
            >
          </li>
          <li class="flex items-start">
            <div class="flex-shrink-0 mr-2 mt-1 text-cyan-600">
              <CheckIcon class="w-4 h-4" />
            </div>
            <span>Truy cập đầy đủ các bài viết cơ bản</span>
          </li>
          <li class="flex items-start">
            <div class="flex-shrink-0 mr-2 mt-1 text-cyan-600">
              <CheckIcon class="w-4 h-4" />
            </div>
            <span>Bình luận trên diễn đàn cộng đồng</span>
          </li>
          <li class="flex items-start">
            <div class="flex-shrink-0 mr-2 mt-1 text-cyan-600">
              <CheckIcon class="w-4 h-4" />
            </div>
            <span>Cập nhật tin tức hàng tuần</span>
          </li>
          <li class="flex items-start">
            <div class="flex-shrink-0 mr-2 mt-1 text-cyan-600">
              <TrendingUp class="w-4 h-4" />
            </div>
            <span>Tải tối đa 20 tài liệu bất kỳ mỗi tháng</span>
          </li>
          <li class="flex items-start">
            <div class="flex-shrink-0 mr-2 mt-1 text-cyan-600">
              <TrendingUp class="w-4 h-4" />
            </div>
            <span>Đăng bán tối đa 20 tài liệu</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter class="flex justify-center pt-2 border-t border-cyan-200">
        <button
          class="w-full py-3 px-4 bg-cyan-700 hover:bg-cyan-800 text-white rounded-md font-medium transition-colors duration-200"
        >
          Đăng Ký Ngay
        </button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon, TrendingUp } from "lucide-vue-next";
import { Badge } from "@/components/ui/badge"; // Giả sử bạn đã có component Badge
</script>

<style scoped></style>
