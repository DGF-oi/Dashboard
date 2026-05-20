// request 一覧画面です。取得状態に応じて表示を切り替えます。
import { useTranslation } from "react-i18next";
import { RequestList } from "@/features/request/components/RequestList";
import { useRequestsQuery } from "@/features/request/hooks/useRequestsQuery";

export const RequestListPage = () => {
  const { t } = useTranslation("request");
  const query = useRequestsQuery();

  if (query.isLoading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-50">{t("list.loading")}</div>;
  }

  if (query.isError) {
    return <div className="d-flex align-items-center justify-content-center min-vh-50">{t("list.error")}</div>;
  }

  return <RequestList items={query.data?.items ?? []} />;
};