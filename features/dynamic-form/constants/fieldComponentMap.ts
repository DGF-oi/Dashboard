import { CheckboxField } from "@/features/dynamic-form/components/fields/CheckboxField";
import { DateField } from "@/features/dynamic-form/components/fields/DateField";
import { NumberField } from "@/features/dynamic-form/components/fields/NumberField";
import { SelectField } from "@/features/dynamic-form/components/fields/SelectField";
import { TextAreaField } from "@/features/dynamic-form/components/fields/TextAreaField";
import { TextField } from "@/features/dynamic-form/components/fields/TextField";
import type { DynamicFieldRenderer, FieldType } from "@/features/dynamic-form/types/form";

export const fieldComponentMap: Record<FieldType, DynamicFieldRenderer> = {
  text: TextField,
  number: NumberField,
  select: SelectField,
  textarea: TextAreaField,
  checkbox: CheckboxField,
  date: DateField,
};
