// settings の theme 値を HTML の data-theme 属性へ反映する provider です。
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useAppSelector } from "@/app/store/hooks";

const resolveTheme = (theme: "light" | "dark" | "system") => {
  // system の場合だけ OS の配色設定を参照します。
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return theme;
};

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const theme = useAppSelector((state) => state.settings.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = resolveTheme(theme);
  }, [theme]);

  return children;
};