import { useCallback, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { buildValidationSchema } from "@/features/dynamic-form/functions/buildValidationSchema";
import { evaluateCondition } from "@/features/dynamic-form/functions/evaluateCondition";
import { groupFields } from "@/features/dynamic-form/functions/groupFields";
import type { ConditionalBoolean, FormField, FormSchema, FormValues } from "@/features/dynamic-form/types/form";

interface UseDynamicFormOptions {
  schema: FormSchema;
  onSubmit: (values: FormValues) => void | Promise<void>;
}

const resolveConditionalBoolean = (
  conditionOrBoolean: ConditionalBoolean | undefined,
  values: FormValues,
  defaultValue: boolean,
) => {
  if (typeof conditionOrBoolean === "boolean") {
    return conditionOrBoolean;
  }

  if (conditionOrBoolean) {
    return evaluateCondition(values, conditionOrBoolean);
  }

  return defaultValue;
};

export const useDynamicForm = ({ schema, onSubmit }: UseDynamicFormOptions) => {
  const defaultValues = useMemo<FormValues>(() => {
    return schema.fields.reduce<FormValues>((accumulator, field) => {
      if (field.default_value !== undefined) {
        accumulator[field.key] = field.default_value;
      } else {
        accumulator[field.key] = field.type === "checkbox" ? false : "";
      }

      return accumulator;
    }, {});
  }, [schema.fields]);

  const resolver = useCallback(
    (values: FormValues, context: unknown, options: Parameters<ReturnType<typeof zodResolver>>[2]) => {
      const dynamicSchema = buildValidationSchema(schema, values);
      return zodResolver(dynamicSchema)(values, context, options);
    },
    [schema],
  );

  const methods = useForm<FormValues>({
    defaultValues,
    resolver,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const watchedValues = useWatch({ control: methods.control }) as FormValues;

  const visibleFields = useMemo(() => {
    return schema.fields.filter((field) => resolveConditionalBoolean(field.visible, watchedValues, true));
  }, [schema.fields, watchedValues]);

  const groupedSections = useMemo(() => {
    return groupFields(schema.sections, visibleFields);
  }, [schema.sections, visibleFields]);

  const getFieldState = useCallback(
    (field: FormField) => {
      const required = resolveConditionalBoolean(field.required, watchedValues, false);
      const editable = resolveConditionalBoolean(field.editable, watchedValues, true);

      return {
        required,
        disabled: !editable,
      };
    },
    [watchedValues],
  );

  const submit = methods.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return {
    methods,
    groupedSections,
    getFieldState,
    submit,
  };
};
