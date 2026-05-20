import { z } from "zod";
import { evaluateCondition } from "@/features/dynamic-form/functions/evaluateCondition";
import type { ConditionalBoolean, FormField, FormSchema, FormValues } from "@/features/dynamic-form/types/form";

const resolveConditionalBoolean = (
  value: ConditionalBoolean | undefined,
  formValues: FormValues,
  defaultValue: boolean,
) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (value) {
    return evaluateCondition(formValues, value);
  }

  return defaultValue;
};

const getRequiredMessage = (fieldLabel: string) => `${fieldLabel}は必須項目です`;

const toOptionalString = () =>
  z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    return value;
  }, z.string().optional());

const createStringFieldSchema = (field: FormField, required: boolean) => {
  if (required) {
    let requiredSchema = z.string().trim().min(1, getRequiredMessage(field.label));

    if (field.validation?.minLength !== undefined) {
      requiredSchema = requiredSchema.refine(
        (value: string) => value.length >= field.validation!.minLength!,
        `${field.label}は${field.validation.minLength}文字以上で入力してください`,
      );
    }

    if (field.validation?.maxLength !== undefined) {
      requiredSchema = requiredSchema.refine(
        (value: string) => value.length <= field.validation!.maxLength!,
        `${field.label}は${field.validation.maxLength}文字以内で入力してください`,
      );
    }

    if (field.validation?.regex) {
      const pattern = new RegExp(field.validation.regex);
      requiredSchema = requiredSchema.refine(
        (value: string) => pattern.test(value),
        `${field.label}の形式が正しくありません`,
      );
    }

    return requiredSchema;
  }

  let optionalSchema = toOptionalString();

  if (field.validation?.minLength !== undefined) {
    optionalSchema = optionalSchema.refine(
      (value: string | undefined) => value === undefined || value.length >= field.validation!.minLength!,
      `${field.label}は${field.validation.minLength}文字以上で入力してください`,
    );
  }

  if (field.validation?.maxLength !== undefined) {
    optionalSchema = optionalSchema.refine(
      (value: string | undefined) => value === undefined || value.length <= field.validation!.maxLength!,
      `${field.label}は${field.validation.maxLength}文字以内で入力してください`,
    );
  }

  if (field.validation?.regex) {
    const pattern = new RegExp(field.validation.regex);
    optionalSchema = optionalSchema.refine(
      (value: string | undefined) => value === undefined || pattern.test(value),
      `${field.label}の形式が正しくありません`,
    );
  }

  return optionalSchema;
};

const createNumberFieldSchema = (field: FormField, required: boolean) => {
  let schema = z.preprocess((value) => {
    if (value === "" || value === null || value === undefined) {
      return undefined;
    }

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? value : parsed;
    }

    return value;
  }, required ? z.number({ message: getRequiredMessage(field.label) }) : z.number().optional());

  if (field.validation?.min !== undefined) {
    schema = schema.refine(
      (value) => value === undefined || value >= field.validation!.min!,
      `${field.label}は${field.validation.min}以上を入力してください`,
    );
  }

  if (field.validation?.max !== undefined) {
    schema = schema.refine(
      (value) => value === undefined || value <= field.validation!.max!,
      `${field.label}は${field.validation.max}以下を入力してください`,
    );
  }

  return schema;
};

const createCheckboxFieldSchema = (field: FormField, required: boolean) => {
  if (required) {
    return z.boolean().refine((value) => value, getRequiredMessage(field.label));
  }

  return z.boolean().optional();
};

const createFieldSchema = (field: FormField, values: FormValues) => {
  const isVisible = resolveConditionalBoolean(field.visible, values, true);
  if (!isVisible) {
    return z.unknown().optional();
  }

  const isRequired = resolveConditionalBoolean(field.required, values, false);

  if (field.type === "number") {
    return createNumberFieldSchema(field, isRequired);
  }

  if (field.type === "checkbox") {
    return createCheckboxFieldSchema(field, isRequired);
  }

  return createStringFieldSchema(field, isRequired);
};

export const buildValidationSchema = (schema: FormSchema, values: FormValues) => {
  const shape = schema.fields.reduce<Record<string, z.ZodType>>((accumulator, field) => {
    accumulator[field.key] = createFieldSchema(field, values);
    return accumulator;
  }, {});

  return z.object(shape);
};
