// request feature 用のモックデータです。API 切替時の fake response として使います。
import type { ApiListResponse } from "@/shared/types/api";
import type {
  CreateRequestPayload,
  CreateRequestResponse,
  RequestAttachment,
  RequestDetailResponse,
  RequestFormDefinitionResponse,
  RequestItem,
  UpdateRequestPayload,
  UpdateRequestResponse,
} from "@/features/request/api/requestApi";
import { sleep } from "@/shared/utils/sleep";

interface MockRequestRecord {
  id: string;
  values: Record<string, string>;
  attachments: RequestAttachment[];
}

const mockRequestStore = new Map<string, MockRequestRecord>();

const upsertMockRecord = (record: MockRequestRecord) => {
  mockRequestStore.set(record.id, record);
  return record;
};

const ensureMockRecord = (requestId: string) => {
  const existing = mockRequestStore.get(requestId);
  if (existing) {
    return existing;
  }

  const initial = {
    id: requestId,
    values: {
      title: "",
      req_no: requestId,
      req_dd: "",
      req_da: "",
      end_da: "",
      req_type: "",
      res_type: "",
      client: "",
      priority: "",
      summary: "",
      approver: "",
    },
    attachments: [],
  } satisfies MockRequestRecord;

  return upsertMockRecord(initial);
};

const toAttachmentRecord = async (file: File): Promise<RequestAttachment> => {
  const isText = file.type.startsWith("text/") || file.type.includes("json") || file.type.includes("xml");
  const content = isText ? await file.text() : "";

  return {
    id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    mimeType: file.type || "application/octet-stream",
    content,
  };
};

export const mockGetRequests = async (): Promise<ApiListResponse<RequestItem>> => {
  await sleep(250);

  return {
    items: [
      {
        id: "req-001",
        title: "Production rollout approval",
        status: "approved",
        owner: "Platform Team",
        createdAt: "2026-05-16",
      },
      {
        id: "req-002",
        title: "OCR pipeline dry run",
        status: "queued",
        owner: "Inspection Team",
        createdAt: "2026-05-15",
      },
    ],
    total: 2,
  };
};

export const mockGetRequestFormDefinition = async (): Promise<RequestFormDefinitionResponse> => {
  await sleep(200);

  return {
    tabs: [
      {
        key: "registration",
        label: "登録",
        fields: [
          {
            name: "title",
            label: "title",
            type: "text",
            required: true,
            placeholder: "例: OCRパイプライン本番反映依頼",
          },
          {
            name: "req_no",
            label: "req_no",
            type: "text",
            required: true,
            placeholder: "例: REQ-2026-0001",
          },
          {
            name: "req_dd",
            label: "req_dd",
            type: "text",
            required: true,
            placeholder: "例: 2026-05-20",
          },
          {
            name: "req_da",
            label: "req_da",
            type: "text",
            required: true,
            placeholder: "例: Inspection Team",
          },
          {
            name: "end_da",
            label: "end_da",
            type: "text",
            required: true,
            placeholder: "例: 2026-05-31",
          },
          {
            name: "req_type",
            label: "req_type",
            type: "select",
            required: true,
            placeholder: "候補から選択、または直接入力",
            // options が「入力候補」です。UI側では select ではなく datalist input として表示します。
            options: [
              { label: "新規構築", value: "新規構築" },
              { label: "改修", value: "改修" },
              { label: "調査", value: "調査" },
              { label: "障害対応", value: "障害対応" },
            ],
          },
          {
            name: "res_type",
            label: "res_type",
            type: "select",
            required: true,
            placeholder: "候補から選択、または直接入力",
            options: [
              { label: "OCR", value: "OCR" },
              { label: "Web", value: "Web" },
              { label: "API", value: "API" },
              { label: "Infrastructure", value: "Infrastructure" },
            ],
          },
          {
            name: "client",
            label: "client",
            type: "select",
            required: true,
            placeholder: "候補から選択、または直接入力",
            options: [
              { label: "Client-A", value: "Client-A" },
              { label: "Client-B", value: "Client-B" },
              { label: "Client-C", value: "Client-C" },
            ],
          },
          {
            name: "priority",
            label: "priority",
            type: "select",
            required: true,
            placeholder: "候補から選択、または直接入力",
            options: [
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ],
          },
          {
            name: "summary",
            label: "summary",
            type: "textarea",
            required: true,
            placeholder: "依頼の背景、目的、期待成果を入力してください",
          },
        ],
      },
      {
        key: "fileAttachment",
        label: "ファイル添付",
        fields: [
          {
            name: "attachment",
            label: "添付ファイル",
            type: "file",
          },
        ],
      },
      {
        key: "approval",
        label: "承認",
        fields: [
          {
            name: "approver",
            label: "承認者",
            type: "select",
            required: true,
            options: [
              { label: "Platform Team Lead", value: "platform-lead" },
              { label: "Inspection Team Lead", value: "inspection-lead" },
            ],
          },
        ],
      },
    ],
  };
};

export const mockCreateRequest = async (payload: CreateRequestPayload): Promise<CreateRequestResponse> => {
  await sleep(250);

  const requestedNo = payload.values.req_no;
  const requestId = requestedNo ? String(requestedNo) : `req-${Date.now()}`;
  const savedAttachments = await Promise.all(payload.attachments.map((file) => toAttachmentRecord(file)));

  upsertMockRecord({
    id: requestId,
    values: payload.values,
    attachments: savedAttachments,
  });

  return {
    id: requestId,
  };
};

export const mockUpdateRequest = async (payload: UpdateRequestPayload): Promise<UpdateRequestResponse> => {
  await sleep(220);

  const record = ensureMockRecord(payload.requestId);
  const removeIds = new Set(payload.removeAttachmentIds ?? []);
  const keptAttachments = record.attachments.filter((attachment) => !removeIds.has(attachment.id));
  const addedAttachments = await Promise.all(payload.attachments.map((file) => toAttachmentRecord(file)));

  upsertMockRecord({
    id: payload.requestId,
    values: payload.values,
    attachments: [...keptAttachments, ...addedAttachments],
  });

  return {
    id: payload.requestId,
  };
};

export const mockGetRequestDetail = async (requestId: string): Promise<RequestDetailResponse> => {
  await sleep(180);

  const record = ensureMockRecord(requestId);

  return {
    id: record.id,
    values: record.values,
    attachments: record.attachments,
  };
};