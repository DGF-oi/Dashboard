// request feature の業務 API です。mock / real の切替もこの層で吸収します。
import { executeApi } from "@/app/api/executeApi";
import { requestClient } from "@/app/api/clients/requestClient";
import { apiFactory } from "@/app/api/apiFactory";
import {
  mockCreateRequest,
  mockGetRequestDetail,
  mockGetRequestFormDefinition,
  mockGetRequests,
  mockUpdateRequest,
} from "@/mocks/request/requestMock";
import type { ApiListResponse } from "@/shared/types/api";

export interface RequestItem {
  id: string;
  title: string;
  status: "queued" | "approved" | "rejected";
  owner: string;
  createdAt: string;
}

export interface RequestAttachment {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  content?: string;
}

export type RequestFormTabKey = "registration" | "fileAttachment" | "approval";

export interface RequestFormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "file";
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export interface RequestFormTab {
  key: RequestFormTabKey;
  label: string;
  fields: RequestFormField[];
}

export interface RequestFormDefinitionResponse {
  tabs: RequestFormTab[];
}

export interface CreateRequestPayload {
  values: Record<string, string>;
  attachments: File[];
  removeAttachmentIds?: string[];
}

export interface CreateRequestResponse {
  id: string;
}

export interface UpdateRequestPayload {
  requestId: string;
  values: Record<string, string>;
  attachments: File[];
  removeAttachmentIds?: string[];
}

export interface UpdateRequestResponse {
  id: string;
}

export interface RequestDetailResponse {
  id: string;
  values: Record<string, string>;
  attachments: RequestAttachment[];
}

export const getRequests = async () => {
  // manifest から useMock を読み取り、呼び出し側に切替ロジックを漏らしません。
  const useMock = apiFactory.getDefinition("request")?.useMock ?? false;

  return executeApi<ApiListResponse<RequestItem>>({
    useMock,
    mock: mockGetRequests,
    real: async () => {
      const response = await requestClient.get<ApiListResponse<RequestItem>>("");
      return response.data;
    },
  });
};

export const getRequestFormDefinition = async () => {
  // フォーム定義は当面 MOCK を正として返す。
  const useMock = true;

  return executeApi<RequestFormDefinitionResponse>({
    useMock,
    mock: mockGetRequestFormDefinition,
    real: async () => {
      const response = await requestClient.get<RequestFormDefinitionResponse>("/form-definition");
      return response.data;
    },
  });
};

export const getRequestDetail = async (requestId: string) => {
  const useMock = true;

  return executeApi<RequestDetailResponse>({
    useMock,
    mock: () => mockGetRequestDetail(requestId),
    real: async () => {
      const response = await requestClient.get<RequestDetailResponse>(`/${requestId}`);
      return response.data;
    },
  });
};

export const createRequest = async (payload: CreateRequestPayload) => {
  const useMock = apiFactory.getDefinition("request")?.useMock ?? false;

  return executeApi<CreateRequestResponse>({
    useMock,
    mock: () => mockCreateRequest(payload),
    real: async () => {
      const response = await requestClient.post<CreateRequestResponse>("", payload);
      return response.data;
    },
  });
};

export const updateRequest = async (payload: UpdateRequestPayload) => {
  const useMock = apiFactory.getDefinition("request")?.useMock ?? false;

  return executeApi<UpdateRequestResponse>({
    useMock,
    mock: () => mockUpdateRequest(payload),
    real: async () => {
      const response = await requestClient.put<UpdateRequestResponse>(`/${payload.requestId}`, payload);
      return response.data;
    },
  });
};