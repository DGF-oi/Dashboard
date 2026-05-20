import { memo } from "react";
import { useFormContext } from "react-hook-form";
import type { DynamicFieldRendererProps, FormValues } from "@/features/dynamic-form/types/form";

const DateFieldComponent = ({ field, disabled, errorMessage }: DynamicFieldRendererProps) => {
  const { register } = useFormContext<FormValues>();

  return (
    <>
      <input
        id={field.key}
        type="date"
        className={`form-control ${errorMessage ? "is-invalid" : ""}`.trim()}
        disabled={disabled}
        {...register(field.key)}
      />
      {errorMessage ? <div className="invalid-feedback d-block">{errorMessage}</div> : null}
    </>
  );
};

export const DateField = memo(DateFieldComponent);
