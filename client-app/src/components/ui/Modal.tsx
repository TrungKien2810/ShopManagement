import React, { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/40"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                delay: 0.05
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.94, 
              y: 10,
              transition: { duration: 0.2 }
            }}
            className={cn(
              "relative w-full max-w-lg linear-surface p-8 shadow-2xl border border-white/[0.1] z-[60]",
              className
            )}
          >
            {title && (
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/[0.05] rounded-lg text-brand-gray hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
