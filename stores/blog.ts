import { defineStore } from "pinia";
import { useProfileStore } from "./profile"; // Import profileStore để lấy thông tin user
import { useRuntimeConfig } from "nuxt/app"; // Thêm import này để lấy runtimeConfig
import type { Comment } from "./comment";
import { useToast } from "@/components/ui/toast/use-toast";
const { toast } = useToast();

// Interface cho dữ liệu blog (dựa trên schema backend)
export interface Blog {
  id?: string;
  title: string;
  contentPath: string; // Thay contentHash thành contentPath
  authorId: string; // Giữ là string vì frontend gửi chuỗi, backend sẽ chuyển thành ObjectId
  category: number;
  tags?: string[];
  status?: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
  likes?: string[];
  sharedBy?: number;
  comments: Comment[];
  views?: number;
  content?: string; // Giữ nguyên để lưu nội dung HTML khi cần
}

// Interface cho phản hồi từ API (BaseResponse)
interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

interface PaginatedBlogResponse {
  data: Blog[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// Định nghĩa store
export const useBlogStore = defineStore("blog", {
  state: () => ({
    blogs: [] as Blog[], // Danh sách blog
    currentBlog: null as Blog | null, // Blog hiện tại đang xử lý
    blogDetail: null as Blog | null, // Chi tiết blog hiện tại
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Đăng bài viết: gửi nội dung HTML trực tiếp đến backend
    async createBlog(
      title: string,
      content: string,
      category: number = 0,
      tags: string[] = ["#blogstudy"]
    ) {
      const config = useRuntimeConfig(); // Lấy runtimeConfig
      const backendUrl = config.public.backendUrl; // Lấy backendUrl từ public runtimeConfig

      this.loading = true;
      this.error = null;

      try {
        // Lấy thông tin người dùng từ profileStore
        const profileStore = useProfileStore();

        if (!profileStore.user) {
          console.log("User not loaded, fetching profile...");
          await profileStore.fetchUserProfile();
          if (!profileStore.user) {
            throw new Error("User not logged in or failed to fetch profile");
          }
        }

        const userId = profileStore.user._id;
        if (!userId) {
          console.error("Profile structure:", profileStore.user);
          throw new Error("User profile does not contain an ID");
        }

        // Chuẩn bị dữ liệu gửi lên backend
        const blogData = {
          title,
          content, // Gửi nội dung HTML dạng chuỗi
          authorId: userId,
          category,
          tags,
          status: "published",
          comments: [],
        };

        console.log("Blog data to be sent:", blogData);

        // Gửi yêu cầu đến API backend với cookie HttpOnly
        const response = await $fetch<BaseResponse<Blog>>("/api/blog/create", {
          baseURL: backendUrl as string,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Gửi cookie tự động
          body: blogData,
        });

        // Kiểm tra mã trạng thái thành công (200 hoặc 201)
        if (![200, 201].includes(response.statusCode)) {
          throw new Error(response.message || "Failed to create blog");
        }

        // Lưu blog vừa tạo vào state
        this.currentBlog = response.data;
        this.blogs.push(response.data);

        console.log("Blog created successfully:", response.data);
      } catch (error: any) {
        this.error = error.message || "Failed to create blog";
        console.error("Error creating blog:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch blog list từ API
    async fetchBlogList() {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;

      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<BaseResponse<Blog[]>>("/api/blog/list", {
          baseURL: backendUrl as string,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.statusCode !== 200) {
          throw new Error(response.message);
        }

        this.blogs = response.data;
        console.log("Fetched blog list:", this.blogs);
      } catch (error: any) {
        this.error = error.message || "Failed to fetch blog list";
        console.error("Error fetching blog list:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch blog page từ API
    async fetchBlogPage(page: number = 1, limit: number = 6) {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;

      this.loading = true;
      this.error = null;

      try {
        // Thay đổi kiểu dữ liệu của response cho đúng với cấu trúc API trả về
        const response = await $fetch<{
          data: Blog[];
          currentPage: number;
          totalPages: number;
          totalItems: number;
        }>("/api/blog/list-page", {
          baseURL: backendUrl as string,
          method: "GET",
          params: {
            page,
            limit
          },
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("Fetched blog page:", response);

        // Gán trực tiếp data từ API vào blogs
        this.blogs = response.data;

        // Trả về toàn bộ response để component có thể sử dụng thông tin pagination
        return response;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch blog list";
        console.error("Error fetching blog list:", error);
      } finally {
        this.loading = false;
      }
    },

    // Fetch blog detail từ API và tải nội dung từ contentPath nếu cần
    async fetchBlogDetail(id: string): Promise<Blog | null> {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;

      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<BaseResponse<Blog>>("/api/blog/detail", {
          baseURL: backendUrl as string,
          method: "GET",
          params: { id },
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.statusCode !== 200) {
          throw new Error(response.message);
        }

        // Lưu blog detail vào state
        this.blogDetail = response.data;
        console.log("Fetched blog detail:", this.blogDetail);

        // Tải nội dung từ contentPath nếu có
        if (this.blogDetail?.contentPath) {
          const contentResponse = await $fetch(this.blogDetail.contentPath, {
            baseURL: backendUrl as string,
            method: "GET",
          });
          this.blogDetail.content = contentResponse as string;
        }

        return this.blogDetail;
      } catch (error: any) {
        this.error = error.message || "Failed to fetch blog detail";
        console.error("Error fetching blog detail:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Reset state
    resetBlog() {
      this.currentBlog = null;
      this.error = null;
      this.loading = false;
    },

    // fetchUserBlogs: Lấy danh sách blog của người dùng
    async fetchUserBlogs(userId: string, page: number = 1, limit: number = 6): Promise<PaginatedBlogResponse | null> {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;

      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<BaseResponse<PaginatedBlogResponse>>(
          "/api/blog/by-author",
          {
            baseURL: backendUrl as string,
            method: "GET",
            params: {
              authorId: userId,
              page,
              limit
            },
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (response.statusCode !== 200) {
          throw new Error(response.message || "Failed to fetch user blogs");
        }

        console.log(`Fetched user blogs (Page ${page}):`, response.data);
        return response.data; // Return the PaginatedBlogResponse
      } catch (error: any) {
        this.error = error.data?.message || error.message || "Failed to fetch user blogs";
        console.error("Error fetching user blogs:", error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Toggle like cho blog
    async toggleLikeComment(blogId: string, userId: string) {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;

      try {
        const response = await $fetch<BaseResponse<Blog>>("/api/blog/like", {
          baseURL: backendUrl as string,
          method: "POST",
          body: {
            blogId: blogId,
            userId: userId,
          },
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.statusCode !== 200) {
          toast({
            title: "Lỗi",
            description: "Có lỗi xảy ra: " + response.message,
            variant: "destructive",
          });
          throw new Error(response.message);
        }

        return response.data;
      } catch (e) {
        console.error("Error toggling like on blog:", e);
        throw e;
      }
    },
  },

  getters: {
    isBlogLoading: (state) => state.loading,
    latestBlogPath: (state) => state.currentBlog?.contentPath || "", // Cập nhật getter
  },
});