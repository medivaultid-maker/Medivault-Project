"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
};

export default function InfoHero({
  title,
  subtitle,
  icon,
}: Props) {
  return (
    <section className="px-6 pt-12 pb-16">

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .6 }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[38px] border border-white/70 bg-white/80 p-12 shadow-[0_35px_90px_rgba(6,27,58,.08)] backdrop-blur"
      >

        {/* Blur */}
        <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-[#0F766E]/10 blur-3xl"/>

        <div className="absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-[#234F42]/10 blur-3xl"/>

        <div className="relative">

          <div className="mb-8 flex justify-center">

            <span className="inline-flex items-center gap-2 rounded-full bg-[#ECFDF5] px-5 py-2 text-sm font-bold text-[#0F766E]">

              <ShieldCheck size={16}/>

              Trusted Medical Learning Platform

            </span>

          </div>

          <div className="mb-8 flex justify-center">

            <div className="relative">

              <div className="absolute inset-0 rounded-full bg-[#0F766E]/20 blur-xl animate-pulse"/>

              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#ECFDF5] text-[#0F766E] shadow-lg">

                {icon}

              </div>

            </div>

          </div>

          <div className="text-center">

            <h1 className="text-5xl font-black text-[#061B3A]">

              {title}

            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">

              {subtitle}

            </p>

            <div className="mt-8 font-semibold text-[#234F42]">

              🩺 Dibangun untuk Mahasiswa Kedokteran Indonesia

            </div>

            <div className="mt-8 text-sm text-slate-500">

              <Link href="/">Beranda</Link>

              <span className="mx-2">/</span>

              {title}

            </div>

          </div>

        </div>

      </motion.div>

    </section>
  );
}