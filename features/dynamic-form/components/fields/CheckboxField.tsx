import { memo } from "react";
import { useFormContext } from "react-hook-form";
import type { DynamicFieldRendererProps, FormValues } from "@/features/dynamic-form/types/form";

const CheckboxFieldComponent = ({ field, disabled, errorMessage }: DynamicFieldRendererProps) => {
  const { register } = useFormContext<FormValues>();

  return (
    <div className="form-check pt-2">
      <input
        id={field.key}
        type="checkbox"
        className={`form-check-input ${errorMessage ? "is-invalid" : ""}`.trim()}
        disabled={disabled}
        {...register(field.key)}
      />
      <label className="form-check-label" htmlFor={field.key}>
        {field.ui?.placeholder ?? "チェックする"}
      </label>
      {errorMessage ? <div className="invalid-feedback d-block">{errorMessage}</div> : null}
    </div>
  );
};

export const CheckboxField = memo(CheckboxFieldComponent);
