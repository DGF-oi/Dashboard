// request 一覧取得専用の React Query hook です。
import { useQuery } from "@tanstack/react-query";
import { getRequests } from "@/features/request/api/requestApi";

export const useRequestsQuery = () => {
  return useQuery({
    queryKey: ["request", "list"],
    queryFn: getRequests,
  });
};