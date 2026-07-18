"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function InfoCTA() {
  return (
    <section className="px-6 py-20">

      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={{ opacity: 0, y: 30 }}
        viewport={{ once: true }}
        className="mx-auto max-w-6xl rounded-[36px] bg-[#061B3A] p-12 text-center text-white shadow-[0_30px_80px_rgba(6,27,58,.2)]"
      >

        <h2 className="text-4xl font-black">
          Siap Meningkatkan Hasil Belajarmu?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/80">
  Ribuan soal latihan, pembahasan lengkap,
  dan simulasi CBT siap membantu perjalananmu
  menjadi dokter yang kompeten.
</p>

<div className="mt-12">
  <Link
    href="/simulasi"
    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
  >
    Mulai Simulasi
    <ArrowRight size={20} />
  </Link>
</div>

      </motion.div>

    </section>
  );
}