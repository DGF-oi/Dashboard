// mock と real API を同じ呼び出し口で切り替える共通ヘルパーです。
export interface ExecuteApiParams<T> {
  useMock: boolean;
  mock: () => Promise<T>;
  real: () => Promise<T>;
}

export const executeApi = async <T>({ useMock, mock, real }: ExecuteApiParams<T>) => {
  if (useMock) {
    return mock();
  }

  return real();
};