import axios from 'axios'
import { API_ENDPOINTS } from './constants';

export const listUser = async (page: number, limit: number) => {
  try {
    const response = await axios.get(API_ENDPOINTS().USER_LIST, {
      params: { page, limit },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (e) {
    console.error('Error fetching users:', e);

    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa được xác thực',
      data: {
        myCustomField: true,
      },
    });
  }
};

// Xóa tài khoản
export const deleteUser = async (id: string) => {
  try {
    const response = await axios.post(API_ENDPOINTS().USER_DELETE, { id }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error('Error delete user:', e);
    throw createError({
      statusCode: 401,
      statusMessage: 'Chưa được xác thực',
      data: {
        myCustomField: true
      }
    })
  }
}

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(API_ENDPOINTS().USER_DETAIL, {
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<UserProfile>) => {
  try {
    const response = await axios.put(API_ENDPOINTS().USER_UPDATE, userData, {
      params: { id },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    return response.data;
  } catch (e) {
    console.error('Error updating user:', e);
  }
};




