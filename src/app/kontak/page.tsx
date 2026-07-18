"use client";

import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  Mail,
  Clock3,
  PhoneCall,
  User,
  AtSign,
  MessageSquare,
  Send,
  Headset,
  Ticket,
  BookOpen,
  Bug,
} from "lucide-react";

import { FaInstagram } from "react-icons/fa";

export default function KontakPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Hubungi Kami"
        subtitle="Kami siap membantu apabila Anda mengalami kendala atau memiliki pertanyaan seputar penggunaan MediVault."
        icon={<PhoneCall size={40} />}
      />

      {/* CONTACT */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT */}
          <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-3xl font-black text-[#061B3A]">
              Informasi Kontak
            </h2>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
                  <Mail size={26} />
                </div>

                <div>
                  <h3 className="font-bold text-[#061B3A]">
                    Email
                  </h3>

                  <p className="mt-2 text-slate-600">
                    medivaultid@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
  <FaInstagram size={26} />
</div>

                <div>
                  <h3 className="font-bold text-[#061B3A]">
                    Instagram
                  </h3>

                  <p className="mt-2 text-slate-600">
                    @medivaultid
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
                  <Clock3 size={26} />
                </div>

                <div>
                  <h3 className="font-bold text-[#061B3A]">
                    Jam Operasional
                  </h3>

                  <p className="mt-2 text-slate-600">
                    Senin - Jumat
                  </p>

                  <p className="text-slate-600">
                    08.00 - 17.00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
            <h2 className="mb-8 text-3xl font-black text-[#061B3A]">
              Kirim Pesan
            </h2>

            <div className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-4 text-slate-400" size={20} />

                <input
                  placeholder="Nama"
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 outline-none focus:border-[#0F766E]"
                />
              </div>

              <div className="relative">
                <AtSign className="absolute left-4 top-4 text-slate-400" size={20} />

                <input
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 outline-none focus:border-[#0F766E]"
                />
              </div>

              <input
                placeholder="Subjek"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-[#0F766E]"
              />

              <div className="relative">
                <MessageSquare
                  className="absolute left-4 top-4 text-slate-400"
                  size={20}
                />

                <textarea
                  rows={5}
                  placeholder="Tulis pesan Anda..."
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 outline-none focus:border-[#0F766E]"
                />
              </div>

              <button className="inline-flex items-center gap-3 rounded-full bg-[#0F766E] px-8 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#0C665F]">
                <Send size={18} />
                Kirim Pesan
              </button>

              <p className="text-sm text-slate-500">
                *Fitur pengiriman pesan akan segera tersedia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HELP */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="mb-10 text-center text-4xl font-black text-[#061B3A]">
          Kami Dapat Membantu Anda
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              icon: <Headset size={32} />,
              title: "Bantuan Akun",
            },
            {
              icon: <Ticket size={32} />,
              title: "Masalah Token",
            },
            {
              icon: <BookOpen size={32} />,
              title: "Pertanyaan Materi",
            },
            {
              icon: <Bug size={32} />,
              title: "Laporan Bug",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[28px] border border-[#E7F6F0] bg-white p-8 text-center shadow transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex justify-center text-[#0F766E]">
                {item.icon}
              </div>

              <h3 className="font-bold text-[#061B3A]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <InfoCTA />
    </InfoLayout>
  );
}