import { API_ENDPOINTS } from "./constants";
import axios, { type AxiosError } from "axios";
export const listBlogs = async (page: number, limit: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS().BLOG_LIST_PAGE, {
      params: { page, limit },
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      },
      withCredentials: true,
    });

    return response.data;
  } catch (e) {
    console.error("Error fetching blogs:", e);

    throw createError({
      statusCode: 401,
      statusMessage: "Chưa được xác thực",
      data: {
        myCustomField: true,
      },
    });
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS().BLOG_DELETE,
      { id },
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (e) {
    console.error("Error delete blog:", e);
    throw createError({
      statusCode: 401,
      statusMessage: "Chưa được xác thực",
      data: {
        myCustomField: true,
      },
    });
  }
};

export const updateBlog = async (id: string, updateData: any) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS().BLOG_ID}/${id}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
        withCredentials: true,
      }
    );
    // TRẢ VỀ TOÀN BỘ RESPONSE OBJECT
    return response;
  } catch (error) { // Đổi tên biến e thành error cho rõ ràng
    console.error("Error updating blog:", error);

    // Cải thiện việc tạo lỗi: Lấy status và message từ lỗi axios nếu có
    let statusCode = 400;
    let message = "Cập nhật bài viết thất bại";

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<any>; // Ép kiểu để truy cập response
      statusCode = axiosError.response?.status || 400;
      // Ưu tiên message lỗi từ backend nếu có
      message = axiosError.response?.data?.message || axiosError.message || message;
    } else if (error instanceof Error) {
      message = error.message; // Lấy message từ lỗi thông thường
    }

    throw createError({
      statusCode: statusCode,
      statusMessage: message, // Sử dụng statusMessage chuẩn của Nuxt
      // data: { // Bỏ data nếu không cần thiết hoặc thêm thông tin cụ thể
      //   myCustomField: true,
      //   originalError: error // Có thể thêm lỗi gốc để debug
      // }
    });
  }
};