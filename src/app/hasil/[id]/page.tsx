"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

type ExamAttempt = {
  id: string;
  package_id: string;
  score: number;
  passing_grade: number;
  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  doubt_count: number;
  total_questions: number;
  duration: number;
  status: string;
  created_at: string;

  exam_packages: {
    title: string;
    category: string;
  } | null;
};

const categoryLabels: Record<string, string> = {
  "anatomi-teori": "Anatomi - Teori",
  "anatomi-praktikum": "Anatomi - Praktikum",
  "histologi-teori": "Histologi - Teori",
  "histologi-praktikum": "Histologi - Praktikum",
};

export default function HasilDetailPage() {
  const params = useParams();
  const id = String(params.id || "");

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [result, setResult] =
useState<ExamAttempt | null>(null);

  useEffect(() => {
  const loadResult = async () => {
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

    if (profile?.role === "admin"){
      window.location.href = "/admin";
      return;
    }

    if (profile?.role !== "user"){
      window.location.href = "/login";
      return;
    }

    // isi kode selanjutnya di sini

    const { data, error } = await supabase
  .from("exam_attempts")
  .select(`
    *,
    exam_packages(
      title,
      category
    )
  `)
  .eq("id", id)
  .eq("user_id", user.id)
  .single();

if (error) {
  console.error(error);
} else {
  setResult(data);
}

setCheckingAccess(false);
  };

  loadResult();
}, []);

  if (checkingAccess) {
    return (
      <main>
        <Navbar />
        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-8 text-center shadow-xl">
            <h1 className="text-xl font-extrabold text-[#061B3A]">
              Memeriksa hasil ujian...
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              Mohon tunggu sebentar.
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!result) {
    return (
      <main>
        <Navbar />
        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="max-w-xl rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-8 text-center shadow-xl">
            <h1 className="text-2xl font-extrabold text-[#061B3A]">
              Hasil ujian tidak ditemukan
            </h1>
            <p className="mt-3 text-slate-600 text-sm">
              Data riwayat ujian ini tidak tersedia.
            </p>
            <Link
              href="/simulasi"
              className="mt-6 inline-flex rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-white shadow"
            >
              Kembali ke Simulasi
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-white to-[#EEF2FF]">
      <Navbar />

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-5xl">

          {/* HEADER */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
              Hasil Ujian
            </div>

            <h1 className="text-3xl font-extrabold text-[#061B3A]">
              Hasil Ujian {result.exam_packages?.title}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
  {categoryLabels[result.exam_packages?.category || ""]} •{" "}
  {new Date(result.created_at).toLocaleDateString("id-ID")} •{" "}
  {new Date(result.created_at).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })}
</p>
          </div>

          {/* STAT UTAMA */}
          <div className="mb-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card label="Skor Akhir" value={result.score} highlight="emerald" />
            <Card label="Passing Grade" value={result.passing_grade} />
            <Card label="Jumlah Soal" value={result.total_questions || 0} />
            <Card label="Waktu" value={result.duration} sub="menit" />
          </div>

          {/* DETAIL */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card label="Jawaban Benar" value={result.correct_count} highlight="emerald" />
            <Card label="Jawaban Salah" value={result.wrong_count} highlight="red" />
            <Card label="Tidak Dijawab" value={result.unanswered_count} />
            <Card label="Ragu-ragu" value={result.doubt_count} highlight="amber" />
          </div>

          {/* STATUS */}
          <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-5 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#061B3A]">
                  Status:{" "}
                  <span
                    className={
                      result.status === "Lulus"
                        ? "text-emerald-500"
                        : "text-red-600"
                    }
                  >
                    {result.status}
                  </span>
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Lihat pembahasan untuk detail jawaban.
                </p>
              </div>

              <Link
                href={`/hasil/${result.id}/pembahasan`}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-white shadow hover:scale-105 transition"
              >
                Pembahasan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* COMPONENT MINI CARD */
function Card({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: number;
  sub?: string;
  highlight?: "emerald" | "red" | "amber";
}) {
  const color =
    highlight === "emerald"
      ? "text-emerald-500"
      : highlight === "red"
      ? "text-red-600"
      : highlight === "amber"
      ? "text-amber-500"
      : "text-[#061B3A]";

  return (
    <div className="rounded-2xl border border-white/40 bg-white/70 backdrop-blur-xl p-4 shadow-md text-center">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <h2 className={`mt-2 text-3xl font-extrabold ${color}`}>
        {value}
      </h2>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
