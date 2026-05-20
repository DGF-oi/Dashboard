import axios from "axios";
import { sleep } from "@/shared/utils/sleep";
import type { FormSchema } from "@/features/dynamic-form/types/form";

const mockSchema: FormSchema = {
  form_id: "request_create",
  schema_version: 1,
  sections: [
    { key: "basic", label: "基本情報", order: 10 },
    { key: "detail", label: "詳細", order: 20 },
  ],
  fields: [
    {
      key: "title",
      label: "件名",
      type: "text",
      section: "basic",
      order: 10,
      required: true,
      editable: true,
      visible: true,
      default_value: "",
      validation: { minLength: 3, maxLength: 80 },
      ui: { placeholder: "件名を入力", width: 6 },
    },
    {
      key: "cost",
      label: "金額",
      type: "number",
      section: "basic",
      order: 20,
      required: true,
      editable: true,
      visible: true,
      default_value: 0,
      validation: { min: 0, max: 100000000 },
      ui: { placeholder: "金額を入力", width: 6 },
    },
    {
      key: "role",
      label: "申請者ロール",
      type: "select",
      section: "basic",
      order: 30,
      required: true,
      editable: true,
      visible: true,
      default_value: "",
      options: [
        { label: "一般", value: "user" },
        { label: "管理者", value: "admin" },
      ],
      ui: { width: 6 },
    },
    {
      key: "requestedDate",
      label: "希望日",
      type: "date",
      section: "basic",
      order: 40,
      required: false,
      editable: true,
      visible: true,
      default_value: "",
      ui: { width: 6 },
    },
    {
      key: "description",
      label: "申請内容",
      type: "textarea",
      section: "detail",
      order: 10,
      required: {
        and: [
          { field: "cost", gte: 100000 },
          { field: "role", eq: "admin" },
        ],
      },
      editable: true,
      visible: true,
      default_value: "",
      validation: { minLength: 10, maxLength: 500 },
      ui: { placeholder: "詳細理由を入力", width: 12 },
    },
    {
      key: "requiresLegalCheck",
      label: "法務確認",
      type: "checkbox",
      section: "detail",
      order: 20,
      required: {
        or: [
          { field: "cost", gte: 500000 },
          { field: "role", eq: "admin" },
        ],
      },
      editable: {
        ne: "user",
        field: "role",
      },
      visible: {
        field: "cost",
        gte: 50000,
      },
      default_value: false,
      ui: { placeholder: "法務確認が必要", width: 12 },
    },
  ],
};

export const getFormSchema = async (): Promise<FormSchema> => {
  const useMock = true;

  if (useMock) {
    await sleep(250);
    return structuredClone(mockSchema);
  }

  const response = await axios.get<FormSchema>("/api/forms/request-create");
  return response.data;
};
