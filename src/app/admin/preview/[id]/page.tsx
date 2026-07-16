"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import { supabase } from "../../../lib/supabase";

export default function PreviewPage() {
  const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<any>(null);
const [questions, setQuestions] = useState<any[]>([]);
const isPraktikum =
  exam?.category?.includes("praktikum") ?? false;

 useEffect(() => {
  if (id) {
    loadExam();
  }
}, [id]);

  async function loadExam() {
  // ambil paket
  const { data: examData } = await supabase
    .from("exam_packages")
    .select("*")
    .eq("id", id)
    .single();

  setExam(examData);

  // ambil soal
  const { data: questionData } = await supabase
    .from("questions")
    .select("*")
    .eq("package_id", id)
    .order("order_no", { ascending: true })

  setQuestions(questionData || []);

  setLoading(false);
}

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="p-10 text-center">
          Loading...
        </div>
      </main>
    );
  }

  if (!exam) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="p-10 text-center">
          Paket tidak ditemukan
        </div>
      </main>
    );
  }

  return (
  <main className="min-h-screen bg-slate-50">
    <Navbar />

    <div className="mx-auto max-w-5xl p-8">

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

    <div>
      <div className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
        👁 Preview Paket Ujian
      </div>

      <h1 className="mt-4 text-4xl font-extrabold text-[#061B3A]">
        {exam?.title}
      </h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium">
          ⏱ {exam?.duration} menit
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium">
          📚 {exam?.total_questions} soal
        </div>

        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium">
          🏷 {exam?.category}
        </div>
      </div>
    </div>

    <Link
      href="/admin/daftar-paket"
      className="inline-flex h-12 items-center justify-center rounded-xl border border-slate-200 px-5 font-semibold text-slate-700 hover:bg-slate-50"
    >
      ← Kembali
    </Link>

  </div>
</div>

      {/* QUESTIONS */}
      <div className="mt-8 space-y-6">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="whitespace-pre-line font-semibold text-slate-700">
  {index + 1}. {q.question}
</div>
{q.image && (
  <img
    src={q.image}
    alt={`Soal ${index + 1}`}
    className="mt-4 max-h-80 rounded-xl border object-contain"
  />
)}

            {exam.category?.includes("praktikum") ? (
  <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
    <p className="font-bold text-emerald-700">
      Jawaban Praktikum
    </p>

    <p className="mt-2 whitespace-pre-line text-slate-700">
      {q.essay_answer || "-"}
    </p>
  </div>
) : (
  <div className="mt-4 space-y-2">
    {q.options?.map((opt: string, i: number) => (
      <div
        key={i}
        className="rounded-lg border px-4 py-2"
      >
        <div className="whitespace-pre-line">
  {String.fromCharCode(65 + i)}. {opt}
</div>
      </div>
    ))}
  </div>
)}
          </div>
        ))}
      </div>

    </div>
  </main>
);}