<script setup lang="ts">
import { Calendar, User, Tag, Heart, MessageCircle, Share2, Eye, AlertTriangle } from 'lucide-vue-next'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const route = useRoute();
const blogStore = useBlogStore();
const blogId = route.params.id as string;

const blog = ref<Blog | null>(null);
const error = ref(null);

onMounted(async () => {
    try {
        blog.value = await blogStore.fetchBlogDetail(blogId);
    } catch (err: any) {
        error.value = err.message;
    }
});
</script>

<template>
    <div class="w-full mx-auto">
        <!-- Header có vị trí sticky -->
        <div class="sticky top-0 z-30 bg-zinc-300 dark:bg-zinc-500 pt-4 pb-2">
            <div
                class="w-full flex items-center justify-between bg-white dark:bg-zinc-800 z-30 rounded-xl p-4 border-zinc-300">
                <!-- Bên trái - Breadcrumb -->
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Trang Chủ</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Bài Viết</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="#" class="truncate max-w-xs">{{ blog?.title }}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <!-- Bên phải - Nút báo cáo thay cho nút chia sẻ -->
                <div class="flex items-center">
                    <Button variant="outline" size="sm" class="ml-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                        <AlertTriangle class="w-4 h-4 mr-1" />
                        Báo cáo
                    </Button>
                </div>
            </div>
        </div>

        <!-- Content container -->
        <div class="h-[calc(100vh-150px)] overflow-y-auto bg-zinc-50 dark:bg-zinc-800 p-4 rounded-t-xl rounded-tr-xl">
            <!-- Error state -->
            <div v-if="error" class="text-red-500 text-center p-4">
                {{ error }}
            </div>

            <!-- Loading state -->
            <div v-else-if="!blog" class="space-y-4">
                <Skeleton class="h-12 w-3/4" />
                <Skeleton class="h-4 w-1/4" />
                <Skeleton class="h-64 w-full" />
            </div>

            <!-- Blog content -->
            <Card v-else class="bg-white dark:bg-zinc-900">
                <CardHeader>
                    <CardTitle class="text-3xl font-bold">{{ blog.title }}</CardTitle>

                    <!-- Thông tin tác giả - Đã được đưa lên phía trên -->
                    <div class="flex items-center gap-4 mt-4">
                        <Avatar class="h-10 w-10">
                            <AvatarImage :src="`https://avatars.dicebear.com/api/initials/${blog.authorId}.svg`" />
                            <AvatarFallback>{{ blog.authorId?.charAt(0) }}</AvatarFallback>
                        </Avatar>
                        <div class="flex flex-col">
                            <div class="font-semibold">{{ blog.authorId }}</div>
                            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 gap-4">
                                <div class="flex items-center gap-1">
                                    <Calendar class="w-3 h-3" />
                                    <span>{{ new Date(blog?.createdAt || '').toLocaleDateString() }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Tag class="w-3 h-3" />
                                    <Badge variant="secondary" class="text-xs">{{ blog?.category }}</Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 mt-4">
                        <Badge v-for="tag in blog.tags" :key="tag" variant="outline" class="text-xs">
                            {{ tag }}
                        </Badge>
                    </div>
                </CardHeader>

                <!-- Blog Content -->
                <CardContent class="prose dark:prose-invert max-w-none">
                    <div class="ql-editor" v-html="blog.content"></div>
                </CardContent>

                <!-- Blog Footer -->
                <CardFooter class="flex flex-col space-y-4 pt-6">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm text-gray-600 dark:text-gray-400">
                        <div class="flex items-center gap-2">
                            <Heart class="w-4 h-4 text-red-500" />
                            <span>{{ blog.likes || 0 }} thích</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <MessageCircle class="w-4 h-4 text-green-500" />
                            <span>{{ blog.comments || 0 }} bình luận</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Share2 class="w-4 h-4 text-blue-500" />
                            <span>{{ blog.sharedBy || 0 }} chia sẻ</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Eye class="w-4 h-4 text-purple-500" />
                            <span>{{ blog.views || 0 }} lượt xem</span>
                        </div>
                    </div>

                    <div class="flex gap-2 w-full">
                        <Button class="flex-1" variant="outline">
                            <Heart class="w-4 h-4 mr-2" />
                            Thích
                        </Button>
                        <Button class="flex-1" variant="outline">
                            <MessageCircle class="w-4 h-4 mr-2" />
                            Bình luận
                        </Button>
                        <Button class="flex-1" variant="outline">
                            <Share2 class="w-4 h-4 mr-2" />
                            Chia sẻ
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    </div>
</template>

<style>
/* Thêm các styles khác cho nội dung blog nếu cần */
</style>