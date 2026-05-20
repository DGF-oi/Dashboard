// Axios エラーを画面側で扱いやすい Error へ正規化する interceptor です。
import axios from "axios";

export const normalizeApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const message =
      typeof error.response?.data === "object" && error.response?.data && "message" in error.response.data
        ? String(error.response.data.message)
        : error.message;

    return Promise.reject(new Error(message));
  }

  return Promise.reject(error);
};