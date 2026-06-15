import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface PaymentButtonProps {
  totalAmount: number;
  onPaymentSuccess: () => void;
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  totalAmount,
  onPaymentSuccess,
  className,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsModalOpen(false);
      onPaymentSuccess();
    }, 1500);
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className={className}
        variant="primary"
        aria-label="Mở thanh toán"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        Thanh toán
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => !isProcessing && setIsModalOpen(false)}
        title="Xác nhận thanh toán"
      >
        <div className="space-y-6">
          <div className="text-center">
            <p className="text-brand-gray text-sm mb-1">
              Tổng tiền cần thanh toán
            </p>
            <p className="text-3xl font-black text-white">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(totalAmount)}
            </p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
            <h4 className="text-xs font-bold text-brand-gray mb-3 uppercase tracking-wider">
              Phương thức thanh toán
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl border border-white/20">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Tiền mặt / Chuyển khoản
                  </p>
                  <p className="text-[10px] text-brand-gray">
                    Thanh toán tại quầy hoặc qua QR
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
              disabled={isProcessing}
              aria-label="Huy thanh toan"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              className="flex-[2]"
              onClick={handlePayment}
              disabled={isProcessing}
              aria-label="Xac nhan thanh toan"
            >
              {isProcessing ? "Đang xử lý..." : "Xác nhận đã trả tiền"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
