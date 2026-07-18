"use client";

import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  Newspaper,
  Search,
  Clock3,
  ArrowRight,
  BookOpen,
} from "lucide-react";

const articles = [
  {
    title: "Persiapan UKMPPD / UKOMNAS",
    category: "UKMPPD",
    time: "5 menit baca",
    description:
      "Strategi belajar yang efektif untuk menghadapi ujian kompetensi dokter.",
  },
  {
    title: "Tips Belajar Anatomi",
    category: "Anatomi",
    time: "4 menit baca",
    description:
      "Teknik menghafal anatomi lebih cepat dengan metode visual dan latihan soal.",
  },
  {
    title: "Belajar Histologi Lebih Mudah",
    category: "Histologi",
    time: "4 menit baca",
    description:
      "Memahami preparat histologi dengan pendekatan sederhana dan sistematis.",
  },
  {
    title: "Dasar Farmakologi",
    category: "Farmakologi",
    time: "6 menit baca",
    description:
      "Ringkasan obat-obatan penting yang sering muncul dalam CBT kedokteran.",
  },
  {
    title: "Persiapan OSCE",
    category: "OSCE",
    time: "5 menit baca",
    description:
      "Tips meningkatkan kepercayaan diri saat menghadapi ujian keterampilan klinis.",
  },
  {
    title: "Catatan Koas",
    category: "Koas",
    time: "3 menit baca",
    description:
      "Pengalaman dan tips menjalani kepaniteraan klinik dengan lebih efektif.",
  },
];

export default function BlogPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Blog MediVault"
        subtitle="Temukan artikel, tips belajar, dan informasi terbaru untuk membantu perjalanan Anda menjadi dokter yang kompeten."
        icon={<Newspaper size={40} />}
      />

      {/* SEARCH */}
      <section className="mx-auto max-w-6xl px-6">
        <div className="relative">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />

          <input
            type="text"
            placeholder="Cari artikel..."
            className="w-full rounded-[28px] border border-slate-200 bg-white py-5 pl-14 pr-6 text-lg shadow-lg outline-none transition focus:border-[#0F766E]"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {[
            "Semua",
            "UKMPPD",
            "OSCE",
            "Anatomi",
            "Histologi",
            "Farmakologi",
            "Koas",
          ].map((item) => (
            <button
              key={item}
              className="rounded-full border border-[#DDFBEF] bg-[#ECFDF5] px-5 py-2 font-semibold text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white"
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article.title}
              className="overflow-hidden rounded-[32px] border border-[#E7F6F0] bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#ECFDF5] to-[#DDFBEF]">
                <BookOpen
                  size={70}
                  className="text-[#0F766E]"
                />
              </div>

              <div className="p-8">
                <span className="rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-bold text-[#0F766E]">
                  {article.category}
                </span>

                <h2 className="mt-5 text-2xl font-black text-[#061B3A]">
                  {article.title}
                </h2>

                <p className="mt-4 leading-8 text-slate-600">
                  {article.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock3 size={16} />
                    {article.time}
                  </div>

                  <button className="flex items-center gap-2 font-bold text-[#0F766E] transition hover:gap-3">
                    Baca

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMING SOON */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-[36px] bg-gradient-to-r from-[#ECFDF5] to-white p-10 text-center shadow-lg">
          <h2 className="text-3xl font-black text-[#061B3A]">
            Artikel Baru Akan Terus Ditambahkan
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Tim Medivault akan secara berkala menghadirkan artikel terbaru
            mengenai pembelajaran kedokteran, tips UKMPPD, OSCE, koas,
            hingga pembahasan kasus klinis.
          </p>

          <div className="mt-8 inline-flex rounded-full bg-[#0F766E] px-8 py-4 font-bold text-white shadow-lg">
            🚀 Coming Soon
          </div>
        </div>
      </section>

      <InfoCTA />
    </InfoLayout>
  );
}