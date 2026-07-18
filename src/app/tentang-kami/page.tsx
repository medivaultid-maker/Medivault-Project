import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCard from "../components/info/InfoCard";
import QuoteCard from "../components/info/QuoteCard";
import InfoCTA from "../components/info/InfoCTA";

import {
  Stethoscope,
  Eye,
  Target,
  BookOpen,
  Brain,
  BarChart3,
  FileText,
} from "lucide-react";

export default function TentangKamiPage() {
  return (
    <InfoLayout>
      <InfoHero
        title="Tentang Medivault"
        subtitle="Platform pembelajaran digital yang membantu mahasiswa kedokteran belajar lebih efektif melalui latihan soal, simulasi CBT, dan pembahasan yang komprehensif."
        icon={<Stethoscope size={40} />}
      />

      <QuoteCard quote="Every great doctor starts with a commitment to keep learning." />

      {/* ABOUT */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="font-semibold text-[#0F766E] uppercase tracking-widest">
              Who We Are
            </span>

            <h2 className="mt-4 text-4xl font-black text-[#061B3A]">
              Mengenal Medivault
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Medivault hadir untuk membantu mahasiswa kedokteran belajar
              dengan lebih efektif melalui simulasi CBT, bank soal
              berkualitas, pembahasan lengkap, dan dashboard perkembangan
              belajar.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Kami percaya bahwa belajar kedokteran tidak hanya tentang
              menghafal, tetapi memahami konsep dan melatih kemampuan
              klinis secara berkelanjutan.
            </p>
          </div>

          <div className="rounded-[36px] bg-gradient-to-br from-[#ECFDF5] to-white p-12 shadow-lg">
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-3xl bg-white p-6 text-center shadow">
                <BookOpen className="mx-auto mb-3 text-[#0F766E]" size={34} />
                <p className="font-bold">Bank Soal</p>
              </div>

              <div className="rounded-3xl bg-white p-6 text-center shadow">
                <Brain className="mx-auto mb-3 text-[#0F766E]" size={34} />
                <p className="font-bold">CBT</p>
              </div>

              <div className="rounded-3xl bg-white p-6 text-center shadow">
                <BarChart3 className="mx-auto mb-3 text-[#0F766E]" size={34} />
                <p className="font-bold">Dashboard</p>
              </div>

              <div className="rounded-3xl bg-white p-6 text-center shadow">
                <FileText className="mx-auto mb-3 text-[#0F766E]" size={34} />
                <p className="font-bold">Pembahasan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VISI MISI */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <InfoCard title="Visi" icon={<Eye size={30} />}>
            <p>
              Menjadi platform pembelajaran kedokteran digital yang
              terpercaya, inovatif, dan mudah diakses oleh seluruh
              mahasiswa kedokteran Indonesia.
            </p>
          </InfoCard>

          <InfoCard title="Misi" icon={<Target size={30} />}>
            <ul className="list-disc space-y-3 pl-6">
              <li>Menyediakan bank soal yang berkualitas.</li>
              <li>Membantu persiapan CBT dan UKMPPD.</li>
              <li>Memberikan pembahasan yang mudah dipahami.</li>
              <li>Mengembangkan fitur sesuai kebutuhan pengguna.</li>
            </ul>
          </InfoCard>
        </div>
      </section>

      {/* WHY */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="mb-10 text-center text-4xl font-black text-[#061B3A]">
          Mengapa Memilih Medivault?
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Bank Soal Berkualitas",
              icon: <BookOpen size={32} />,
            },
            {
              title: "Simulasi CBT",
              icon: <Brain size={32} />,
            },
            {
              title: "Dashboard Nilai",
              icon: <BarChart3 size={32} />,
            },
            {
              title: "Pembahasan Lengkap",
              icon: <FileText size={32} />,
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[30px] border border-[#E7F6F0] bg-white p-8 text-center shadow transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex justify-center text-[#0F766E]">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-[#061B3A]">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* STAT */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid grid-cols-2 gap-6 rounded-[36px] bg-[#061B3A] p-10 text-center text-white md:grid-cols-4">
          <div>
            <h2 className="text-5xl font-black">1000+</h2>
            <p className="mt-2">Bank Soal</p>
          </div>

          <div>
            <h2 className="text-5xl font-black">20+</h2>
            <p className="mt-2">Kategori</p>
          </div>

          <div>
            <h2 className="text-5xl font-black">24/7</h2>
            <p className="mt-2">Akses</p>
          </div>

          <div>
            <h2 className="text-5xl font-black">100%</h2>
            <p className="mt-2">Online</p>
          </div>
        </div>
      </section>

      <InfoCTA />
    </InfoLayout>
  );
}