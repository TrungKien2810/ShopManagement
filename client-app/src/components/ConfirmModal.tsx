import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/utils";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Hộp thoại xác nhận dùng chung — thay thế window.confirm để đồng bộ với
 * design system (dark Linear). Có focus trap cơ bản + đóng bằng phím Escape.
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  description,
  confirmLabel = "Xác nhận",
  cancelLabel = "Hủy",
  tone = "primary",
  loading = false,
  onConfirm,
  onCancel,
}) => {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onCancel]);

  const isDanger = tone === "danger";

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[600] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onCancel()}
            className="absolute inset-0 bg-void/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-sm linear-surface p-8 shadow-2xl border border-white/[0.1]"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-6",
                  isDanger ? "bg-rose-500/10" : "bg-brand-purple/10",
                )}
              >
                {isDanger ? (
                  <AlertTriangle className="w-8 h-8 text-rose-400" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-brand-purple" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
              {description && (
                <p className="text-sm text-brand-gray mb-8">{description}</p>
              )}
              <div className={cn("grid grid-cols-2 gap-3 w-full", !description && "mt-4")}>
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="py-3 px-4 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl text-xs font-bold transition-all disabled:opacity-50 focus:ring-2 focus:ring-white/20 outline-none"
                >
                  {cancelLabel}
                </button>
                <button
                  ref={confirmRef}
                  onClick={onConfirm}
                  disabled={loading}
                  className={cn(
                    "py-3 px-4 rounded-xl text-xs font-bold transition-all text-white disabled:opacity-50 outline-none focus:ring-2",
                    isDanger
                      ? "bg-rose-500 hover:bg-rose-600 focus:ring-rose-500/40"
                      : "bg-brand-purple hover:bg-ember-bright shadow-lg shadow-brand-purple/25 focus:ring-amber/40",
                  )}
                >
                  {loading ? "Đang xử lý..." : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
