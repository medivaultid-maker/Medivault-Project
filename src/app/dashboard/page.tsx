"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

type ExamHistoryItem = {
  id: string;
  packageId: string;
  title: string;
  category: string;
  date: string;
  time: string;
  duration: number;
  score: number;
  passingGrade: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  doubtCount: number;
  totalQuestions: number;
    status: string;
};

const categoryLabels: Record<string, string> = {
  "anatomi-teori": "Anatomi - Teori",
  "anatomi-praktikum": "Anatomi - Praktikum",
  "histologi-teori": "Histologi - Teori",
  "histologi-praktikum": "Histologi - Praktikum",
};

export default function DashboardPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [name, setName] = useState("User");
  const [token, setToken] = useState(0);
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);

  useEffect(() => {
  const loadDashboard = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    // ======================
    // PROFILE
    // ======================

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, token")
      .eq("id", user.id)
      .single();

    setName(profile?.full_name || user.email || "User");
    setToken(profile?.token || 0);

    // ======================
    // HISTORY
    // ======================

    const { data: attempts } = await supabase
      .from("exam_attempts")
      .select(`
        *,
        exam_packages (
          title,
          category
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (attempts) {
      setHistory(
        attempts.map((item: any) => ({
          id: item.id,
          packageId: item.package_id,

          title: item.exam_packages.title,
          category: item.exam_packages.category,

          score: item.score,

          passingGrade: item.passing_grade,

          correctCount: item.correct_count,
          wrongCount: item.wrong_count,
          unansweredCount: item.unanswered_count,
          doubtCount: item.doubt_count,

          totalQuestions: item.total_questions,

          duration: item.duration,

          status: item.status,

          date: new Date(item.created_at).toLocaleDateString("id-ID"),

         time: new Date(item.created_at).toLocaleTimeString("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
}),
        }))
      );
    }

    setCheckingAccess(false);
  };

  loadDashboard();
}, []);

  /* =========================
     DATA PER KATEGORI
  ========================= */
  const getData = (category: string) =>
    history
      .filter((h) => h.category === category)
      .slice(-6)
      .map((item, i) => ({
        name: i + 1,
        score: item.score,
      }));

  if (checkingAccess) {
    return (
      <main>
        <Navbar />
        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="rounded-3xl border border-white/40 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(6,27,58,0.06)] backdrop-blur-xl p-10 text-center shadow-xl">
            <h1 className="text-xl font-bold text-[#061B3A]">
              Memuat dashboard...
            </h1>
            <p className="mt-2 text-slate-500 text-sm">Mohon tunggu sebentar.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#EEF6F3_0%,#F8FAFC_35%,#FFFFFF_100%)]">
      <Navbar />

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">

          {/* HEADER */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#061B3A]">
              Selamat datang, {name}
            </h1>

            <p className="mt-2 text-slate-500 text-sm">
              Pantau perkembangan belajar dan riwayat latihan dalam satu dashboard.
            </p>
          </div>

          {/* STATS */}
          <div className="mb-10 grid grid-cols-2 gap-4">

            <div className="rounded-3xl border border-white/40 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_40px_rgba(6,27,58,0.06)] backdrop-blur-xl p-6 shadow-lg">
              <p className="text-sm font-semibold text-slate-500">
                Jumlah Akses
              </p>

              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-3xl font-extrabold text-[#061B3A]">
                  {token}
                </h2>

                <Link
  href="/token"
  className="rounded-xl border border-[#DCE5E0] bg-white px-4 py-2 text-sm font-bold text-[#061B3A] shadow-sm transition hover:-translate-y-0.5 hover:border-[#234F42] hover:bg-[#EEF6F3]"
>
  Akses Latihan
</Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl p-6 shadow-lg">
              <p className="text-sm font-semibold text-slate-500">
                Total Latihan
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-[#061B3A]">
                {history.length}
              </h2>
            </div>
          </div>

          {/* HISTORY (FULL BALIK PUNYA KAMU) */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#061B3A]">
                  Riwayat Latihan Soal Terakhir
                </h2>

                <p className="mt-2 text-slate-600">
                  Lihat hasil latihan terbaru dan perkembangan belajarmu.
                </p>
              </div>

              <Link
                href="/simulasi"
                className="rounded-2xl border border-slate-300 bg-white px-5 py-3 font-extrabold text-[#061B3A]"
              >
                Mulai Latihan
              </Link>
            </div>

            {history.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-8 text-center">
                <p className="font-bold text-slate-600">
                  Belum ada latihan yang diselesaikan. Yuk mulai latihan pertamamu.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[760px] overflow-hidden rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr_1fr] gap-4 bg-slate-50 p-4 text-sm font-extrabold text-slate-500">
                    <span>Judul Latihan</span>
                    <span>Kategori</span>
                    <span>Skor</span>
                    <span>Status</span>
                    <span>Tanggal & Jam</span>
                  </div>

                 {history.slice(0, 10).map((item) => (
  <div
    key={item.id}
    className="grid grid-cols-[1.5fr_1fr_0.6fr_0.8fr_1fr] gap-4 border-t border-slate-100 p-4 text-sm text-slate-700"
  >

    {/* JUDUL */}
    {item.status === "ongoing" ? (
  <Link
    href={`/ujian/${item.packageId}?attempt=${item.id}`}
    className="font-extrabold text-[#061B3A] hover:text-[#234F42] transition"
  >
    {item.title}
  </Link>
) : (
  <Link
    href={`/hasil/${item.id}`}
    className="font-extrabold text-[#061B3A] hover:text-[#234F42] transition"
  >
    {item.title}
  </Link>
)}

    {/* KATEGORI */}
    <span>
      {categoryLabels[item.category] || item.category}
    </span>


    {/* SKOR */}
    <span className="font-extrabold text-[#234F42]">
      {item.status === "ongoing" ? "-" : item.score}
    </span>


    {/* STATUS */}
    <span
      className={
        item.status === "ongoing"
          ? "font-bold text-orange-500"
          : "font-bold text-[#234F42]"
      }
    >
      {item.status === "ongoing"
        ? "Sedang dikerjakan"
        : "Selesai"}
    </span>


    {/* TANGGAL */}
    <span>
      {item.date} • {item.time}
    </span>

  </div>
))}
                
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}

