"use client";

import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  BookOpen,
  UserPlus,
  LogIn,
  Ticket,
  FileCheck,
  BarChart3,
  Lightbulb,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: <UserPlus size={30} />,
    title: "1. Membuat Akun",
    description:
      "Klik tombol Daftar pada halaman utama, isi data yang diperlukan, kemudian lakukan login menggunakan akun Anda.",
  },
  {
    icon: <LogIn size={30} />,
    title: "2. Login ke Medivault",
    description:
      "Masuk menggunakan email dan password yang telah didaftarkan untuk mengakses seluruh fitur pembelajaran.",
  },
  {
    icon: <Ticket size={30} />,
    title: "3. Akses Latihan",
    description:
      "Masuk ke halaman Akses Latihan untuk membeli token apabila paket soal yang dipilih memerlukannya.",
  },
  {
    icon: <FileCheck size={30} />,
    title: "4. Mulai Simulasi",
    description:
      "Pilih kategori, tentukan paket soal, lalu kerjakan simulasi CBT sesuai waktu yang tersedia.",
  },
  {
    icon: <BarChart3 size={30} />,
    title: "5. Lihat Hasil",
    description:
      "Setelah simulasi selesai, nilai, pembahasan, dan riwayat pengerjaan akan langsung tersedia pada dashboard Anda.",
  },
];

export default function PanduanPenggunaPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Panduan Pengguna"
        subtitle="Pelajari langkah-langkah menggunakan Medivault mulai dari membuat akun hingga melihat hasil simulasi CBT."
        icon={<BookOpen size={40} />}
      />

      {/* STEPS */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-8">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-[30px] border border-[#E7F6F0] bg-white p-8 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
                  {step.icon}
                </div>

                <div>
                  <h2 className="text-2xl font-black text-[#061B3A]">
                    {step.title}
                  </h2>

                  <p className="mt-4 leading-8 text-slate-600">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TIPS */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-[32px] bg-gradient-to-r from-[#ECFDF5] to-white p-10 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F766E] text-white">
              <Lightbulb size={28} />
            </div>

            <h2 className="text-3xl font-black text-[#061B3A]">
              Tips Menggunakan 
            </h2>
          </div>

          <ul className="list-disc space-y-4 pl-6 text-lg leading-8 text-slate-600">
            <li>Gunakan koneksi internet yang stabil saat mengerjakan simulasi.</li>
            <li>Kerjakan soal dengan fokus tanpa berpindah tab atau aplikasi.</li>
            <li>Pelajari pembahasan setelah simulasi selesai untuk memahami konsep yang belum dikuasai.</li>
            <li>Lakukan latihan secara rutin agar kemampuan analisis klinis terus meningkat.</li>
            <li>Pantau perkembangan belajar melalui dashboard Medivault.</li>
          </ul>
        </div>
      </section>

      {/* HELP */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-[36px] bg-gradient-to-r from-[#ECFDF5] to-white p-10 text-center shadow-lg">
          <h2 className="text-3xl font-black text-[#061B3A]">
            Masih Bingung Menggunakan Medivault?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Jangan khawatir. Tim kami siap membantu apabila Anda mengalami
            kendala saat menggunakan Medivault.
          </p>

          <a
            href="/kontak"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#0F766E] px-8 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#0C665F]"
          >
            Hubungi Kami
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      <InfoCTA />
    </InfoLayout>
  );
}