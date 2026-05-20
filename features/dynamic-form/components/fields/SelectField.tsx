import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import type { DynamicFieldRendererProps, FormValues } from "@/features/dynamic-form/types/form";

const SelectFieldComponent = ({ field, disabled, errorMessage }: DynamicFieldRendererProps) => {
  const { control } = useFormContext<FormValues>();
  const { field: controllerField } = useController({
    name: field.key,
    control,
  });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const selectedOption = useMemo(() => {
    return (field.options ?? []).find((option) => option.value === controllerField.value) ?? null;
  }, [controllerField.value, field.options]);

  const filteredOptions = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) {
      return field.options ?? [];
    }

    return (field.options ?? []).filter((option) => {
      return option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query);
    });
  }, [field.options, searchText]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const targetNode = event.target instanceof Node ? event.target : null;
      if (rootRef.current && targetNode && !rootRef.current.contains(targetNode)) {
        setIsOpen(false);
        setSearchText(selectedOption?.label ?? "");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [selectedOption?.label]);

  useEffect(() => {
    setSearchText(selectedOption?.label ?? "");
  }, [selectedOption?.label]);

  return (
    <div ref={rootRef} className="position-relative">
      <input
        id={field.key}
        type="text"
        className={`form-control ${errorMessage ? "is-invalid" : ""}`.trim()}
        placeholder={field.ui?.placeholder ?? "選択してください"}
        disabled={disabled}
        value={searchText}
        autoComplete="off"
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          const nextValue = event.target.value;
          setSearchText(nextValue);
          controllerField.onChange("");
          setIsOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
      />
      {isOpen && filteredOptions.length > 0 ? (
        <div className="dropdown-menu show w-100 shadow-sm" style={{ maxHeight: 240, overflowY: "auto" }}>
          {filteredOptions.map((option) => (
            <button
              key={`${field.key}-${option.value}`}
              type="button"
              className="dropdown-item d-flex justify-content-between align-items-center"
              onClick={() => {
                controllerField.onChange(option.value);
                setSearchText(option.label);
                setIsOpen(false);
              }}
            >
              <span>{option.label}</span>
              <span className="text-body-secondary small">{option.value}</span>
            </button>
          ))}
        </div>
      ) : null}
      {isOpen && filteredOptions.length === 0 ? (
        <div className="dropdown-menu show w-100 shadow-sm p-2 text-body-secondary small">候補がありません</div>
      ) : null}
      {errorMessage ? <div className="invalid-feedback d-block">{errorMessage}</div> : null}
    </div>
  );
};

export const SelectField = memo(SelectFieldComponent);
