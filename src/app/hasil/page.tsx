"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import {
  isEssayCorrect,
  getEssayFeedback,
} from "../lib/essayMatcher";

type ExamResult = {
  id: string;
  package_id: string;
  score: number;

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
    total_questions: number;
  };
};

export default function HasilPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [results, setResults] = useState<ExamResult[]>([]);

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

    if (profile?.role === "admin") {
      window.location.href = "/admin";
      return;
    }

    if (profile?.role !== "user"){
      window.location.href = "/login";
      return;
    }

    // nanti ambil hasil dari Supabase di sini

    const { data, error } = await supabase
  .from("exam_attempts")
  .select(`
    *,
    exam_packages (
      title,
      category,
      total_questions
    )
  `)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

console.log("USER =", user.id);
console.log("DATA =", data);
console.log("ERROR =", error);

if (error) {
  console.error(error);
} else {
  setResults(data || []);
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
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-[#061B3A]">
              Memeriksa hasil ujian...
            </h1>
            <p className="mt-2 text-slate-500">Mohon tunggu sebentar.</p>
          </div>
        </section>
      </main>
    );
  }

  if (results.length === 0) {
    return (
      <main>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
          <div className="max-w-xl rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
              Belum Ada Hasil
            </div>

            <h1 className="text-3xl font-extrabold text-[#061B3A]">
              Hasil ujian belum tersedia
            </h1>

            <p className="mt-3 text-slate-600">
              Kamu belum menyelesaikan ujian dari paket soal mana pun.
            </p>

            <Link
              href="/simulasi"
              className="mt-6 inline-flex rounded-2xl bg-emerald-500 px-6 py-3 font-extrabold text-white"
            >
              Mulai Simulasi
            </Link>
          </div>
        </section>
      </main>
    );
  }

return (
  <main className="min-h-screen bg-slate-50">
    <Navbar />

    <section className="px-6 py-10">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#061B3A]">
            Riwayat Hasil Ujian
          </h1>

          <p className="mt-2 text-slate-500">
            Semua hasil ujian yang pernah kamu kerjakan.
          </p>
        </div>

        <div className="space-y-5">
          {results.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                <div>
                  <h2 className="text-2xl font-bold text-[#061B3A]">
                    {item.exam_packages.title}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {item.exam_packages.category}
                  </p>

                  <p className="text-sm text-slate-400 mt-2">
                    {new Date(item.created_at).toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-500">
                    Nilai
                  </p>

                  <h2 className="text-5xl font-extrabold text-emerald-500">
                    {item.score}
                  </h2>
                </div>

                <div className="text-center">
  <p className="text-sm text-slate-500">
    Benar
  </p>

  <p className="text-2xl font-bold text-emerald-600">
    {item.correct_count}
  </p>

  <p className="mt-2 text-sm text-slate-500">
    Salah
  </p>

  <p className="text-2xl font-bold text-red-600">
    {item.wrong_count}
  </p>
</div>

                <div>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-bold ${
                      item.status === "Lulus"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>

                  <div className="mt-4">
                    <Link
                      href={`/hasil/${item.id}`}
                      className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-white"
                    >
                      Lihat Hasil
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  </main>
);
}
