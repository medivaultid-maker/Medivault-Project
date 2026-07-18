import InfoLayout from "../components/info/InfoLayout";
import InfoHero from "../components/info/InfoHero";
import InfoCTA from "../components/info/InfoCTA";

import {
  BookOpen,
  FileText,
  Microscope,
  Stethoscope,
  Layers,
  LockKeyhole,
} from "lucide-react";


const materials = [
  {
    icon: <BookOpen size={36} />,
    title: "Ebook Kedokteran",
    desc: "Kumpulan ebook pembelajaran kedokteran untuk membantu memahami konsep dasar hingga klinis.",
  },
  {
    icon: <FileText size={36} />,
    title: "Catatan Materi",
    desc: "Ringkasan materi kuliah kedokteran yang disusun lebih sederhana dan sistematis.",
  },
  {
    icon: <Microscope size={36} />,
    title: "Atlas Anatomi & Histologi",
    desc: "Kumpulan gambar dan pembahasan anatomi, histologi, serta preparat praktikum.",
  },
  {
    icon: <Stethoscope size={36} />,
    title: "Catatan Koas",
    desc: "Catatan pengalaman klinik, tips stase, dan persiapan menghadapi dunia klinis.",
  },
  {
    icon: <Layers size={36} />,
    title: "Ringkasan UKMPPD",
    desc: "Materi ringkas dan poin penting untuk membantu persiapan ujian kompetensi dokter.",
  },
];


export default function MateriPage() {
  return (
    <InfoLayout>

      <InfoHero
        title="Materi Medivault"
        subtitle="Akses berbagai sumber belajar kedokteran mulai dari ebook, catatan materi, atlas, hingga catatan koas."
        icon={<BookOpen size={40} />}
      />


      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {materials.map((item) => (
            <div
              key={item.title}
              className="rounded-[32px] border border-[#E7F6F0] bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ECFDF5] text-[#0F766E]">
                {item.icon}
              </div>


              <h2 className="mt-6 text-2xl font-black text-[#061B3A]">
                {item.title}
              </h2>


              <p className="mt-4 leading-7 text-slate-600">
                {item.desc}
              </p>


              <div className="mt-6 flex items-center justify-between">

                <span className="rounded-full bg-[#ECFDF5] px-4 py-2 text-sm font-bold text-[#0F766E]">
                  Coming Soon
                </span>


                <LockKeyhole
                  size={20}
                  className="text-slate-400"
                />

              </div>

            </div>
          ))}

        </div>

      </section>


      <InfoCTA />

    </InfoLayout>
  );
}