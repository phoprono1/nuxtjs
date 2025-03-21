<template>
    <div class="w-full max-w-6xl mx-auto p-4 md:p-6">
        <h1 class="text-3xl font-bold mb-6 text-gray-800 border-l-4 border-blue-600 pl-3">Trang chủ</h1>

        <!-- Phần thành viên nổi bật với thiết kế tốt hơn -->
        <div class="mb-10">
            <div class="flex items-center gap-2 mb-4">
                <Users class="w-5 h-5 text-blue-600" />
                <h2 class="text-xl font-semibold text-gray-800">Thành Viên Nổi Bật</h2>
            </div>
            <div
                class="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg w-full h-40 flex items-center justify-center text-white">
                <Users class="w-10 h-10 mr-3" />
                <span class="text-xl font-medium">Thành viên nổi bật sẽ xuất hiện ở đây</span>
            </div>
        </div>

        <!-- Phần bài viết mới nhất với hiệu ứng loading -->
        <div class="mb-10">
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                    <BookOpen class="w-5 h-5 text-blue-600" />
                    <h2 class="text-xl font-semibold text-gray-800">Bài Viết Mới Nhất</h2>
                </div>
                <Button variant="outline" size="sm" class="text-sm">
                    <RefreshCw class="w-4 h-4 mr-1" />
                    Tải lại
                </Button>
            </div>

            <!-- Loading state -->
            <div v-if="blogStore.loading" class="space-y-4">
                <div v-for="i in 3" :key="i" class="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>

            <!-- Blog list -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <BlogCard v-for="blog in blogStore.blogs" :key="blog.id" :id="blog.id" :title="blog.title"
                    :authorId="blog.authorId" :category="blog.category" :tags="blog.tags" :likes="blog.likes"
                    :sharedBy="blog.sharedBy" :comments="blog.comments" :views="blog.views"
                    :created_at="blog.createdAt" />
            </div>

            <!-- Empty state -->
            <div v-if="!blogStore.loading && blogStore.blogs.length === 0"
                class="text-center py-12 bg-gray-50 rounded-lg">
                <FileX class="w-10 h-10 text-gray-400 mb-3 mx-auto" />
                <p class="text-gray-500">Không có bài viết nào. Hãy viết bài đầu tiên của bạn!</p>
                <Button class="mt-4 bg-gradient-to-r from-blue-600 to-purple-700">
                    <Plus class="w-4 h-4 mr-2" />
                    Tạo bài viết
                </Button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBlogStore } from '@/stores/blog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/blog/BlogCard.vue';
// Import Lucide icons
import {
    Users,
    BookOpen,
    RefreshCw,
    FileX,
    Plus
} from "lucide-vue-next";

const blogStore = useBlogStore();

onMounted(async () => {
    await blogStore.fetchBlogList();
});
</script>

<style scoped>
/* Nếu cần thêm style tùy chỉnh */
</style>