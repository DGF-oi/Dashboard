import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getRequestFormDefinition,
  getRequestDetail,
  type RequestAttachment,
  type RequestFormField,
  type RequestFormTabKey,
  updateRequest,
} from "@/features/request/api/requestApi";
import { Button } from "@/shared/components/ui/Button";

export const RequestEditPage = () => {
  const { t } = useTranslation("request");
  const { requestId } = useParams();
  const [activeTab, setActiveTab] = useState<RequestFormTabKey>("registration");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [pendingAttachments, setPendingAttachments] = useState<File[]>([]);
  const [savedAttachments, setSavedAttachments] = useState<RequestAttachment[]>([]);
  const [removeAttachmentIds, setRemoveAttachmentIds] = useState<string[]>([]);

  const formDefinitionQuery = useQuery({
    queryKey: ["request", "edit", "form-definition"],
    queryFn: getRequestFormDefinition,
  });

  const requestDetailQuery = useQuery({
    queryKey: ["request", "detail", requestId],
    queryFn: () => getRequestDetail(requestId ?? ""),
    enabled: Boolean(requestId),
  });

  useEffect(() => {
    if (!requestDetailQuery.data) {
      return;
    }

    setFormValues(requestDetailQuery.data.values);
    setSavedAttachments(requestDetailQuery.data.attachments);
    setPendingAttachments([]);
    setRemoveAttachmentIds([]);
  }, [requestDetailQuery.data]);

  const updateMutation = useMutation({
    mutationFn: updateRequest,
    onSuccess: async () => {
      await requestDetailQuery.refetch();
    },
  });

  const tabs = formDefinitionQuery.data?.tabs ?? [];
  const currentTab = useMemo(() => tabs.find((tab) => tab.key === activeTab) ?? tabs[0], [activeTab, tabs]);

  const renderField = (field: RequestFormField) => {
    if (field.type === "textarea") {
      return (
        <textarea
          id={field.name}
          className="form-control"
          required={Boolean(field.required)}
          placeholder={field.placeholder}
          value={formValues[field.name] ?? ""}
          onChange={(event) => {
            setFormValues((current) => ({ ...current, [field.name]: event.target.value }));
          }}
          rows={4}
        />
      );
    }

    if (field.type === "select") {
      const listId = `edit-field-options-${field.name}`;

      return (
        <>
          <input
            id={field.name}
            type="text"
            list={listId}
            className="form-control"
            required={Boolean(field.required)}
            placeholder={field.placeholder ?? t("create.selectPlaceholder")}
            value={formValues[field.name] ?? ""}
            onChange={(event) => {
              setFormValues((current) => ({ ...current, [field.name]: event.target.value }));
            }}
          />
          <datalist id={listId}>
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value} label={option.label} />
            ))}
          </datalist>
        </>
      );
    }

    if (field.type === "file") {
      return (
        <input
          id={field.name}
          type="file"
          className="form-control"
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            setPendingAttachments((current) => [...current, ...files]);
          }}
        />
      );
    }

    return (
      <input
        id={field.name}
        type="text"
        className="form-control"
        required={Boolean(field.required)}
        placeholder={field.placeholder}
        value={formValues[field.name] ?? ""}
        onChange={(event) => {
          setFormValues((current) => ({ ...current, [field.name]: event.target.value }));
        }}
      />
    );
  };

  const openSavedAttachment = (attachment: RequestAttachment) => {
    const blob = new Blob([attachment.content ?? ""], { type: attachment.mimeType || "text/plain" });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
  };

  const toggleDeleteSavedAttachment = (attachmentId: string) => {
    setRemoveAttachmentIds((current) =>
      current.includes(attachmentId) ? current.filter((id) => id !== attachmentId) : [...current, attachmentId],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!requestId) {
      return;
    }

    updateMutation.mutate({
      requestId,
      values: formValues,
      attachments: pendingAttachments,
      removeAttachmentIds,
    });
  };

  if (formDefinitionQuery.isLoading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-50">{t("edit.loading")}</div>;
  }

  if (formDefinitionQuery.isError) {
    return <div className="d-flex align-items-center justify-content-center min-vh-50">{t("edit.error")}</div>;
  }

  if (requestDetailQuery.isLoading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-50">{t("edit.loading")}</div>;
  }

  return (
    <section className="card shadow-sm border-0">
      <div className="card-body">
        <p className="eyebrow mb-2">Feature Route</p>
        <h2 className="h4 mb-2">{t("edit.title")}</h2>
        <p className="text-body-secondary mb-3">
          {t("edit.description", { requestId: requestId ?? "-" })}
        </p>

        <ul className="nav nav-tabs mb-3" role="tablist">
          {tabs.map((tab) => (
            <li className="nav-item" role="presentation" key={tab.key}>
              <button
                type="button"
                className={`nav-link ${tab.key === (currentTab?.key ?? "") ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        {tabs.length === 0 ? <p className="text-body-secondary mb-0">{t("create.empty")}</p> : null}

        <form onSubmit={handleSubmit}>
          <div className="d-grid gap-3">
            {(currentTab?.fields ?? []).map((field) => (
              <label key={field.name} className="d-grid gap-2">
                <span className="small fw-semibold">{field.label}</span>
                {renderField(field)}
              </label>
            ))}

            {currentTab?.key === "fileAttachment" ? (
              <>
                <div className="card border-0 bg-light-subtle">
                  <div className="card-body py-3">
                    <h3 className="h6 mb-2">添付して保存しようとするリスト</h3>
                    {pendingAttachments.length === 0 ? (
                      <p className="text-body-secondary mb-0">保存予定の添付ファイルはありません。</p>
                    ) : (
                      <ul className="list-group">
                        {pendingAttachments.map((file, index) => (
                          <li key={`${file.name}-${index}`} className="list-group-item d-flex align-items-center justify-content-between">
                            <span>{file.name}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => {
                                setPendingAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index));
                              }}
                            >
                              取消
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="card border-0 bg-light-subtle">
                  <div className="card-body py-3">
                    <h3 className="h6 mb-2">添付保存済みファイル</h3>
                    {savedAttachments.length === 0 ? (
                      <p className="text-body-secondary mb-0">保存済みファイルはありません。</p>
                    ) : (
                      <ul className="list-group">
                        {savedAttachments.map((attachment) => {
                          const marked = removeAttachmentIds.includes(attachment.id);
                          return (
                            <li key={attachment.id} className="list-group-item d-flex align-items-center justify-content-between gap-2">
                              <button type="button" className="btn btn-link p-0 text-decoration-none" onClick={() => openSavedAttachment(attachment)}>
                                {attachment.name}
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm ${marked ? "btn-warning" : "btn-outline-danger"}`}
                                onClick={() => toggleDeleteSavedAttachment(attachment.id)}
                              >
                                {marked ? "削除取消" : "削除"}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="mt-4 d-flex justify-content-end">
            <Button type="submit" disabled={updateMutation.isPending || !requestId}>
              {updateMutation.isPending ? t("edit.submitting") : t("edit.action")}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
