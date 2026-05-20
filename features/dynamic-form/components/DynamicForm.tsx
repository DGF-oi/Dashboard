import { memo } from "react";
import { FormProvider } from "react-hook-form";
import { DynamicField } from "@/features/dynamic-form/components/DynamicField";
import { FormSection } from "@/features/dynamic-form/components/layout/FormSection";
import { useDynamicForm } from "@/features/dynamic-form/hooks/useDynamicForm";
import type { FormSchema, FormValues } from "@/features/dynamic-form/types/form";

interface DynamicFormProps {
  schema: FormSchema;
  onSubmit: (values: FormValues) => void | Promise<void>;
  submitLabel?: string;
  submittingLabel?: string;
}

const DynamicFormComponent = ({
  schema,
  onSubmit,
  submitLabel = "送信",
  submittingLabel = "送信中...",
}: DynamicFormProps) => {
  const { methods, groupedSections, getFieldState, submit } = useDynamicForm({ schema, onSubmit });

  return (
    <FormProvider {...methods}>
      <form onSubmit={submit} className="d-grid gap-3" noValidate>
        {groupedSections.map(({ section, fields }) => (
          <FormSection key={section.key} title={section.label}>
            {fields.map((field) => {
              const state = getFieldState(field);
              return <DynamicField key={field.key} field={field} required={state.required} disabled={state.disabled} />;
            })}
          </FormSection>
        ))}

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting ? submittingLabel : submitLabel}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export const DynamicForm = memo(DynamicFormComponent);
