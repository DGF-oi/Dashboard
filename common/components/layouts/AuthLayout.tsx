// 認証画面専用のシンプルなレイアウトです。
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__panel">
        <Outlet />
      </div>
    </div>
  );
};
