"use client";

import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  FileText,
  User,
  Ticket,
  ShieldCheck,
  Lock,
  Ban,
  RefreshCcw,
} from "lucide-react";

export default function SyaratKetentuanPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Syarat & Ketentuan"
        subtitle="Dengan menggunakan, Anda dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku."
        icon={<FileText size={40} />}
      />

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-10 shadow-lg">
          <h2 className="text-3xl font-black text-[#061B3A]">
            Ketentuan Umum
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
             Menyediakan platform pembelajaran digital untuk
            membantu mahasiswa kedokteran dalam mempersiapkan ujian dan
            meningkatkan kompetensi akademik. Dengan menggunakan layanan
            ini, pengguna menyetujui seluruh ketentuan yang tercantum
            pada halaman ini.
          </p>
        </div>
      </section>

      {/* RULES */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">

          <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
                <User size={28} />
              </div>

              <h2 className="text-2xl font-black text-[#061B3A]">
                Penggunaan Akun
              </h2>
            </div>

            <ul className="list-disc space-y-4 pl-6 leading-8 text-slate-600">
              <li>Satu akun hanya boleh digunakan oleh satu pengguna.</li>
              <li>Pengguna bertanggung jawab menjaga kerahasiaan akun dan kata sandi.</li>
              <li>Segala aktivitas pada akun menjadi tanggung jawab pemilik akun.</li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
                <Ticket size={28} />
              </div>

              <h2 className="text-2xl font-black text-[#061B3A]">
                Token & Pembayaran
              </h2>
            </div>

            <ul className="list-disc space-y-4 pl-6 leading-8 text-slate-600">
              <li>Token digunakan untuk mengakses simulasi tertentu.</li>
              <li>Token yang telah dibeli tidak dapat dikembalikan maupun ditukar.</li>
              <li>Pastikan pembelian dilakukan sesuai kebutuhan.</li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
                <ShieldCheck size={28} />
              </div>

              <h2 className="text-2xl font-black text-[#061B3A]">
                Hak Cipta
              </h2>
            </div>

            <ul className="list-disc space-y-4 pl-6 leading-8 text-slate-600">
              <li>Seluruh soal, pembahasan, dan materi merupakan milik .</li>
              <li>Dilarang menyalin, menyebarluaskan, atau memperjualbelikan konten tanpa izin tertulis.</li>
            </ul>
          </div>

          <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
                <Ban size={28} />
              </div>

              <h2 className="text-2xl font-black text-[#061B3A]">
                Penyalahgunaan
              </h2>
            </div>

            <ul className="list-disc space-y-4 pl-6 leading-8 text-slate-600">
              <li>Penyalahgunaan layanan dapat mengakibatkan pembatasan akses.</li>
              <li> Berhak menonaktifkan akun yang melanggar ketentuan.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* UPDATE */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[36px] bg-gradient-to-r from-[#ECFDF5] to-white p-10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[#0F766E] p-4 text-white">
              <RefreshCcw size={28} />
            </div>

            <h2 className="text-3xl font-black text-[#061B3A]">
              Perubahan Ketentuan
            </h2>
          </div>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Medivault berhak melakukan pembaruan terhadap layanan, fitur,
            maupun syarat dan ketentuan sewaktu-waktu. Setiap perubahan
            akan dipublikasikan melalui halaman ini sehingga pengguna
            selalu memperoleh informasi terbaru.
          </p>

          <div className="mt-8 rounded-2xl border border-[#DDFBEF] bg-white p-6">
            <div className="flex items-center gap-3 font-bold text-[#0F766E]">
              <Lock size={22} />
              Keamanan & Kepatuhan
            </div>

            <p className="mt-3 leading-7 text-slate-600">
              Dengan tetap menggunakan Medivault setelah adanya perubahan,
              pengguna dianggap telah menyetujui syarat dan ketentuan yang
              diperbarui.
            </p>
          </div>
        </div>
      </section>

      <InfoCTA />
    </InfoLayout>
  );
}