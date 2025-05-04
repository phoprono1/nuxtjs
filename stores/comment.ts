import { useToast } from "@/components/ui/toast/use-toast";

export interface Comment {
  _id?: string;
  blogId: string;
  userId: {
    _id: string;
    username: string;
  };
  content: string;
  time: Date;
  likes: [];
  parentId?: string | null;
  children?: Comment[];
  replies?: Comment[];
}

// Interface cho phản hồi từ API (BaseResponse)
interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const { toast } = useToast();

export const useCommentStore = defineStore("comment", {
  state: () => ({
    comments: [] as Comment[],
    currentBlog: null as Blog | null,
    blogDetail: null as Blog | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async createComment(
      blogId: string,
      content: string,
      parentId: string | null = null,
      userId: string
    ) {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;
      this.loading = true;
      this.error = null;
      try {
        const commentData: any = {
          blogId: blogId,
          content: content,
          userId: userId,
          time: new Date().toISOString(),
          parentId: parentId,
        };
        const response = await $fetch<BaseResponse<Comment>>(
          "/api/comment/create",
          {
            baseURL: backendUrl as string,
            method: "POST",
            body: {
              'Comment': commentData,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.statusCode !== 200 && response.statusCode !== 201) {
          toast({
            title: "Lỗi",
            description: "Có lỗi xảy ra: " + response.message,
            variant: "destructive",
          });
          throw new Error(response.message);
        }
        this.comments.push(response.data); // Thêm bình luận mới vào danh sách
        return response.data; // Trả về bình luận mới tạo
      } catch (e) {
        console.error("Error creating comment:", e);
        this.error = "Có lỗi xảy ra khi tạo bình luận";
        throw e;
      }
    },

    async getCommentBlogByBlogId(blogId: string) {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;
      try {
        const response = await $fetch<BaseResponse<Comment[]>>(
          "/api/comment/comment-blog",
          {
            baseURL: backendUrl as string,
            method: "GET",
            query: { blogId },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.statusCode !== 200) {
          toast({
            title: "Lỗi",
            description: "Có lỗi xảy ra: " + response,
            variant: "destructive",
          });
          throw new Error(response.message);
        }
        this.comments = response.data;
        return this.comments; // Trả về danh sách bình luận
      } catch (e) {
        console.error("Error fetching comments:", e);
        throw e;
      }
    },

    async toggleLikeComment(commentId: string, userId: string) {
      const config = useRuntimeConfig();
      const backendUrl = config.public.backendUrl;
      try {
        const response = await $fetch<BaseResponse<Comment>>(
          "/api/comment/like",
          {
            baseURL: backendUrl as string,
            method: "POST",
            body: {
              commentId: commentId,
              userId: userId,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.statusCode !== 200) {
          toast({
            title: "Lỗi",
            description: "Có lỗi xảy ra: " + response,
            variant: "destructive",
          });
          throw new Error(response.message);
        }
        return response.data;
      } catch (e) {
        console.error("Error toggling like on comment:", e);
        throw e;
      }
    },
  },
});
