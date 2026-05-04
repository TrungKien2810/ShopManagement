import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

interface Option {
  value: string | number;
  label: string;
}

interface LinearSelectProps {
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  className?: string;
}

export const LinearSelect: React.FC<LinearSelectProps> = ({ options, value, onChange, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative min-w-[120px]", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-black/30 border border-white/[0.08] rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/[0.05] hover:border-white/[0.15] outline-none",
          isOpen ? "border-brand-purple ring-1 ring-brand-purple/20 bg-white/[0.02]" : ""
        )}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown className={cn("w-4 h-4 text-brand-gray transition-transform duration-200", isOpen ? "rotate-180 text-brand-purple" : "")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 z-[60] mt-1 bg-[#12141c] border border-white/[0.08] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl"
          >
            <div className="p-1.5 flex flex-col gap-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all",
                    option.value === value
                      ? "bg-brand-purple text-white"
                      : "text-brand-gray hover:text-white hover:bg-white/[0.05]"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
