import { API_ENDPOINTS } from "./constants";
import axios from "axios";
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
