// モック API で待機時間を表現するための簡易ユーティリティです。
export const sleep = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));