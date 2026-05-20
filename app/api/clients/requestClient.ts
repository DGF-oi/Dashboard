// request feature 用の専用 Axios client 参照です。
import { apiFactory } from "@/app/api/apiFactory";

export const requestClient = apiFactory.getClient("request");