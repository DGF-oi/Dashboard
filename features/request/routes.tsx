// request feature が提供する画面ルートを定義します。
import { RouteGuard } from "@/shared/components/navigation/RouteGuard";
import type { RouteObject } from "react-router-dom";

export const requestRoutes: RouteObject[] = [
  {
    path: "request",
    lazy: async () => {
      // 画面単位で lazy import し、初期バンドルを軽く保ちます。
      const module = await import("@/features/request/pages/RequestListPage");
      return {
        Component: () => (
          <RouteGuard>
            <module.RequestListPage />
          </RouteGuard>
        ),
      };
    },
  },
  {
    path: "request/new",
    lazy: async () => {
      // 作成画面も同じく必要時にだけ読み込みます。
      const module = await import("@/features/request/pages/RequestCreatePage");
      return {
        Component: () => (
          <RouteGuard>
            <module.RequestCreatePage />
          </RouteGuard>
        ),
      };
    },
  },
  {
    path: "request/:requestId/edit",
    lazy: async () => {
      const module = await import("@/features/request/pages/RequestEditPage");
      return {
        Component: () => (
          <RouteGuard>
            <module.RequestEditPage />
          </RouteGuard>
        ),
      };
    },
  },
];