export const useConfig = () => {
  const config = useRuntimeConfig();
  return {
    API_BASE_URL: config.public.API_BASE_URL,
  };
};

export const API_ENDPOINTS = () => {
  const { API_BASE_URL } = useConfig();
  return {
    //User
    USER_CREATE: `${API_BASE_URL}/user/create`,
    USER_LIST: `${API_BASE_URL}/user/list`,
    USER_DELETE: `${API_BASE_URL}/user/delete`,
    USER_UPDATE: `${API_BASE_URL}/user/update`,
    USER_DETAIL: `${API_BASE_URL}/user/detail`,

    // Blog
    BLOG_LIST_PAGE: `${API_BASE_URL}/blog/list-page`,
    BLOG_DELETE: `${API_BASE_URL}/blog/delete`,
    BLOG_UPDATE: `${API_BASE_URL}/blog/update`,
    BLOG_DETAIL: `${API_BASE_URL}/blog/detail`,
    BLOG_ID: `${API_BASE_URL}/blog`,
  };
};
