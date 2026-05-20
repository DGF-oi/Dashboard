import { memo } from "react";
import { useFormContext } from "react-hook-form";
import type { DynamicFieldRendererProps, FormValues } from "@/features/dynamic-form/types/form";

const TextFieldComponent = ({ field, disabled, errorMessage }: DynamicFieldRendererProps) => {
  const { register } = useFormContext<FormValues>();

  return (
    <>
      <input
        id={field.key}
        type="text"
        className={`form-control ${errorMessage ? "is-invalid" : ""}`.trim()}
        placeholder={field.ui?.placeholder}
        disabled={disabled}
        {...register(field.key)}
      />
      {errorMessage ? <div className="invalid-feedback d-block">{errorMessage}</div> : null}
    </>
  );
};

export const TextField = memo(TextFieldComponent);
