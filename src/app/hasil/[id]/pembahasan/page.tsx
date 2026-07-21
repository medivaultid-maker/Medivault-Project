"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { supabase } from "../../../lib/supabase";
import {
  isEssayCorrect,
  getEssayScore,
  getHighlightExplanation,
  buildAIExplanation,
} from "../../../lib/essayMatcher";

type QuestionItem = {
  id: string;
  topic: string;
  question: string;
  image: string | null;
  options: string[];
  answer: number;
  essay_answer: string | null;
  discussion: string;
  discussion_image: string | null;

  attempt_answers: {
  selected_answer: string | number | null;
  is_doubt: boolean;
}[];
};

type ExamAttempt = {
  id: string;
  package_id: string;

  score: number;
  passing_grade: number;

  correct_count: number;
  wrong_count: number;
  unanswered_count: number;
  doubt_count: number;

  status: string;

  exam_packages: {
    id: string;
    title: string;
    category: string;
  } | null;
};

type FilterType = "semua" | "benar" | "salah" | "ragu";

export default function PembahasanPage() {
  const params = useParams();
  const id = String(params.id || "");

  const [checkingAccess, setCheckingAccess] = useState(true);
 const [result, setResult] =
useState<ExamAttempt | null>(null);

const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [filter, setFilter] = useState<FilterType>("semua");

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

    if (profile?.role !== "user") {
      window.location.href = "/login";
      return;
    }

    // isi kode selanjutnya di sini

    const { data: resultData, error: resultError } = await supabase
  .from("exam_attempts")
  .select(`
    *,
    exam_packages (
      id,
      title,
      category
    )
  `)
  .eq("id", id)
  .eq("user_id", user.id)
  .single();

if (resultError) {
  console.error(resultError);
} else {
  setResult(resultData);
}

const { data: soalData, error: soalError } = await supabase
  .from("questions")
  .select(`
    *,
    attempt_answers (
      selected_answer,
      is_doubt
    )
`)
  .eq("package_id", resultData.package_id)
  .eq("attempt_answers.attempt_id", id)
  .order("created_at");
console.log(JSON.stringify(soalData, null, 2));
console.log("ERROR =", soalError);

if (soalError) {
  console.error(soalError);
} else {
  setQuestions(soalData || []);
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
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-[#061B3A]">
              Memeriksa pembahasan...
            </h1>
            <p className="mt-2 text-slate-500">Mohon tunggu sebentar.</p>
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
          <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-extrabold text-[#061B3A]">
              Pembahasan tidak ditemukan
            </h1>

            <p className="mt-3 text-slate-600">
              Data pembahasan untuk ujian ini tidak tersedia.
            </p>

            <Link
              href="/simulasi"
              className="mt-6 inline-flex rounded-2xl bg-emerald-500 px-6 py-3 font-extrabold text-white"
            >
              Kembali ke Simulasi
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const filteredQuestions = questions
  .map((question, index) => {
    const userAnswer =
question.attempt_answers?.[0]?.selected_answer ?? null;

    const isCorrect =
  question.essay_answer
    ? isEssayCorrect(
        String(userAnswer ?? ""),
        Array.isArray(question.essay_answer)
          ? question.essay_answer
          : [question.essay_answer]
      )
    : userAnswer === question.answer;

    const isDoubt =
question.attempt_answers[0]?.is_doubt ?? false;

    const isUnanswered =
      userAnswer === null;

    return {
      question,
      index,
      userAnswer,
      isCorrect,
      isDoubt,
      isUnanswered,
    };
  })
  .filter((item) => {
    if (filter === "semua") return true;
    if (filter === "benar") return item.isCorrect;
    if (filter === "salah") return !item.isCorrect;
    if (filter === "ragu") return item.isDoubt;

    return true;
  });

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "Semua", value: "semua" },
    { label: "Benar", value: "benar" },
    { label: "Salah", value: "salah" },
    { label: "Ragu-ragu", value: "ragu" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-600">
              Pembahasan
            </div>

            <h1 className="text-4xl font-extrabold text-[#061B3A]">
              Pembahasan {result.exam_packages?.title}
            </h1>
          </div>

          <div className="mb-6 flex flex-wrap justify-center gap-3">
            {filterButtons.map((item) => (
              <button
                key={item.value}
                onClick={() => setFilter(item.value)}
                className={`rounded-2xl px-5 py-3 font-extrabold ${
                  filter === item.value
                    ? "bg-[#061B3A] text-white"
                    : "border border-slate-300 bg-white text-[#061B3A]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mb-6 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="font-bold text-slate-600">
              Menampilkan {filteredQuestions.length} dari{" "}
              {questions.length} soal.
            </p>
          </div>

          <div className="space-y-5">
            {filteredQuestions.map((item) => {
              const question = item.question;
              const userAnswer = item.userAnswer;
              const essayAnalysis =
  question.essay_answer
    ? getEssayScore(
        String(userAnswer ?? ""),
        Array.isArray(question.essay_answer)
          ? question.essay_answer
          : [question.essay_answer]
      )
    : null;
              
              const ai =
  question.essay_answer
    ? buildAIExplanation(
        String(userAnswer ?? ""),
        Array.isArray(question.essay_answer)
          ? question.essay_answer
          : [question.essay_answer]
      )
    : null;

              return (
                <div
                  key={item.index}
                  className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="font-extrabold text-slate-500">
                      Soal {item.index + 1}
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {item.isCorrect ? (
                        <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-600">
                          Benar
                        </span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-extrabold text-red-600">
                          Salah
                        </span>
                      )}

                      {item.isDoubt && (
                        <span className="rounded-full bg-amber-50 px-4 py-2 text-sm font-extrabold text-amber-600">
                          Ragu-ragu
                        </span>
                      )}

                      {item.isUnanswered && (
                        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-extrabold text-slate-600">
                          Tidak dijawab
                        </span>
                      )}
                    </div>
                  </div>

                  <h2
  className="
    whitespace-pre-wrap
    break-words
    text-xl
    font-normal
    leading-8
    text-[#061B3A]
  "
>
  {question.question}
</h2>

{question.image && (
  <img
    src={question.image}
    className="mt-5 max-h-72 rounded-xl border object-contain"
  />
)}

                  <div className="mt-5 space-y-3">
                    {(question.options ?? []).map((option, optionIndex) => {
                      const isCorrectAnswer = question.answer === optionIndex;
                      const isUserAnswer = userAnswer === optionIndex;

                      return (
                        <div
                          key={optionIndex}
                          className={`rounded-2xl border p-4 ${
                            isCorrectAnswer
                              ? "border-emerald-300 bg-emerald-50"
                              : isUserAnswer
                              ? "border-red-300 bg-red-50"
                              : "border-slate-200 bg-white"
                          }`}
                        >
                          <div className="flex gap-3">
                            <strong>
                              {String.fromCharCode(65 + optionIndex)}.
                            </strong>

                            <span>{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {(question.discussion?.trim() || question.discussion_image) && (
  <div className="mt-5 rounded-2xl bg-slate-50 p-5">
    <p className="font-bold text-[#061B3A]">
      Pembahasan
    </p>

    {question.discussion?.trim() && (
      <p className="mt-2 whitespace-pre-wrap break-words leading-7 text-slate-600">
        {question.discussion}
      </p>
    )}

    {essayAnalysis && (
<div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">

<h3 className="font-extrabold text-indigo-700">
🤖 AI Highlight Jawaban
</h3>


<div className="mt-4 space-y-3">

{essayAnalysis.matched.length > 0 && (
<div>
<p className="font-bold text-emerald-600">
✅ Bagian benar
</p>

{essayAnalysis.matched.map((item)=>(
<p key={item}>
🟢 {item}
</p>
))}
</div>
)}



{essayAnalysis.missing.length > 0 && (
<div>
<p className="font-bold text-red-600">
❌ Bagian kurang
</p>

{essayAnalysis.missing.map((item)=>(
<p key={item}>
🔴 {item}
</p>
))}
</div>
)}



{essayAnalysis.wrong.length > 0 && (
<div>
<p className="font-bold text-amber-600">
⚠ Bagian tidak sesuai
</p>

{essayAnalysis.wrong.map((item)=>(
<p key={item}>
🟠 {item}
</p>
))}
</div>
)}

</div>

</div>
)}

    {ai && (
  <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
    <p className="font-bold text-blue-700">
      🤖 MediVault AI
    </p>

    <div className="mt-3 whitespace-pre-wrap text-slate-700 leading-7">
  {ai.text}
</div>
{/* AI HIGHLIGHT */}

<div className="mt-5 space-y-3">

  {ai.highlight.correct.length > 0 && (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

      <p className="font-bold text-emerald-700">
        ✅ Struktur yang benar
      </p>

      {ai.highlight.correct.map((item:any, index:number)=>(
        <div key={index} className="mt-2">

          <p className="font-bold">
            {item.text}
          </p>

          <p className="text-sm text-slate-600">
            {item.explanation}
          </p>

        </div>
      ))}

    </div>
  )}



  {ai.highlight.missing.length > 0 && (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

      <p className="font-bold text-amber-700">
        ⚠️ Struktur yang belum disebutkan
      </p>

      {ai.highlight.missing.map((item:any,index:number)=>(
        <div key={index} className="mt-2">

          <p className="font-bold">
            {item.text}
          </p>

          <p className="text-sm text-slate-600">
            {item.explanation}
          </p>

        </div>
      ))}

    </div>
  )}



  {ai.highlight.wrong.length > 0 && (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">

      <p className="font-bold text-red-700">
        ❌ Struktur tidak sesuai
      </p>

      {ai.highlight.wrong.map((item:any,index:number)=>(
        <div key={index} className="mt-2">

          <p className="font-bold">
            {item.text}
          </p>

          <p className="text-sm text-slate-600">
            {item.explanation}
          </p>

        </div>
      ))}

    </div>
  )}

</div>
  </div>
)}

    {question.discussion_image && (
      <img
        src={question.discussion_image}
        className="mt-4 max-h-72 rounded-xl border object-contain"
      />
    )}
  </div>
)}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/hasil/${result.id}`}
              className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-extrabold text-[#061B3A]"
            >
              Kembali ke Detail Hasil
            </Link>

            <Link
              href="/simulasi"
              className="rounded-2xl bg-emerald-500 px-6 py-4 font-extrabold text-white"
            >
              Pilih Latihan Lain
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
