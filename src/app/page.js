"use client";

import Link from "next/link";
import Navbar from "./components/Navbar";
import {
  FileCheck2,
  BarChart3,
  CreditCard,
  LayoutDashboard,
  User,
  Microscope,
  Stethoscope,
  Trophy,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./globals.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "Sen", skor: 75 },
  { name: "Sel", skor: 80 },
  { name: "Rab", skor: 85 },
  { name: "Kam", skor: 83 },
  { name: "Jum", skor: 88 },
  { name: "Sab", skor: 90 },
  { name: "Min", skor: 85 },
];

function InstagramIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.5 21v-7h2.3l.4-3h-2.7V9.2c0-.9.2-1.5 1.5-1.5h1.3V5.1c-.2 0-1-.1-2-.1-2 0-3.4 1.2-3.4 3.6V11H8.5v3h2.4v7h2.6Z" />
    </svg>
  );
}

function TwitterIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.2L6.7 21H3.6l7.3-8.3L1 3h6.2l4.3 5.7L18.9 3Zm-1.1 16h1.7L6.3 4.9H4.5L17.8 19Z" />
    </svg>
  );
}

function YoutubeIcon({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21.6 7.2a2.9 2.9 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2 12a30 30 0 0 0 .4 4.8 2.9 2.9 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.9 2.9 0 0 0 2-2A30 30 0 0 0 22 12a30 30 0 0 0-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}
export default function Home() {
  const { scrollY } = useScroll();

  const yBg1 = useTransform(scrollY, [0, 300], [0, 120]);
  const yBg2 = useTransform(scrollY, [0, 300], [0, -100]);
  const yHero = useTransform(scrollY, [0, 300], [0, -35]);

  const features = [
  {
    icon: <FileCheck2 size={24} />,
    title: "Simulasi CBT & Praktikum",
    desc: "Latihan soal CBT dan praktikum dengan tampilan yang menyerupai ujian.",
    iconStyle: "bg-[#DDFBEF] text-[#0F766E]",
    arrowStyle: "bg-[#DDFBEF] text-[#0F766E]",
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Skor & Pembahasan",
    desc: "Lihat nilai, pembahasan, dan evaluasi setelah menyelesaikan latihan.",
    iconStyle: "bg-[#EEF6F3] text-[#234F42]",
  arrowStyle: "bg-[#EEF6F3] text-[#234F42]",
  },
  {
    icon: <CreditCard size={24} />,
    title: "Akses Latihan",
    desc: "Pilih paket akses sesuai kebutuhan untuk mulai mengerjakan latihan soal.",
    iconStyle: "bg-[#DDF8FF] text-[#06A6C9]",
    arrowStyle: "bg-[#DDF8FF] text-[#06A6C9]",
  },
  {
    icon: <LayoutDashboard size={24} />,
    title: "Dashboard Belajar",
    desc: "Lihat riwayat latihan, skor, dan perkembangan belajarmu.",
    iconStyle: "bg-[#F8F5E8] text-[#D4AF37]",
  arrowStyle: "bg-[#F8F5E8] text-[#D4AF37]",
  },
];

  const stats = [
    {
      label: "Modul Pembelajaran",
      value: "120+",
      desc: "Materi pembelajaran yang disusun secara ringkas dan sistematis.",
    },
    {
      label: "Simulasi Ujian",
      value: "CBT & Praktikum",
      desc: "Simulasi ujian dengan timer, penilaian otomatis, dan pembahasan soal.",
    },
    {
      label: "Perkembangan Belajar",
      value: "Real-time",
      desc: "Lihat perkembangan hasil belajar dari setiap latihan yang dikerjakan.",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#EEF6F3_0%,#F8FAFC_35%,#FFFFFF_100%)] text-[#0A1733] font-sans">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pt-8 pb-20 md:px-12 md:pt-12 md:pb-24">
        <motion.div
          style={{ y: yBg1 }}
          className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-[#234F42]/10 blur-3xl"
        />

        <motion.div
          style={{ y: yBg2 }}
          className="pointer-events-none absolute top-20 -right-28 h-96 w-96 rounded-full bg-[#0A1733]/10 blur-3xl"
        />

        <motion.div
          style={{ y: yHero }}
          initial={{ opacity: 0, y: 38 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 rounded-[36px] border border-white/70 bg-white/75 p-6 shadow-[0_30px_90px_rgba(6,27,58,0.10)] backdrop-blur-xl md:flex-row md:p-10"
        >
          {/* HERO LEFT */}
          <div className="flex-1 text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white/80 px-5 py-2 text-sm font-bold text-[#061B3A] shadow-sm backdrop-blur">
              <Stethoscope size={16} className="text-[#0F766E]" />
              CBT • Materi • Dashboard Belajar
            </div>

            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-[#061B3A] md:text-6xl">
              Persiapan Ujian
              <br />
              <span className="bg-gradient-to-r from-[#234F42] via-[#0A1733] to-[#234F42] bg-clip-text text-transparent">
                Dimulai dari Latihan yang Tepat
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base font-medium leading-8 text-slate-600 md:text-lg">
              Medivault membantu mahasiswa kedokteran mempersiapkan ujian melalui latihan soal CBT, pembahasan yang mudah dipahami, dan analisis hasil belajar.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
  href="/simulasi"
  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-bold text-[#0A1733] shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
>
  Mulai Latihan
</Link>

              <div className="flex items-center gap-2 text-sm font-semibold text-[#061B3A]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEF6F3]
text-[#234F42]">
                  <User size={18} />
                </div>
                Dirancang untuk <span className="font-extrabold">mahasiswa kedokteran Indonesia</span>{" "}
      
              </div>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CheckCircle2 size={17} className="text-[#0F766E]" />
                Pembahasan Soal
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CheckCircle2 size={17} className="text-[#0F766E]" />
                Materi Ringkas
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                <CheckCircle2 size={17} className="text-[#0F766E]" />
                Catatan Kedokteran
              </div>
            </div>
          </div>

          {/* HERO RIGHT PANEL */}
          <div className="w-full flex-1 md:max-w-md">
            <div className="rounded-[32px] border border-white/80 bg-white/95 p-6 shadow-[0_24px_70px_rgba(6,27,58,0.14)] backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#0F766E]">
                    Perkembangan Belajar Mingguan
                  </p>
                  <h3 className="mt-1 text-xl font-extrabold text-[#061B3A]">
                    Hasil Latihan
                  </h3>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
                  <Trophy size={22} />
                </div>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-[#ECFDF5] p-4 text-center">
                  <div className="text-2xl font-extrabold text-[#0F766E]">
                    85
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Skor Akhir
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-center">
                  <div className="text-xl font-extrabold text-[#061B3A]">
                    42
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Benar
                  </div>
                </div>

                <div className="rounded-2xl bg-[#F8F5E8] p-4 text-center">
                  <div className="text-xl font-extrabold text-[#D4AF37]">
                    8
                  </div>
                  <div className="mt-1 text-xs font-semibold text-slate-500">
                    Salah
                  </div>
                </div>
              </div>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 8, left: -18, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#64748B", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748B", fontSize: 12 }}
                      domain={[70, 100]}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E2E8F0",
                        borderRadius: 14,
                        boxShadow: "0 12px 30px rgba(6,27,58,0.12)",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="skor"
                      stroke="#234F42"
                      strokeWidth={3}
                      dot={{ r: 4, fill:"#234F42", strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#D4AF37", strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="text-sm font-semibold leading-6 text-slate-600">
                  Lanjutkan belajar:
                  <span className="ml-1 font-extrabold text-[#061B3A]">
                    Histologi Jaringan Epitel
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              className={`rounded-[28px] border border-slate-100 p-6 shadow-[0_14px_40px_rgba(6,27,58,0.06)] ${
                i === 2
                  ? "bg-[#0A1733] text-white"
                  : "bg-white text-[#061B3A]"
              }`}
            >
              <p
                className={`text-sm font-bold ${
                  i === 2 ? "text-white/70" : "text-slate-500"
                }`}
              >
                {item.label}
              </p>

              <h3 className="mt-2 text-4xl font-extrabold">{item.value}</h3>

              <p
                className={`mt-3 text-sm font-medium leading-6 ${
                  i === 2 ? "text-white/70" : "text-slate-500"
                }`}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FITUR */}
<section id="fitur" className="px-6 pb-28 md:px-12">
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    viewport={{ once: true }}
    className="mx-auto mb-14 max-w-4xl text-center"
  >
    <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full bg-[#DDFBEF] px-4 py-2 text-sm font-extrabold uppercase tracking-tight text-[#0F766E]">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0F766E] text-white">
        <CheckCircle2 size={12} />
      </span>
      Fitur Utama
    </div>

    <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-[#061B3A] md:text-4xl">
      Semua yang Dibutuhkan untuk Persiapan Ujian
    </h2>

    <p className="mt-4 text-base font-medium leading-7 text-slate-500 md:text-lg">
      Belajar, berlatih, dan memantau perkembangan dalam satu platform.
    </p>
  </motion.div>

  <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
    {features.map((item, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12, duration: 0.5 }}
        viewport={{ once: true }}
        className="group flex min-h-[270px] flex-col rounded-[26px] border border-slate-200/70 bg-white p-6 shadow-[0_14px_40px_rgba(6,27,58,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(6,27,58,0.11)]"
      >
        <div
          className={`mb-5 flex h-[58px] w-[58px] items-center justify-center rounded-[16px] ${item.iconStyle}`}
        >
          {item.icon}
        </div>

        <h3 className="min-h-[56px] text-[19px] font-black leading-[1.35] tracking-[-0.03em] text-[#061B3A]">
          {item.title}
        </h3>

        <p className="mt-3 min-h-[88px] text-[15px] font-medium leading-7 text-slate-500">
          {item.desc}
        </p>

        <div className="mt-auto flex justify-end">
          <Link
            href="/simulasi"
            className={`flex h-10 w-10 items-center justify-center rounded-full transition group-hover:scale-110 ${item.arrowStyle}`}
          >
            <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    ))}
  </div>
</section>

      {/* CTA */}
      <section className="px-6 pb-28 md:px-12">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] bg-[#0A1733] p-8 shadow-[0_30px_90px_rgba(6,27,58,0.22)] md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.4fr_0.6fr] md:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#BFC7D5]">
                Catatan Kedokteran
              </p>

              <h2 className="max-w-3xl text-3xl font-extrabold leading-tight text-white md:text-4xl">
                Akses Semua Materi Kedokteran dalam Satu Platform
              </h2>

              <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/70">
                Temukan ebook, rangkuman blok, atlas anatomi, histologi, catatan praktikum, dan materi pendukung lainnya dalam satu platform.
              </p>
            </div>

            <div className="flex md:justify-end">
              <button
  onClick={() => alert("Fitur materi sedang dalam pengembangan.")}
  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-extrabold text-[#061B3A] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#ECFDF5]"
>
  Jelajahi Materi
</button>
            </div>
          </div>
        </div>
      </section>

            {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/95 py-10">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.9fr_1.4fr]">
            
            {/* BRAND */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/LOGO_MEDIVAULT.png"
                  alt="Medivault Exam"
                  className="h-11 w-11 auto object-contain"
                />
              </div>

              <p className="mt-5 max-w-xs text-sm font-medium leading-6 text-slate-500">
                Platform latihan soal kedokteran yang membantu mahasiswa belajar lebih terarah dan siap menghadapi ujian.
              </p>

              <div className="mt-5 flex items-center gap-3">
  <a
    href="https://www.instagram.com/medivault.id/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram Medivault"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F766E]/20 hover:bg-[#ECFDF5] hover:text-[#0F766E]"
  >
    <InstagramIcon className="h-4 w-4" />
  </a>

  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook Medivault"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F766E]/20 hover:bg-[#ECFDF5] hover:text-[#0F766E]"
  >
    <FacebookIcon className="h-4 w-4" />
  </a>

  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Twitter Medivault"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F766E]/20 hover:bg-[#ECFDF5] hover:text-[#0F766E]"
  >
    <TwitterIcon className="h-4 w-4" />
  </a>

  <a
    href="#"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="YouTube Medivault"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0F766E]/20 hover:bg-[#ECFDF5] hover:text-[#0F766E]"
  >
    <YoutubeIcon className="h-4 w-4" />
  </a>
</div>
            </div>

            {/* NAVIGASI */}
            <div>
              <h3 className="mb-5 text-sm font-black text-[#061B3A]">
                Navigasi
              </h3>

              <ul className="space-y-3 text-sm font-medium text-slate-500">
                <li>
                  <Link
                    href="/"
                    className="font-bold text-[#0F766E] transition hover:text-[#061B3A]"
                  >
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="#fitur" className="transition hover:text-[#0F766E]">
                    Fitur
                  </Link>
                </li>
                <li>
                  <Link href="/simulasi" className="transition hover:text-[#0F766E]">
                    Simulasi
                  </Link>
                </li>
                <li>
                  <Link href="/token" className="transition hover:text-[#0F766E]">
                    Akses Latihan
                  </Link>
                </li>
              </ul>
            </div>

            {/* INFORMASI */}
            <div>
              <h3 className="mb-5 text-sm font-black text-[#061B3A]">
                Informasi
              </h3>

              <ul className="space-y-3 text-sm font-medium text-slate-500">
                <li>
                  <Link href="#" className="transition hover:text-[#0F766E]">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-[#0F766E]">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-[#0F766E]">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-[#0F766E]">
                    Kontak
                  </Link>
                </li>
              </ul>
            </div>

            {/* BANTUAN */}
            <div>
              <h3 className="mb-5 text-sm font-black text-[#061B3A]">
                Bantuan
              </h3>

              <ul className="space-y-3 text-sm font-medium text-slate-500">
                <li>
                  <Link href="#" className="transition hover:text-[#0F766E]">
                    Panduan Pengguna
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-[#0F766E]">
                    Syarat & Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-[#0F766E]">
                    Kebijakan Privasi
                  </Link>
                </li>
              </ul>
            </div>

            {/* NEWSLETTER */}
            <div>
              <h3 className="mb-4 text-sm font-black text-[#061B3A]">
                Update Medivault
              </h3>

              <p className="mb-4 max-w-xs text-sm font-medium leading-6 text-slate-500">
                Dapatkan informasi fitur terbaru dan konten belajar langsung melalui email.
              </p>

              <div className="flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Masukkan email kamu"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 outline-none transition placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                />

                <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#234F42] to-[#0F766E] text-white">
                  <Send size={17} />
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="mt-9 flex flex-col gap-3 border-t border-slate-200 pt-5 text-xs font-medium text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>© 2026 Medivault. All rights reserved.</p>

            <p>
              Mendukung perjalanan belajar calon dokter Indonesia <span className="text-[#D4AF37]">♥</span>
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}