// 認証のモック応答です。実 API が未接続でもログイン導線を確認できます。
import { sleep } from "@/shared/utils/sleep";

export const mockLogin = async () => {
  await sleep(200);
  return {
    token: "mock-token",
    profile: {
      id: "user-1",
      name: "Mock User",
    },
  };
};