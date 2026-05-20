// 認証デモ画面です。モックのログイン完了状態を store へ反映します。
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/Button";
import { setSession } from "@/features/auth/store/authSlice";
import { useAppDispatch } from "@/app/store/hooks";

export const LoginPage = () => {
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    // 実運用ではここを API 呼び出しへ差し替える想定です。
    dispatch(
      setSession({
        token: "demo-token",
        profile: {
          id: "user-1",
          name: "Demo User",
        },
      }),
    );
    navigate("/request");
  };

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <p className="eyebrow mb-2">Auth Feature</p>
        <h2 className="h4">{t("title")}</h2>
        <p className="text-body-secondary">{t("description")}</p>
        <Button onClick={handleLogin}>{t("action")}</Button>
      </div>
    </section>
  );
};