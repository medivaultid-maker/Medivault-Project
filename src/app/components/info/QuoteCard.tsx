"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  quote: string;
};

export default function QuoteCard({ quote }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: .25 }}
      className="mx-auto mb-10 max-w-4xl rounded-[28px] border border-[#DDFBEF] bg-[#F8FFFC] p-8"
    >
      <Quote
        className="mb-4 text-[#0F766E]"
        size={28}
      />

      <p className="text-xl italic leading-9 text-[#234F42]">
        "{quote}"
      </p>

      <p className="mt-5 font-bold text-[#061B3A]">
        — Medivault
      </p>
    </motion.div>
  );
}