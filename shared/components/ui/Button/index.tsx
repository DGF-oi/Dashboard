// Bootstrap の見た目に寄せた共通 Button ラッパーです。
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type Variant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  variant?: Variant;
}

export const Button = ({ children, className = "", variant = "primary", ...props }: ButtonProps) => {
  // variant は Bootstrap の class 名へ変換して扱います。
  const variantClass = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "btn-outline-secondary";

  return (
    <button className={`btn ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
};