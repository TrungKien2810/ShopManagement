import React from "react";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", children, className, ...rest }) => {
  const base = "px-4 py-2 rounded-xl font-bold transition-all inline-flex items-center gap-2";
  const variantClass =
    variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "bg-transparent";

  return (
    <button className={cn(base, variantClass, className)} {...rest}>
      {children}
    </button>
  );
};

export default Button;
