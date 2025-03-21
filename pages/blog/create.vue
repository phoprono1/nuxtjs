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
              <BreadcrumbLink href="#">Đăng Bài</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <!-- Bên phải - Các nút điều khiển -->
        <div class="flex items-center gap-2">
          <!-- Tiêu đề -->
          <Input v-model="title" type="text" placeholder="Tiêu đề bài viết" class="border-zinc-500 w-64" />

          <!-- Category Dropdown -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button variant="outline" size="sm">
                {{ selectedCategory || 'Chọn chuyên mục' }}
                <ChevronDown class="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-48">
              <DropdownMenuLabel>Chuyên mục</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem v-for="category in categories" :key="category" @click="selectedCategory = category">
                {{ category }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Tags Input -->
          <TagsInput v-model="tags" class="flex-1 max-w-xs">
            <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
              <TagsInputItemText />
              <TagsInputItemDelete />
            </TagsInputItem>
            <TagsInputInput placeholder="Nhập tag..." v-model="currentTag" @keyup.enter="addTag" />
          </TagsInput>
          <Button variant="ghost" size="sm" class="ml-2" @click="addTag" v-if="currentTag">
            + Thêm
          </Button>

          <!-- Xem trước -->
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" class="ml-2">
                Xem trước
              </Button>
            </DialogTrigger>
            <DialogContent class="max-w-[800px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle class="text-2xl font-bold">{{ title || 'Tiêu đề bài viết' }}</DialogTitle>
                <DialogDescription class="text-zinc-400 dark:text-zinc-500">Xem trước bài viết</DialogDescription>
              </DialogHeader>
              <div class="mt-4 prose prose-zinc dark:prose-invert max-w-none">
                <div class="ql-editor" v-html="content"></div>
              </div>
            </DialogContent>
          </Dialog>

          <!-- Đăng bài -->
          <Button @click="submitPost" size="sm" class="ml-2" :disabled="blogStore.isBlogLoading">
            {{ blogStore.isBlogLoading ? 'Đang đăng...' : 'Đăng bài' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Editor container -->
    <div class="h-[calc(100vh-150px)] overflow-y-auto bg-zinc-50 dark:bg-zinc-800 p-4 rounded-t-xl">
      <div class="w-full bg-white dark:bg-zinc-900 rounded-xl p-6 relative h-[calc(100vh-230px)]">
        <div class="h-full flex flex-col border rounded-xl border-zinc-300 dark:border-zinc-700">
          <ClientOnly>
            <QuillEditor v-model:content="content" content-type="html" theme="snow" toolbar="full"
              class="flex-1 flex flex-col quill-editor" />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useBlogStore } from '@/stores/blog'; // Import blogStore
import { ChevronDown } from 'lucide-vue-next'; // Import ChevronDown icon
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'

const content = ref('');
const title = ref('');
const tags = ref([]);
const currentTag = ref('');
const selectedCategory = ref('');
const blogStore = useBlogStore(); // Khởi tạo blogStore

// Danh sách category cho dropdown
const categories = [
  'General',
  'Technology',
  'Programming',
  'Web Development',
  'Blockchain',
  'AI',
  'Data Science',
  'Design',
  'Education',
  'Other'
];

const addTag = () => {
  if (currentTag.value.trim()) {
    if (!tags.value.includes(currentTag.value.trim())) {
      tags.value.push(currentTag.value.trim());
    }
    currentTag.value = '';
  }
};

const submitPost = async () => {
  try {
    // Kiểm tra các trường bắt buộc
    if (!title.value) {
      console.error('Tiêu đề không được để trống');
      return;
    }

    if (!selectedCategory.value) {
      console.error('Vui lòng chọn chuyên mục');
      return;
    }

    // Xử lý tags nếu người dùng chưa thêm dấu # cho tag
    const formattedTags = tags.value.map(tag =>
      tag.startsWith('#') ? tag : `#${tag}`
    );

    // Gọi action createBlog từ blogStore với đầy đủ tham số
    await blogStore.createBlog(
      title.value,
      content.value,
      selectedCategory.value,
      formattedTags.length > 0 ? formattedTags : ['#blogstudy']
    );

    // Kiểm tra kết quả
    if (!blogStore.error) {
      // Thành công: reset form và thông báo
      title.value = '';
      content.value = '';
      tags.value = [];
      selectedCategory.value = '';
      console.log('Blog posted successfully with CID:', blogStore.latestBlogHash);
    } else {
      // Có lỗi: hiển thị thông báo lỗi
      console.error('Error from store:', blogStore.error);
      throw new Error(blogStore.error);
    }
  } catch (error) {
    console.error('Lỗi khi đăng bài:', error);
  }
};
</script>

<style scoped>
/* Giữ toolbar cố định và tùy chỉnh giao diện */
:deep(.ql-toolbar.ql-snow) {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #374151;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border: none;
}

/* Container cho nội dung có thể cuộn */
:deep(.ql-container.ql-snow) {
  flex: 1;
  overflow-y: auto;
  border: none;
}

:deep(.ql-editor.ql-blank::before) {
  color: #9ca3af;
}

/* Tùy chỉnh màu toolbar icons */
:deep(.ql-snow .ql-stroke) {
  stroke: #ffffff;
}

:deep(.ql-snow .ql-fill) {
  fill: #ffffff;
}

:deep(.ql-snow .ql-picker) {
  color: #ffffff;
}

/* Tùy chỉnh màu dropdown options */
:deep(.ql-snow .ql-picker-options) {
  background-color: #374151;
  border-color: #4b5563;
}
</style>