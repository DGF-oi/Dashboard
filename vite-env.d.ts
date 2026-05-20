// Vite が提供する環境変数型と JSON import を TypeScript に認識させるための宣言ファイルです。
/// <reference types="vite/client" />

declare module "*.json" {
	const value: Record<string, unknown>;
	export default value;
}
