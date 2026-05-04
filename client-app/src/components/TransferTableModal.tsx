import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRightLeft, X, AlertCircle, Loader2, MoveRight } from "lucide-react";
import type { TableDto } from "../models/table";
import { TableStatus } from "../models/table";
import { cn } from "../lib/utils";
import { LinearSelect } from "./LinearSelect";

interface TransferTableModalProps {
  fromTableId: string;
  tables: TableDto[];
  onClose: () => void;
  onConfirm: (toTableId: string) => Promise<void>;
}

export const TransferTableModal: React.FC<TransferTableModalProps> = ({ fromTableId, tables, onClose, onConfirm }) => {
  const availableTargets = useMemo(
    () => tables.filter((t) => t.id !== fromTableId && t.status === TableStatus.Available),
    [tables, fromTableId],
  );
  const [toTableId, setToTableId] = useState<string>(availableTargets[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!availableTargets.length) {
      setToTableId("");
      return;
    }

    const isCurrentSelectionValid = availableTargets.some((table) => table.id === toTableId);
    if (!isCurrentSelectionValid) {
      setToTableId(availableTargets[0].id);
    }
  }, [availableTargets, toTableId]);

  const handleConfirm = async () => {
    if (!toTableId) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm(toTableId);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Khong the doi ban. Vui long thu lai.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex justify-center items-start md:items-center overflow-y-auto p-4 md:p-8 font-sans">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        className="relative w-full max-w-[440px] linear-surface p-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden my-auto z-10"
      >
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-brand-purple" />
              Doi ban
            </h2>
            <button onClick={onClose} className="p-1 px-1.5 text-brand-gray hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-brand-gray font-medium">Chuyen don hang dang mo sang ban khac.</p>
        </div>

        <div className="px-8 py-8 space-y-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="p-4 rounded-xl text-xs font-bold flex items-center gap-3 border overflow-hidden bg-rose-500/10 border-rose-500/20 text-rose-400"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="break-words line-clamp-2">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-brand-gray font-bold text-sm">
                  {tables.find(t => t.id === fromTableId)?.name.split(' ').pop()}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-gray">Tu Ban</span>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 blur-lg bg-brand-purple/20 animate-pulse" />
                <div className="relative p-3 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple">
                  <MoveRight className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-sm">
                  {tables.find(t => t.id === toTableId)?.name.split(' ').pop() || "?"}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple">Den Ban</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-4">
              <label className="text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">Chon ban dich</label>
              {availableTargets.length === 0 ? (
                <div className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-brand-gray italic">
                  Khong co ban trong
                </div>
              ) : (
                <LinearSelect
                  options={availableTargets.map(t => ({
                    value: t.id,
                    label: `${t.location} - ${t.name} (${t.capacity})`
                  }))}
                  value={toTableId}
                  onChange={(val) => setToTableId(val as string)}
                  className="w-full"
                />
              )}
            </div>
          </div>

          <button type="button" disabled={loading || !toTableId} onClick={() => void handleConfirm()} className="w-full btn-primary mt-2 flex items-center justify-center gap-2 py-3.5">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Xac nhan doi ban
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};
