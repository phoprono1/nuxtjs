import { defineStore } from "pinia";
import { create } from "ipfs-http-client";
import { useProfileStore } from "./profile"; // Import profileStore để lấy thông tin user

// Interface cho dữ liệu blog (dựa trên schema backend)
export interface Blog {
  id?: string;
  title: string;
  contentHash: string;
  authorId: string; // Giữ là string vì frontend gửi chuỗi, backend sẽ chuyển thành ObjectId
  category: string;
  tags?: string[];
  status?: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
  likes?: number;
  sharedBy?: number;
  comments?: number;
  views?: number;
  content?: string; // Add content property to Blog interface
}

// Interface cho phản hồi từ API (BaseResponse)
interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Định nghĩa store
export const useBlogStore = defineStore("blog", {
  state: () => ({
    blogs: [] as Blog[], // Danh sách blog (nếu cần)
    currentBlog: null as Blog | null, // Blog hiện tại đang xử lý
    blogDetail: null as Blog | null, // Chi tiết blog hiện tại
    loading: false,
    error: null as string | null,
    ipfs: null as ReturnType<typeof create> | null, // Khai báo ipfs trong state
  }),

  actions: {
    // Khởi tạo IPFS client
    async initializeIPFS() {
      try {
        // Create IPFS client instance
        const ipfs = create({ url: "http://127.0.0.1:5001" });

        console.log("Successfully connected to IPFS Desktop");

        this.ipfs = ipfs;
      } catch (error: any) {
        console.error("Failed to initialize IPFS client:", error);
        throw new Error("Failed to initialize IPFS client: " + error.message);
      }
    },
    // Đăng bài viết: lưu lên IPFS và gửi đến backend
    async createBlog(
      title: string,
      content: string,
      category: string = "General",
      tags: string[] = ["#blogstudy"]
    ) {
      this.loading = true;
      this.error = null;

      try {
        // Lấy thông tin người dùng từ profileStore
        const profileStore = useProfileStore();

        // Nếu user chưa được tải, gọi fetchUserProfile
        if (!profileStore.user) {
          console.log("User not loaded, fetching profile...");
          await profileStore.fetchUserProfile();
          if (!profileStore.user) {
            throw new Error("User not logged in or failed to fetch profile");
          }
        }

        console.log("Profile loaded:", profileStore.user);
        // Thêm log này sau dòng "Profile loaded:"
        console.log(
          "User object structure:",
          JSON.stringify(profileStore.user._id)
        );

        const userId = profileStore.user._id;
        if (!userId) {
          console.error("Profile structure:", profileStore.user);
          throw new Error("User profile does not contain an ID");
        }

        // Khởi tạo IPFS nếu chưa có
        await this.initializeIPFS();

        if (!this.ipfs) {
          throw new Error("Failed to initialize IPFS client");
        }

        // Lưu nội dung dưới dạng file .html lên IPFS
        const htmlContent = `<html><body>${content}</body></html>`;
        const contentBuffer = new TextEncoder().encode(htmlContent);
        const { cid } = await this.ipfs.add({
          path: `${title}.html`,
          content: contentBuffer,
        });
        const contentHash = cid.toString();

        console.log("IPFS Hash (CID):", contentHash);

        // Chuẩn bị dữ liệu gửi lên backend
        const blogData: Blog = {
          title,
          contentHash,
          authorId: userId,
          category,
          status: "published",
          tags, // Sử dụng tags từ tham số
          createdAt: new Date().toISOString(),
        };

        // In dữ liệu trước khi gửi lên backend
        console.log("Blog data to be sent:", blogData);

        // Gửi yêu cầu đến API backend với cookie HttpOnly
        const response = await $fetch<BaseResponse<Blog>>("/api/blog/create", {
          baseURL: "http://localhost:3005", // URL backend của bạn
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Gửi cookie tự động
          body: blogData,
        });

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

    // Fetch content by CID
    async fetchContentByCID(cid: string) {
      try {
        if (!this.ipfs) {
          await this.initializeIPFS();
        }

        if (!this.ipfs) {
          throw new Error("Failed to initialize IPFS client");
        }

        const stream = this.ipfs.cat(cid);
        let content = "";

        for await (const chunk of stream) {
          content += new TextDecoder().decode(chunk);
        }

        console.log("Fetched content:", content);
        return content;
      } catch (error: any) {
        console.error("Failed to fetch content by CID:", error);
        throw new Error("Failed to fetch content by CID: " + error.message);
      }
    },

    // Fetch blog list from API
    async fetchBlogList() {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<BaseResponse<Blog[]>>("/api/blog/list", {
          baseURL: "http://localhost:3005", // URL backend của bạn
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Gửi cookie tự động
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

    // Fetch blog detail from API
    async fetchBlogDetail(id: string): Promise<Blog | null> {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch<BaseResponse<Blog>>("/api/blog/detail", {
          baseURL: "http://localhost:3005",
          method: "GET",
          params: { id }, // Truyền id qua query parameter
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

        // Fetch content từ IPFS nếu có contentHash
        if (this.blogDetail?.contentHash) {
          const content = await this.fetchContentByCID(
            this.blogDetail.contentHash
          );
          return {
            ...this.blogDetail,
            content, // Thêm nội dung từ IPFS vào object trả về
          };
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
  },

  getters: {
    isBlogLoading: (state) => state.loading,
    latestBlogHash: (state) => state.currentBlog?.contentHash || "",
  },
});
