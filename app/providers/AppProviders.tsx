// Redux / React Query / i18n / Theme をまとめて注入する最上位 provider です。
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { store } from "@/app/store/createAppStore";
import i18n from "@/app/i18n/i18n";
import { ThemeProvider } from "@/app/providers/ThemeProvider";

const queryClient = new QueryClient({
  // 一般的な業務画面向けの無難な query 既定値を設定しています。
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>{children}</ThemeProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </Provider>
  );
};