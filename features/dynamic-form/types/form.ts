import type { ComponentType } from "react";

export type Primitive = string | number | boolean | null;

export type FieldType = "text" | "number" | "select" | "textarea" | "checkbox" | "date";

export interface FormSection {
  key: string;
  label: string;
  order?: number;
}

export interface ConditionLeaf {
  field: string;
  eq?: Primitive;
  ne?: Primitive;
  gt?: number | string;
  gte?: number | string;
  lt?: number | string;
  lte?: number | string;
  in?: Primitive[];
}

export interface ConditionGroup {
  and?: Condition[];
  or?: Condition[];
}

export type Condition = ConditionLeaf | ConditionGroup;

export type ConditionalBoolean = boolean | Condition;

export interface FormFieldUi {
  placeholder?: string;
  width?: number;
}

export interface FormFieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  regex?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormField {
  key: string;
  label: string;
  type: FieldType;
  section?: string;
  order?: number;
  required?: ConditionalBoolean;
  editable?: ConditionalBoolean;
  visible?: ConditionalBoolean;
  default_value?: Primitive;
  options?: SelectOption[];
  ui?: FormFieldUi;
  validation?: FormFieldValidation;
}

export interface FormSchema {
  form_id: string;
  schema_version: number;
  sections: FormSection[];
  fields: FormField[];
}

export type FormValues = Record<string, unknown>;

export interface GroupedFieldSection {
  section: FormSection;
  fields: FormField[];
}

export interface DynamicFieldRendererProps {
  field: FormField;
  required: boolean;
  disabled: boolean;
  errorMessage?: string;
}

export type DynamicFieldRenderer = ComponentType<DynamicFieldRendererProps>;