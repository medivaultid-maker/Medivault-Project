"use client";

import { useState } from "react";

import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  CircleHelp,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const faqs = [
  {
    question: "Apa itu Medivault?",
    answer:
      "Medivault merupakan platform pembelajaran digital yang menyediakan bank soal, simulasi CBT, pembahasan lengkap, dan dashboard perkembangan belajar khusus untuk mahasiswa kedokteran.",
  },
  {
    question: "Apakah harus membeli token?",
    answer:
      "Ya. Beberapa simulasi premium memerlukan token agar dapat diakses. Token dapat dibeli melalui halaman Akses Latihan.",
  },
  {
    question: "Apakah hasil ujian tersimpan?",
    answer:
      "Ya. Seluruh riwayat simulasi, nilai, dan hasil pengerjaan akan tersimpan pada akun Anda sehingga dapat dipelajari kembali.",
  },
  {
    question: "Bisakah mengulang simulasi?",
    answer:
      "Tentu. Anda dapat mengulang simulasi kapan saja selama masih memiliki akses terhadap paket soal tersebut.",
  },
  {
    question: "Apakah Medivault dapat diakses melalui HP?",
    answer:
      "Ya. Medivault dapat diakses melalui laptop, tablet, maupun smartphone menggunakan browser.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <InfoLayout>
      <InfoHero
        title="Frequently Asked Questions"
        subtitle="Temukan jawaban atas pertanyaan yang paling sering diajukan mengenai penggunaan MediVault."
        icon={<CircleHelp size={40} />}
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
            placeholder="Cari pertanyaan..."
            className="w-full rounded-[28px] border border-slate-200 bg-white py-5 pl-14 pr-6 text-lg shadow-lg outline-none transition focus:border-[#0F766E]"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className="overflow-hidden rounded-[30px] border border-[#E7F6F0] bg-white shadow transition hover:shadow-xl"
            >
              <button
                onClick={() =>
                  setOpen(open === index ? null : index)
                }
                className="flex w-full items-center justify-between p-7 text-left"
              >
                <h2 className="text-xl font-black text-[#061B3A]">
                  {faq.question}
                </h2>

                {open === index ? (
                  <ChevronUp className="text-[#0F766E]" />
                ) : (
                  <ChevronDown className="text-slate-500" />
                )}
              </button>

              {open === index && (
                <div className="border-t border-slate-100 px-7 pb-7 pt-5">
                  <p className="leading-8 text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="rounded-[36px] bg-gradient-to-r from-[#ECFDF5] to-white p-10 text-center shadow-lg">
          <h2 className="text-3xl font-black text-[#061B3A]">
            Masih belum menemukan jawaban?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Jika pertanyaan Anda belum terjawab, silakan hubungi tim
            Medivault melalui halaman Kontak. Kami siap membantu Anda.
          </p>

          <a
  href="/kontak"
  className="mt-8 inline-flex items-center rounded-full bg-[#0F766E] px-8 py-4 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#0C665F] hover:shadow-xl"
>
  Hubungi Kami
</a>
        </div>
      </section>

      <InfoCTA />
    </InfoLayout>
  );
}