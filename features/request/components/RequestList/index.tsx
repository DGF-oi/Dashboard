// request 一覧の表示だけを担当する presentational component です。
import { useTranslation } from "react-i18next";
import type { RequestItem } from "@/features/request/api/requestApi";

interface RequestListProps {
  items: RequestItem[];
}

export const RequestList = ({ items }: RequestListProps) => {
  const { t } = useTranslation("request");

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
        <div>
            <p className="eyebrow mb-2">Request Feature</p>
            <h2 className="h4 mb-0">{t("list.title")}</h2>
        </div>
          <span className="badge text-bg-info">{items.length} items</span>
        </div>
        <div className="list-group">
          {items.map((item) => (
            <article className="list-group-item bg-transparent" key={item.id}>
              <div className="d-flex justify-content-between gap-3">
                <div>
                  <p className="text-uppercase small text-info mb-1">{item.status}</p>
                  <h3 className="h6 mb-1">{item.title}</h3>
                  <p className="mb-0 text-body-secondary">{item.owner}</p>
                </div>
                <time className="small text-body-secondary" dateTime={item.createdAt}>{item.createdAt}</time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};