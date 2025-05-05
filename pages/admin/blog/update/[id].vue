<template>
  <div class="p-4 max-w-full mx-auto">
    <!-- Giảm max-width một chút -->
    <Toaster />
    <Card>
      <CardHeader>
        <CardTitle class="text-2xl">Sửa bài viết</CardTitle>
        <!-- <CardDescription>Cập nhật thông tin chi tiết cho bài viết.</CardDescription> -->
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Tăng khoảng cách -->
          <!-- Title Field -->
          <FormField name="title">
            <FormItem>
              <FormLabel for="title">Tiêu đề</FormLabel>
              <FormControl>
                <Input
                  id="title"
                  type="text"
                  v-model="blog.title"
                  required
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </FormControl>
              <FormMessage />
              <!-- Để hiển thị lỗi validation sau này -->
            </FormItem>
          </FormField>

          <!-- Content Field -->
          <FormField name="content">
            <FormItem>
              <FormLabel for="content">Nội dung</FormLabel>
              <FormControl>
                <Textarea
                  id="content"
                  v-model="blog.content"
                  required
                  rows="10"
                  placeholder="Viết nội dung ở đây..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Status Field -->
          <FormField name="status">
            <FormItem>
              <FormLabel for="status">Trạng thái</FormLabel>
              <!-- Sử dụng v-model với computed property 'blogStatusString' -->
              <Select v-model="blogStatusString">
                <FormControl>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Hợp lệ</SelectItem>
                  <SelectItem value="false">Đã chặn</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- Actions moved to CardFooter -->
        </form>
      </CardContent>
      <CardFooter class="flex justify-end gap-4">
        <!-- Đặt button ở cuối -->
        <Button
          type="button"
          variant="outline"
          @click="navigateTo('/admin/blog/list')"
        >
          Hủy
        </Button>
        <Button type="submit" @click="handleSubmit">
          <!-- Submit form từ đây -->
          Lưu thay đổi
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"; // Thêm computed
import { useRoute, useRouter } from "vue-router";

// --- Shadcn UI Component Imports ---
import { Button } from "~/components/ui/button"; // Đảm bảo đường dẫn đúng
import { Input } from "@/components/ui/input"; // Đảm bảo đường dẫn đúng
import { Textarea } from "@/components/ui/textarea"; // Đảm bảo đường dẫn đúng
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Đảm bảo đường dẫn đúng
import {
  Card,
  CardContent,
  // CardDescription, // Bỏ comment nếu dùng
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Đảm bảo đường dẫn đúng
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  // FormDescription, // Bỏ comment nếu dùng
  FormMessage,
} from "@/components/ui/form"; // Đảm bảo đường dẫn đúng
import { useToast } from "@/components/ui/toast/use-toast"; // Đảm bảo đường dẫn đúng
import Toaster from "@/components/ui/toast/Toaster.vue"; // Đảm bảo đường dẫn đúng
// --- End Shadcn UI Component Imports ---

import { updateBlog } from "~/lib/api/blog";
import { useBlogStore } from "~/stores/blog";

definePageMeta({
  layout: "admin",
});

interface Blog {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  likes: string[] | [];
  sharedBy: string[] | [];
  comments: any[] | [];
  status: boolean; // Giữ kiểu boolean
}

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const blogStore = useBlogStore();

const blog = ref<Blog>({
  _id: "",
  title: "",
  content: "",
  authorId: "",
  likes: [],
  sharedBy: [],
  comments: [],
  status: true, // Giá trị mặc định là boolean
});

// --- Computed Property for Select ---
// Chuyển đổi giữa boolean (blog.status) và string ('true'/'false') cho Select
const blogStatusString = computed({
  get: () => String(blog.value.status), // Boolean -> String
  set: (value) => {
    blog.value.status = value === "true"; // String -> Boolean
  },
});
// --- End Computed Property ---

const fetchBlog = async () => {
  try {
    const id = route.params.id as string;
    // console.log("Fetching blog with ID:", id); // Bỏ comment nếu cần debug
    const fetchedBlog = await blogStore.fetchBlogDetail(id);
    // console.log("Fetched blog detail:", fetchedBlog); // Bỏ comment nếu cần debug
    if (fetchedBlog) {
      blog.value = {
        _id: fetchedBlog._id || fetchedBlog.id || id,
        title: fetchedBlog.title || "",
        content: fetchedBlog.content || "",
        authorId: fetchedBlog.authorId || "",
        likes: Array.isArray(fetchedBlog.likes) ? fetchedBlog.likes : [],
        sharedBy: Array.isArray(fetchedBlog.sharedBy)
          ? fetchedBlog.sharedBy
          : [],
        comments: Array.isArray(fetchedBlog.comments)
          ? fetchedBlog.comments
          : [],
        status:
          typeof fetchedBlog.status === "boolean" ? fetchedBlog.status : true,
      };
    } else {
      throw new Error("Blog not found");
    }
  } catch (error) {
    console.error("Error fetching blog:", error);
    toast({
      title: "Lỗi",
      description: "Không thể tải bài viết",
      variant: "destructive",
    });
    // Cân nhắc chuyển hướng về trang list nếu không fetch được
    // router.push('/admin/blog/list');
  }
};

const handleSubmit = async () => {
  // Validate form cơ bản (Shadcn/VeeValidate có thể làm tốt hơn)
  if (!blog.value.title || !blog.value.content) {
    toast({
      title: "Thiếu thông tin",
      description: "Vui lòng nhập tiêu đề và nội dung.",
      variant: "destructive",
    });
    return;
  }

  try {
    const id = route.params.id as string;
    // Dữ liệu gửi đi vẫn dùng blog.value (với status là boolean)
    const updateData = {
      title: blog.value.title,
      content: blog.value.content,
      status: blog.value.status,
    };
    const response = await updateBlog(id, updateData);

    if (response.status === 200) {
      // Giả sử API trả về 200 OK
      toast({
        title: "Thành công",
        description: "Cập nhật bài viết thành công",
      });
      router.push("/admin/blog/list");
    } else {
      // Trường hợp này ít xảy ra nếu API chuẩn
      console.warn("API response status không như mong đợi:", response);
      throw new Error(`Cập nhật thất bại (Status: ${response.status})`);
    }
  } catch (error: any) {
    console.error("Error updating blog:", error);
    toast({
      title: "Lỗi",
      description:
        error.statusMessage || error.message || "Không thể cập nhật bài viết",
      variant: "destructive",
    });
  }
};

onMounted(() => {
  fetchBlog();
});
</script>

<style scoped>
/* Thường không cần thêm style scoped khi dùng Shadcn/Tailwind */
/* Nếu cần override, bạn có thể thêm ở đây */
</style>
