"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";
import {
  Eye,
  Pencil,
 Copy,
  FileText,
  Trash2,
} from "lucide-react";

type ExamPackage = {
  id: string;
  category: string;
  title: string;
  totalQuestions: number;
  duration: number;
  tokenCost: number;
  status?: "published" | "draft";
  createdAt?: string;
};

const categoryLabels: Record<string, string> = {
  "anatomi-teori": "CBT Anatomi",
  "anatomi-praktikum": "Praktikum Anatomi",

  "histologi-teori": "CBT Histologi",
  "histologi-praktikum": "Praktikum Histologi",

  "biokimia-teori": "CBT Biokimia",
  "biokimia-praktikum": "Praktikum Biokimia",

  "fisiologi-teori": "CBT Fisiologi",
  "fisiologi-praktikum": "Praktikum Fisiologi",

  "mikrobiologi-teori": "CBT Mikrobiologi",
  "mikrobiologi-praktikum": "Praktikum Mikrobiologi",

  "parasitologi-teori": "CBT Parasitologi",
  "parasitologi-praktikum": "Praktikum Parasitologi",
};

export default function PaketSoalPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [packages, setPackages] = useState<ExamPackage[]>([]);
const [search, setSearch] = useState("");


  useEffect(() => {
  const loadPackages = async () => {
   const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/login";
  return;
}

const { data: profile } = await supabase
  .from("profiles")
  .select("role")
  .eq("id", user.id)
  .single();

  if (profile?.role !== "admin") {
  window.location.href = "/";
  return;
}

const { data, error } = await supabase
  .from("exam_packages")
  .select("*")
  .order("created_at", { ascending: false });
  
    if (error) {
      console.error(error);
      setPackages([]);
    } else {
      setPackages(
  data.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    totalQuestions: item.total_questions,
    duration: item.duration,
    tokenCost: item.token_cost,
    createdAt: item.created_at,
    status: item.status,
  }))
);
    }

    setCheckingAccess(false);
  };

  loadPackages();
}, []);

  const formatDate = (date?: string) => {
    if (!date) return "-";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "-";
    return parsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const deletePackage = async (id: string) => {
  if (!confirm("Hapus paket ini beserta semua soal?")) return;

  // hapus soal
  await supabase
    .from("questions")
    .delete()
    .eq("package_id", id);

  // hapus paket
  const { error } = await supabase
    .from("exam_packages")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Gagal menghapus paket");
    return;
  }

  setPackages(prev => prev.filter(p => p.id !== id));
};

const toggleStatus = async (
  id: string,
  currentStatus: "published" | "draft"
) => {
  const newStatus =
    currentStatus === "published"
      ? "draft"
      : "published";

  const { error } = await supabase
    .from("exam_packages")
    .update({
      status: newStatus,
    })
    .eq("id", id);

  if (error) {
    alert("Gagal mengubah status");
    return;
  }

  setPackages((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            status: newStatus,
          }
        : item
    )
  );
};

const duplicatePackage = async (id: string) => {
  const { data: packageData, error } = await supabase
    .from("exam_packages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !packageData) {
    alert("Paket tidak ditemukan");
    return;
  }

  const { data: newPackage, error: insertError } = await supabase
    .from("exam_packages")
    .insert({
      title: packageData.title + " (Copy)",
      category: packageData.category,
      duration: packageData.duration,
      token_cost: packageData.token_cost,
      total_questions: packageData.total_questions,
      status: "draft",
    })
    .select()
    .single();

  if (insertError) {
    console.error(insertError);
    alert("Gagal membuat salinan paket");
    return;
  }
  // Ambil semua soal dari paket lama
const { data: questions, error: questionError } = await supabase
  .from("questions")
  .select("*")
  .eq("package_id", id);

if (questionError) {
  console.error(questionError);
  alert("Gagal mengambil soal");
  return;
}
if (questions && questions.length > 0) {
  const duplicatedQuestions = questions.map((q) => ({
    package_id: newPackage.id,
    question: q.question,
    image: q.image,
    options: q.options,
    answer: q.answer,
    essay_answer: q.essay_answer,
    discussion: q.discussion,
    discussion_image: q.discussion_image,
  }));

  const { error: copyError } = await supabase
    .from("questions")
    .insert(duplicatedQuestions);

  if (copyError) {
    console.error(copyError);
    alert("Gagal menyalin soal");
    return;
  }
}

  console.log("Paket baru:", newPackage);

  alert("Paket berhasil diduplikasi!");
window.location.reload();
};

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-slate-50 font-inter">
        <Navbar />
        <section className="flex min-h-[80vh] items-center justify-center px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md">
            <h1 className="text-2xl font-poppins font-bold text-[#061B3A]">
              Memeriksa akses admin...
            </h1>
            <p className="mt-2 text-sm text-slate-500">Mohon tunggu sebentar.</p>
          </div>
        </section>
      </main>
    );
  }

 const filteredPackages = packages.filter((p) => {
  const keyword = search.toLowerCase();

  return (
    p.title.toLowerCase().includes(keyword) ||
    categoryLabels[p.category].toLowerCase().includes(keyword)
  );
});

const groupedPackages = Object.keys(categoryLabels).map((category) => ({
  category,
  label: categoryLabels[category],
  items: filteredPackages.filter((p) => p.category === category),
}));



  return (
    <main className="min-h-screen bg-slate-50 font-inter">
      <Navbar />
      <section className="px-6 py-10 bg-slate-50">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="mb-8">

  <h1 className="font-poppins text-3xl font-extrabold text-[#061B3A]">
    Paket Soal
  </h1>

  <p className="mt-1 text-sm text-slate-500">
    Lihat dan kelola semua paket soal yang sudah dibuat.
  </p>

  <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <input
      type="text"
      placeholder="🔍 Cari nama paket atau kategori..."
      value={search}
     onChange={(e) => {
  setSearch(e.target.value);
}}
      className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm shadow-sm outline-none transition focus:border-[#1D5A47] focus:ring-4 focus:ring-emerald-100"
    />

    <Link
      href="/admin/paket"
      className="
inline-flex
items-center
gap-2
rounded-2xl
border-2
border-[#061B3A]
bg-white
px-6
py-3
font-extrabold
text-[#061B3A]
transition
duration-200
hover:bg-[#061B3A]
hover:text-white
hover:shadow-lg
"
    >
      + Upload Paket Baru
    </Link>

  </div>

</div>

{filteredPackages.length === 0 && (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
    <p className="text-lg font-semibold text-slate-700">
      Tidak ada paket ditemukan
    </p>

    <p className="mt-2 text-sm text-slate-500">
      Coba gunakan kata kunci yang berbeda.
    </p>
  </div>
)}

          {groupedPackages.map((group) => {
  if (group.items.length === 0) return null;

  return (
    <div key={group.category} className="mb-10">

     <div className="mb-3 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#061B3A] to-[#123C72] px-6 py-4 text-white">
  <div>
    <h2 className="text-xl font-bold">{group.label}</h2>
    <p className="text-sm text-slate-200">
      {group.items.length} Paket Soal
    </p>
  </div>
</div>

    <div className="overflow-hidden rounded-3xl border border-[#061B3A] bg-white shadow-lg">

  <div className="overflow-x-auto">

    <table className="w-full table-fixed">

      <colgroup>
        <col className="w-[38%]" />
        <col className="w-[10%]" />
        <col className="w-[12%]" />
        <col className="w-[10%]" />
        <col className="w-[15%]" />
        <col className="w-[15%]" />
      </colgroup>

      <thead className="bg-slate-50 border-b border-[#061B3A]">

        <tr>

          <th className="px-8 py-6 text-left text-lg font-bold text-slate-500">
            Nama Paket
          </th>

          <th className="px-4 py-6 text-center text-lg font-bold text-slate-500">
            Soal
          </th>

          <th className="px-4 py-6 text-center text-lg font-bold text-slate-500">
            Durasi
          </th>

          <th className="px-4 py-6 text-center text-lg font-bold text-slate-500">
            Token
          </th>

          <th className="px-4 py-6 text-center text-lg font-bold text-slate-500">
            Status
          </th>

          <th className="px-4 py-6 text-center text-lg font-bold text-slate-500">
            Aksi
          </th>

        </tr>

      </thead>

      <tbody>

        {group.items.map((item) => (

          <tr
            key={item.id}
            className="border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition"
          >

            <td className="px-8 py-7 align-middle">

              <p className="text-2xl font-bold text-[#061B3A]">
                {item.title}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Dibuat {formatDate(item.createdAt)}
              </p>

            </td>

            <td className="py-7 text-center text-2xl font-semibold text-[#061B3A]">
              {item.totalQuestions}
            </td>

            <td className="py-7 text-center text-xl text-[#061B3A]">
              {item.duration} m
            </td>

            <td className="py-7 text-center text-xl font-semibold text-[#061B3A]">
              {item.tokenCost}
            </td>

            <td className="py-7 text-center">

              <span
                className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                  item.status === "published"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.status === "published"
                  ? "Published"
                  : "Draft"}
              </span>

            </td>

            <td className="py-7">

              <div className="flex justify-center gap-3">

                <Link
                  href={`/admin/preview/${item.id}`}
                  className="rounded-xl bg-sky-100 p-3 text-sky-700 hover:bg-sky-200"
                >
                  <Eye size={20} />
                </Link>

                <Link
                  href={`/admin/paket/${item.id}`}
                  className="rounded-xl bg-blue-100 p-3 text-blue-700 hover:bg-blue-200"
                >
                  <Pencil size={20} />
                </Link>

                <button
                  onClick={() => duplicatePackage(item.id)}
                  className="rounded-xl bg-indigo-100 p-3 text-indigo-700 hover:bg-indigo-200"
                >
                  <Copy size={20} />
                </button>

                <button
                  onClick={() =>
                    toggleStatus(item.id, item.status ?? "draft")
                  }
                  className="rounded-xl bg-emerald-100 p-3 text-emerald-700 hover:bg-emerald-200"
                >
                  <FileText size={20} />
                </button>

                <button
                  onClick={() => deletePackage(item.id)}
                  className="rounded-xl bg-red-100 p-3 text-red-700 hover:bg-red-200"
                >
                  <Trash2 size={20} />
                </button>

              </div>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>

    </div>
  );
})}
</div>

       
    
      </section>
    </main>
  );
}
