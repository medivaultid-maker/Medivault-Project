"use client";

import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  ShieldCheck,
  Database,
  Lock,
  Eye,
  UserCheck,
  FileCheck,
} from "lucide-react";

export default function KebijakanPrivasiPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Kebijakan Privasi"
        subtitle="Privasi dan keamanan data pengguna merupakan prioritas utama Medivault dalam menyediakan layanan pembelajaran digital."
        icon={<ShieldCheck size={40} />}
      />

      {/* INTRO */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-10 shadow-lg">
          <h2 className="text-3xl font-black text-[#061B3A]">
            Komitmen Kami
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Medivault berkomitmen untuk melindungi setiap informasi pribadi
            yang diberikan oleh pengguna. Seluruh data dikelola secara
            bertanggung jawab dan digunakan hanya untuk mendukung pengalaman
            belajar yang lebih baik.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-2">
        {/* DATA */}
        <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
              <Database size={28} />
            </div>

            <h2 className="text-2xl font-black text-[#061B3A]">
              Data yang Kami Kumpulkan
            </h2>
          </div>

          <ul className="list-disc space-y-4 pl-6 leading-8 text-slate-600">
            <li>Nama pengguna.</li>
            <li>Alamat email.</li>
            <li>Riwayat simulasi dan hasil latihan.</li>
            <li>Data penggunaan platform untuk meningkatkan layanan.</li>
          </ul>
        </div>

        {/* USE */}
        <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
              <Eye size={28} />
            </div>

            <h2 className="text-2xl font-black text-[#061B3A]">
              Penggunaan Data
            </h2>
          </div>

          <ul className="list-disc space-y-4 pl-6 leading-8 text-slate-600">
            <li>Mengelola akun pengguna.</li>
            <li>Menyimpan riwayat simulasi dan hasil belajar.</li>
            <li>Meningkatkan kualitas layanan .</li>
            <li>Memberikan informasi mengenai pembaruan fitur.</li>
          </ul>
        </div>

        {/* SECURITY */}
        <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
              <Lock size={28} />
            </div>

            <h2 className="text-2xl font-black text-[#061B3A]">
              Perlindungan Data
            </h2>
          </div>

          <p className="leading-8 text-slate-600">
            Medivault tidak menjual, menyewakan, maupun membagikan data
            pribadi pengguna kepada pihak lain tanpa persetujuan pengguna,
            kecuali apabila diwajibkan oleh ketentuan hukum yang berlaku.
          </p>
        </div>

        {/* RIGHTS */}
        <div className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="rounded-2xl bg-[#ECFDF5] p-4 text-[#0F766E]">
              <UserCheck size={28} />
            </div>

            <h2 className="text-2xl font-black text-[#061B3A]">
              Hak Pengguna
            </h2>
          </div>

          <ul className="list-disc space-y-4 pl-6 leading-8 text-slate-600">
            <li>Melihat informasi akun yang dimiliki.</li>
            <li>Memperbarui data pribadi apabila diperlukan.</li>
            <li>Meminta penghapusan akun sesuai kebijakan yang berlaku.</li>
            <li>Menghubungi tim Medivault apabila memiliki pertanyaan mengenai privasi.</li>
          </ul>
        </div>
      </section>

      {/* NOTE */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[36px] bg-gradient-to-r from-[#ECFDF5] to-white p-10 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-[#0F766E] p-4 text-white">
              <FileCheck size={28} />
            </div>

            <h2 className="text-3xl font-black text-[#061B3A]">
              Pembaruan Kebijakan
            </h2>
          </div>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Kebijakan Privasi ini dapat diperbarui sewaktu-waktu untuk
            menyesuaikan perkembangan layanan MediVault maupun ketentuan
            hukum yang berlaku. Setiap perubahan akan dipublikasikan pada
            halaman ini.
          </p>
        </div>
      </section>

      <InfoCTA />
    </InfoLayout>
  );
}