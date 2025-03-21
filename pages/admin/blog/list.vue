<script setup lang="ts">
definePageMeta({
  layout: "admin",
});

import { ref, onMounted } from 'vue'
import Button from '~/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast/use-toast';
import Toaster from '@/components/ui/toast/Toaster.vue'
import FormatData from '~/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { listBlogs, deleteBlog } from '~/lib/api/blog';
import {
  Heart,
  Share,
  MessageCircle,
} from "lucide-vue-next";

// Thêm định nghĩa kiểu dữ liệu cho Blog
interface Blog {
  _id: string;
  title: string;
  authorId: string;
  likes: string[] | []; // Mảng chứa ID của người dùng đã thích
  sharedBy: string[] | []; // Mảng chứa ID của người dùng đã chia sẻ
  comments: any[] | []; // Mảng chứa các comment
  status: boolean;
}

const blogs = ref<Blog[]>([])
const currentPage = ref(1)
const totalPages = ref(1)
const limit = 10
const { toast } = useToast();


const fetchBlogs = async (page: number) => {
  try {
    const response = await listBlogs(page, limit)
    blogs.value = response.data
    totalPages.value = response.totalPages || 1
    currentPage.value = response.currentPage || 1
    console.log('API Response:', response)
  } catch (e) {
    console.error('Error loading blogs:', e)
  }
}

const handlePageChange = async (page: number) => {
  currentPage.value = page
  await fetchBlogs(page)
}

onMounted(() => {
  fetchBlogs(1)
})

const handleDeleteBlog = async (id: string) => {
  try {
    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')
    if (!confirmed) return

    const response = await deleteBlog(id);

    if (response.statusCode == 201) {
      console.log(response.statusCode);
      toast({
        title: "Thành công",
        description: "Xóa bài viết thành công"
      })
      await fetchBlogs(currentPage.value)
    } else {
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài viết"
      })
    }
  } catch (error) {
    console.error('Error deleting blog:', error)
  }
}

// const handleEditUser = async (id: string) => {
//   return navigateTo(`/admin/user/${id}`);
// };

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
              Tài khoản
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Danh sách tài khoản</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>
  <div>
    <Table>
      <!-- <TableCaption>Danh sách nhân sự</TableCaption> -->
      <TableHeader>
        <TableRow>
          <TableHead class="w-[100px]">STT</TableHead>
          <TableHead>Tiêu đề</TableHead>
          <TableHead>Tác giả</TableHead>
          <TableHead>Tương tác của bài viết</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Công cụ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(blog, index) in blogs" :key="blog._id">
          <TableCell class="font-medium">{{ (currentPage - 1) * limit + index + 1 }}</TableCell>
          <TableCell>{{ FormatData.truncateText(blog.title, 22) }}</TableCell>
          <TableCell>{{ blog.authorId }}</TableCell>
          <TableCell>
            <div class="grid grid-cols-3 gap-2 w-full">
              <div class="flex">
                <Heart class="w-4 h-4 mr-1" />
                <span class="text-sm">{{ Array.isArray(blog.likes) ? blog.likes.length : 0 }}</span>
              </div>

              <div class="flex">
                <Share class="w-4 h-4 mr-1" />
                <span class="text-sm">{{ Array.isArray(blog.sharedBy) ? blog.sharedBy.length : 0 }}</span>
              </div>

              <div class="flex">
                <MessageCircle class="w-4 h-4 mr-1" />
                <span class="text-sm">{{ Array.isArray(blog.comments) ? blog.comments.length : 0 }}</span>
              </div>
            </div>
          </TableCell>

          <TableCell>
            {{ blog.status ? 'Hợp lệ' : 'Đã chặn' }}
          </TableCell>

          <TableCell>
            <Button @click="handleDeleteBlog(blog._id)">
              Xóa
            </Button>
            <Button @click="" class="ml-2">
              Sửa
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div class="flex items-center justify-center gap-2 py-4">
      <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === 1"
        @click="handlePageChange(1)">
        First
      </Button>
      <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)">
        Prev
      </Button>

      <div class="flex items-center gap-1">
        <template v-for="pageNum in totalPages" :key="pageNum">
          <Button class="w-10 h-10 p-0" size="sm" :variant="pageNum === currentPage ? 'default' : 'outline'"
            @click="handlePageChange(pageNum)">
            {{ pageNum }}
          </Button>
        </template>
      </div>

      <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === totalPages"
        @click="handlePageChange(currentPage + 1)">
        Next
      </Button>
      <Button class="w-10 h-10 p-0" variant="outline" size="sm" :disabled="currentPage === totalPages"
        @click="handlePageChange(totalPages)">
        Last
      </Button>
      <!-- <Icon name="uil:github" style="color: black" /> -->
    </div>
  </div>
</template>