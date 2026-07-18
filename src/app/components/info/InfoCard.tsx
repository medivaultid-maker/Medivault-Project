"use client";

import { motion } from "framer-motion";

type InfoCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

export default function InfoCard({
  title,
  icon,
  children,
}: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      viewport={{ once: true }}
      className="rounded-[30px] border border-white/70 bg-white/90 p-8 shadow-[0_20px_60px_rgba(6,27,58,0.08)] backdrop-blur"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
          {icon}
        </div>

        <h2 className="text-2xl font-black text-[#061B3A]">
          {title}
        </h2>
      </div>

      <div className="leading-8 text-slate-600">
        {children}
      </div>
    </motion.div>
  );
}