// 一覧 API の共通レスポンス形を表す型です。
export interface ApiListResponse<T> {
  items: T[];
  total: number;
}