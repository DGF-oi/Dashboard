// localStorage に保存するキーを中央集約して衝突を防ぎます。
export const STORAGE_KEYS = {
  settings: "app:settings",
  auth: "app:auth",
} as const;