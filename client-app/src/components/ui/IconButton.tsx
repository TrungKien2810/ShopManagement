import React from "react";
import { cn } from "../../lib/utils";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ children, className, title, ...rest }) => {
  return (
    <button aria-label={title} title={title} className={cn("p-2 rounded-lg hover:bg-white/[0.04] transition-all", className)} {...rest}>
      {children}
    </button>
  );
};

export default IconButton;
