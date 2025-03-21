// interfaces/api/register.ts

export interface SuccessResponse {
  statusCode: number;
  message: string;
  data: {
    username: string;
    email: string;
    password: string;
    wallet: string;
    address: string;
    phone: string;
    tokenBalance: number;
    role: string;
    coursesPurchased: string[];
    materialsPurchased: string[];
    status: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

// Interface cho response lỗi
export interface ErrorResponse {
  statusCode: number;
  statusMessage?: string; // Optional, từ Nuxt
  data: {
    statusCode: number;
    message: string;
  };
}
