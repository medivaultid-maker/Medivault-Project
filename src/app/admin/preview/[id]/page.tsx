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

      {/* HEADER */}
      <div className="mb-6 rounded-2xl bg-sky-50 p-6 border border-sky-200">

        <p className="font-bold text-sky-700">
          👁 MODE PREVIEW
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          {exam?.title}
        </h1>

        <div className="mt-2 flex flex-wrap gap-3 text-slate-500">
          <span>{exam?.duration ?? 0} menit</span>
          <span>•</span>
          <span>{exam?.total_questions ?? 0} soal</span>
        </div>

        <Link
          href="/admin/daftar-paket"
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700 font-medium hover:bg-slate-100 transition"
        >
          ← Kembali
        </Link>

      </div>

      {/* QUESTIONS */}
      <div className="mt-8 space-y-6">
        {questions.map((q, index) => (
          <div
            key={q.id}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <p className="font-semibold text-slate-700">
              {index + 1}. {q.question}
            </p>
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
        {String.fromCharCode(65 + i)}. {opt}
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