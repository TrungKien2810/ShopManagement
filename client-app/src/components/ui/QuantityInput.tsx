import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

interface QuantityInputProps {
  value: number;
  onChange: (newVal: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max,
  className,
}) => {
  const canDecrement = value > min;
  const canIncrement = max === undefined || value < max;

  return (
    <div className={cn("inline-flex items-center gap-1 bg-black/30 border border-white/[0.08] rounded-lg", className)}>
      <button
        type="button"
        aria-label="Giảm số lượng"
        onClick={() => canDecrement && onChange(value - 1)}
        disabled={!canDecrement}
        className={cn(
          "p-1.5 rounded-l-lg transition-all",
          canDecrement
            ? "hover:bg-white/10 text-white"
            : "opacity-30 cursor-not-allowed text-brand-gray"
        )}
      >
        <Minus className="w-3 h-3" />
      </button>

      <span
        aria-live="polite"
        aria-label={`Số lượng: ${value}`}
        className="w-8 text-center text-sm font-bold text-white select-none"
      >
        {value}
      </span>

      <button
        type="button"
        aria-label="Tăng số lượng"
        onClick={() => canIncrement && onChange(value + 1)}
        disabled={!canIncrement}
        className={cn(
          "p-1.5 rounded-r-lg transition-all",
          canIncrement
            ? "hover:bg-white/10 text-white"
            : "opacity-30 cursor-not-allowed text-brand-gray"
        )}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
