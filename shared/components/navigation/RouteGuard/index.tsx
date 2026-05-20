// 認証が必要な画面をログイン画面へリダイレクトする共通ガードです。
import type { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/store/hooks";

interface RouteGuardProps extends PropsWithChildren {
  requireAuth?: boolean;
}

export const RouteGuard = ({ children, requireAuth = true }: RouteGuardProps) => {
  const location = useLocation();
  // auth slice の token 有無だけを見て認証状態を判定します。
  const token = useAppSelector((state) => {
    const authState = state["auth"];
    if (authState && typeof authState === "object" && "token" in authState) {
      return authState.token as string | null;
    }

    return null;
  });

  if (requireAuth && !token) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};