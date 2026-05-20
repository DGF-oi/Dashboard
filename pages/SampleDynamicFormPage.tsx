import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFormSchema } from "@/features/dynamic-form/api/getFormSchema";
import { DynamicForm } from "@/features/dynamic-form/components/DynamicForm";
import type { FormValues } from "@/features/dynamic-form/types/form";

export const SampleDynamicFormPage = () => {
  const [submittedValues, setSubmittedValues] = useState<FormValues | null>(null);

  const schemaQuery = useQuery({
    queryKey: ["dynamic-form", "request-create"],
    queryFn: getFormSchema,
  });

  const handleSubmit = useCallback(async (values: FormValues) => {
    // サンプルでは送信内容を画面に表示し、利用イメージを明確にする。
    setSubmittedValues(values);
  }, []);

  if (schemaQuery.isLoading) {
    return <div className="d-flex align-items-center justify-content-center min-vh-50">フォーム定義を読み込み中です...</div>;
  }

  if (schemaQuery.isError || !schemaQuery.data) {
    return <div className="alert alert-danger">フォーム定義の取得に失敗しました。</div>;
  }

  return (
    <section className="card border-0 shadow-sm">
      <div className="card-body d-grid gap-3">
        <div>
          <p className="eyebrow mb-2">Sample Page</p>
          <h2 className="h4 mb-2">Dynamic Form Engine</h2>
          <p className="text-body-secondary mb-0">フォーム定義のみ差し替えて、同一コンポーネントを複数業務へ再利用できます。</p>
        </div>

        <DynamicForm
          schema={schemaQuery.data}
          onSubmit={handleSubmit}
          submitLabel="登録"
          submittingLabel="登録中..."
        />

        <div className="card border-0 bg-light-subtle">
          <div className="card-body">
            <h3 className="h6 mb-2">送信結果 (サンプル)</h3>
            {submittedValues ? (
              <pre className="mb-0 small">{JSON.stringify(submittedValues, null, 2)}</pre>
            ) : (
              <p className="text-body-secondary mb-0">未送信です。</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
