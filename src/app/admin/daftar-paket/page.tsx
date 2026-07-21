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
};

export default function PaketSoalPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [packages, setPackages] = useState<ExamPackage[]>([]);
const [search, setSearch] = useState("");
const [currentPage, setCurrentPage] = useState(1);

const ITEMS_PER_PAGE = 5;

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

const totalPages = Math.ceil(
  filteredPackages.length / ITEMS_PER_PAGE
);

const paginatedPackages = filteredPackages.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

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
        setCurrentPage(1);
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

          {filteredPackages.length > 0 && (
  <div className="overflow-x-auto">
    <div className="min-w-[1100px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(6,27,58,0.08)]">

      <div className="grid grid-cols-[2fr_1.3fr_0.8fr_0.8fr_0.8fr_1fr_1.5fr] gap-4 bg-[#061B3A] px-5 py-4 text-sm font-bold text-white items-center">
        <span>Nama Paket</span>
        <span>Kategori</span>
        <span>Soal</span>
        <span>Durasi</span>
        <span>Token</span>
        <span>Status</span>
        <span>Aksi</span>
      </div>

      {paginatedPackages.map((item) => (
        <div
          key={item.id}
          className="grid grid-cols-[2fr_1.3fr_0.8fr_0.8fr_0.8fr_1fr_1.5fr] gap-4 border-t border-slate-100 px-5 py-4 text-sm text-slate-700 hover:bg-[#F5F8F7]"
        >

          <div>
            <strong className="block font-poppins text-[#061B3A]">
              {item.title}
            </strong>

            <span className="mt-1 block text-xs text-slate-400">
              Dibuat: {formatDate(item.createdAt)}
            </span>
          </div>

          <span>
            {categoryLabels[item.category]}
          </span>

          <span className="font-bold">
            {item.totalQuestions}
          </span>

          <span>{item.duration} m</span>

          <span>{item.tokenCost}</span>

          <div className="flex items-center">
  {item.status === "published" ? (
    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
      Published
    </span>
  ) : (
    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
      Draft
    </span>
  )}
</div>

          <div className="flex flex-wrap items-center gap-2">
  <div className="flex flex-col gap-2">

  <div className="flex gap-2">
    <button
      onClick={() =>
        toggleStatus(item.id, item.status ?? "draft")
      }
      className="flex-1 rounded-xl bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
    >
      {item.status === "published" ? "📄 Draft" : "🚀 Publish"}
    </button>

    <button
      onClick={() => duplicatePackage(item.id)}
      className="flex-1 rounded-xl bg-blue-100 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200"
    >
      📋 Duplikat
    </button>
  </div>

  <div className="flex gap-2">
    <Link
      href={`/admin/preview/${item.id}`}
      className="flex-1 rounded-xl bg-sky-50 px-3 py-2 text-center text-sm font-semibold text-sky-700 hover:bg-sky-100"
    >
      👁 Preview
    </Link>

    <Link
      href={`/admin/paket/${item.id}`}
      className="flex-1 rounded-xl bg-sky-50 px-3 py-2 text-center text-sm font-semibold text-sky-700 hover:bg-sky-100"
    >
      ✏️ Edit
    </Link>

    <button
      onClick={() => deletePackage(item.id)}
      className="flex-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
    >
      🗑 Hapus
    </button>
  </div>

</div>

</div>

        </div>
      ))}

    </div>
  </div>
)}

        </div>
        {totalPages > 1 && (
  <div className="mt-8 flex items-center justify-center gap-2">

    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
      className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
    >
      ←
      
    </button>

    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
          currentPage === index + 1
            ? "bg-[#061B3A] text-white"
            : "border border-slate-300 bg-white hover:bg-slate-100"
        }`}
      >
        {index + 1}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
      className="rounded-xl border px-4 py-2 text-sm disabled:opacity-40"
    >
      →
    </button>

  </div>
)}
      </section>
    </main>
  );
}
