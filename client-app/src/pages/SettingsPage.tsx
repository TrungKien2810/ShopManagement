import React from "react";
import { motion } from "framer-motion";
import { Settings, Shield, Bell, CreditCard, User, Sliders } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const sections = [
    { title: "Tài khoản", icon: User, desc: "Quản lý thông tin cá nhân và định danh" },
    { title: "Bảo mật", icon: Shield, desc: "Mật khẩu, 2FA và quyền truy cập" },
    { title: "Thông báo", icon: Bell, desc: "Tùy chỉnh thông báo đẩy và email" },
    { title: "Gói dịch vụ", icon: CreditCard, desc: "Quản lý đăng ký SaaS và thanh toán" },
    { title: "Cấu hình hệ thống", icon: Sliders, desc: "Tùy chỉnh giao diện và ngôn ngữ" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Cài đặt hệ thống</h2>
        <p className="text-sm text-brand-gray uppercase tracking-widest font-bold text-[10px]">Quản lý cấu hình tài khoản và ứng dụng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="linear-card p-6 group hover:border-brand-purple/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center group-hover:bg-brand-purple/20 transition-all">
                <section.icon className="w-6 h-6 text-brand-purple" />
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-brand-purple-light transition-colors">{section.title}</h3>
                <p className="text-xs text-brand-gray">{section.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="linear-surface rounded-2xl border border-white/[0.05] p-12 text-center border-dashed">
        <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-6 mx-auto">
          <Settings className="w-8 h-8 text-brand-purple animate-spin-slow" />
        </div>
        <h3 className="text-xl font-bold mb-2">Tính năng đang phát triển</h3>
        <p className="text-sm text-brand-gray mb-0">
          Chúng tôi đang hoàn thiện các modul cài đặt chuyên sâu. Vui lòng quay lại sau!
        </p>
      </div>
    </div>
  );
};
