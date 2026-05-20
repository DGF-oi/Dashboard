import { memo } from "react";
import { useFormContext } from "react-hook-form";
import type { DynamicFieldRendererProps, FormValues } from "@/features/dynamic-form/types/form";

const TextAreaFieldComponent = ({ field, disabled, errorMessage }: DynamicFieldRendererProps) => {
  const { register } = useFormContext<FormValues>();

  return (
    <>
      <textarea
        id={field.key}
        className={`form-control ${errorMessage ? "is-invalid" : ""}`.trim()}
        placeholder={field.ui?.placeholder}
        rows={4}
        disabled={disabled}
        {...register(field.key)}
      />
      {errorMessage ? <div className="invalid-feedback d-block">{errorMessage}</div> : null}
    </>
  );
};

export const TextAreaField = memo(TextAreaFieldComponent);
