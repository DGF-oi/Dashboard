import { memo, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { fieldComponentMap } from "@/features/dynamic-form/constants/fieldComponentMap";
import type { FormField, FormValues } from "@/features/dynamic-form/types/form";

interface DynamicFieldProps {
  field: FormField;
  required: boolean;
  disabled: boolean;
}

const DynamicFieldComponent = ({ field, required, disabled }: DynamicFieldProps) => {
  const {
    formState: { errors },
  } = useFormContext<FormValues>();

  const FieldRenderer = fieldComponentMap[field.type];
  const width = Math.min(12, Math.max(1, field.ui?.width ?? 12));

  const errorMessage = useMemo(() => {
    const maybeError = errors[field.key];
    if (!maybeError) {
      return undefined;
    }

    if (typeof maybeError.message === "string") {
      return maybeError.message;
    }

    return "入力値を確認してください";
  }, [errors, field.key]);

  if (!FieldRenderer) {
    return (
      <div className={`col-12 col-md-${width}`}>
        <div className="alert alert-warning mb-0" role="alert">
          未対応のフィールドタイプです: {field.type}
        </div>
      </div>
    );
  }

  return (
    <div className={`col-12 col-md-${width}`}>
      <label className="form-label fw-semibold" htmlFor={field.key}>
        {field.label}
        {required ? <span className="text-danger ms-1">*</span> : null}
      </label>
      <FieldRenderer field={field} required={required} disabled={disabled} errorMessage={errorMessage} />
    </div>
  );
};

export const DynamicField = memo(DynamicFieldComponent);
