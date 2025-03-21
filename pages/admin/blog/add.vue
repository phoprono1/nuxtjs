<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { useToast } from '@/components/ui/toast/use-toast';
definePageMeta({
    layout: "admin",
});

import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useBlogStore } from '@/stores/blog'; // Import blogStore
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const content = ref('');
const title = ref('');
const fetchedContent = ref(''); // Ref to store fetched content
const blogStore = useBlogStore(); // Khởi tạo blogStore
const { toast } = useToast()
const submitPost = async () => {
    try {
        // Gọi action createBlog từ blogStore
        await blogStore.createBlog(title.value, content.value);

        // Kiểm tra kết quả
        if (!blogStore.error) {
            console.log('Blog posted successfully with CID:', blogStore.latestBlogHash);

            // Fetch content by CID and display it
            fetchedContent.value = await blogStore.fetchContentByCID(blogStore.latestBlogHash);
            toast({
                title: 'Thành công',
                description: 'Tạo bài viết thành công!',
            })
        } else {
            // Có lỗi: hiển thị thông báo lỗi
            toast({
                title: 'Thất bại',
                description: 'Tạo bài viết không thành công!',
                variant: 'destructive',
            })
            console.error('Error from store:', blogStore.error);
            throw new Error(blogStore.error);
        }
    } catch (error) {
        console.error('Lỗi khi đăng bài:', error);
    }
};

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
                            Bài viết
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator class="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Thêm bài viết</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    </header>

    <form @submit.prevent="submitPost">
        <div class="w-full flex justify-between items-center mb-4">
            <div class="w-1/3 flex justify-center">
                <Input v-model:model-value="title" type="text" placeholder="Tiêu đề bài viết"
                    class="border-zinc-500 border-spacing-0 " />
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" class="px-6 py-3 bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-700 hover:dark:bg-zinc-900
                     transition-colors duration-200 font-semibold text-lg shadow-lg">
                        Xem trước
                    </Button>
                </DialogTrigger>
                <DialogContent class="max-w-[800px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle class="text-2xl font-bold">{{ title || 'Tiêu đề bài viết' }}</DialogTitle>
                        <DialogDescription class="text-zinc-400 dark:text-zinc-500">Xem trước bài viết
                        </DialogDescription>
                    </DialogHeader>
                    <div class="mt-4 prose prose-zinc dark:prose-invert max-w-none">
                        <div class="ql-editor" v-html="content"></div>
                    </div>
                </DialogContent>
            </Dialog>

            <Button class="px-6 py-3 text-black dark:text-white bg-zinc-300 dark:bg-zinc-800 hover:bg-zinc-700 hover:dark:bg-zinc-900
                       transition-colors duration-200 font-semibold text-lg shadow-lg"
                :disabled="blogStore.isBlogLoading">
                {{ blogStore.isBlogLoading ? 'Đang đăng...' : 'Đăng bài' }}
            </Button>
        </div>
    </form>
    <!-- Editor container -->
    <div class="w-full rounded-xl relative h-[calc(100vh-240px)]">
        <div class="h-full flex flex-col rounded-xl">
            <ClientOnly>
                <QuillEditor v-model:content="content" content-type="html" theme="snow" toolbar="full"
                    class="flex-1 flex flex-col quill-editor" />
            </ClientOnly>
        </div>
    </div>

</template>