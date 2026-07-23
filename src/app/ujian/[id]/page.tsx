"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";
import { useParams, useSearchParams } from "next/navigation";
import { updateAILevel } from "../../lib/updateAILevel";
import {
  isEssayCorrect,
  getEssayScore,
} from "../../lib/essayMatcher";

type QuestionItem = {
  id: string;

  topic?: string;

  question: string;

  image?: string | null;

  options?: string[] | null;

  answer?: number | null;

  essayAnswer?: string[];

  discussion: string;

  discussionImage?: string | null;
};

type ExamPackage = {
  id: string;
  category: string;
  title: string;
  description: string;
  totalQuestions: number;
  duration: number;
  tokenCost: number;
  pdfName: string;
  questions: QuestionItem[];
  status: "published";
};

type ExamHistoryItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  status: "Lulus" | "Belum Lulus";
};

export default function UjianPage() {
  const params = useParams();
const searchParams = useSearchParams();

const id = params.id as string;
const isAIPractice = id === "ai";
const attemptId = searchParams.get("attempt");
useEffect(() => {
  if (attemptId) {
    localStorage.setItem(
      "medivault_attempt_id",
      attemptId
    );
  }
}, [attemptId]);
  console.log("PARAMS =", params);
console.log("ID =", id);
console.log("URL =", window.location.pathname);

  const [checkingAccess, setCheckingAccess] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<ExamPackage | null>(null);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] =
  useState<(number | null)[]>([]);
  const [essayAnswers, setEssayAnswers] =
  useState<string[]>([]);
  const [doubt, setDoubt] = useState<boolean[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState(0);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
const [resultAttemptId, setResultAttemptId] = useState("");
const [examResult, setExamResult] = useState({
  score: 0,
  passingGrade: 70,
  correctCount: 0,
  wrongCount: 0,
  unansweredCount: 0,
  doubtCount: 0,
  totalQuestions: 0,
  duration: 0,
  status: "Belum Lulus",
});
const numberScrollRef = useRef<HTMLDivElement>(null);
  const questions = selectedPackage?.questions ?? [];
  const question = questions[current];
const isEssay =
  Array.isArray(question?.essayAnswer) &&
  question.essayAnswer.length > 0;

  useEffect(() => {
  const loadExam = async () => {
    try {

    const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/login";
  return;
}

const currentAttemptId =
  attemptId || localStorage.getItem("medivault_attempt_id");

let session: any = null;

if (currentAttemptId) {
  const { data } = await supabase
    .from("exam_sessions")
    .select("finished, started_at, duration")
    .eq("attempt_id", currentAttemptId)
    .single();

  session = data;

 if (session?.finished && !submitted) {
  window.location.replace(`/hasil/${currentAttemptId}`);
  return;
}
}

const { data: profile } = await supabase
  .from("profiles")
  .select("role, token, ai_level, weakest_topics")
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

const savedToken = profile?.token || 0;

console.log("ID =", id);

// Ambil paket dari Supabase berdasarkan id di URL
let packageData: any = null;
let questions: any[] = [];

if (!isAIPractice) {
  const { data, error } = await supabase
    .from("exam_packages")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !data) {
    alert("Paket tidak ditemukan");
    window.location.href = "/simulasi";
    return;
  }

  packageData = data;

  const { data: questionData, error: questionError } =
    await supabase
      .from("questions")
      .select("*")
      .eq("package_id", id)
      .order("order_no", { ascending: true });

  if (questionError || !questionData) {
    alert("Soal tidak ditemukan");
    return;
  }

  questions = questionData;
} else {

  const weakest =
    profile?.weakest_topics?.[0]?.topic;

  const topic =
    weakest || localStorage.getItem("ai_topic");


  const { data: questionData, error } = await supabase
    .from("questions")
    .select("*")
    .eq("topic", topic)
    .eq("difficulty", profile.ai_level);


  if (error || !questionData) {
    alert("Soal AI tidak ditemukan");
    return;
  }


  questionData.sort(() => Math.random() - 0.5);

  questions = questionData.slice(0, 20);


  packageData = {
    id: "ai",
    title: `Latihan AI - ${topic}`,
    category: "AI",
    duration: 20,
    token_cost: 0,
    total_questions: questions.length,
  };

}

  console.log("PACKAGE =", packageData);


// Ambil soal dari Supabase

  console.log("QUESTIONS =", questions);
  questions.forEach((q: any) => {
  console.log({
    question: q.question,
    options: q.options,
    answer: q.answer,
    essay_answer: q.essay_answer,
  });
});


const { data: allQuestions, error: allQuestionsError } = await supabase
  .from("questions")
  .select("id, package_id, question");

console.log("ALL QUESTIONS =", allQuestions);
console.log("ALL QUESTIONS ERROR =", allQuestionsError);

const parsedPackage: ExamPackage = {
  id: packageData.id,
  category: packageData.category,
  title: packageData.title,
  description: "",
  totalQuestions: packageData.total_questions,
  duration: packageData.duration,
  tokenCost: packageData.token_cost,
  pdfName: "",
  status: "published",
 questions: questions.map((q: any) => ({
  id: q.id,
  question: q.question,
  topic: q.topic,

  image: q.image,
  options: q.options,
  answer: q.answer,

  essayAnswer:
  q.essay_answer ?? undefined,

  discussion: q.discussion,
  discussionImage: q.discussion_image,
})),
};

      const savedCurrent = localStorage.getItem(
  `exam-current-${parsedPackage.id}`
);

const savedAnswers = localStorage.getItem(
  `exam-answers-${parsedPackage.id}`
);

const savedDoubt = localStorage.getItem(
  `exam-doubt-${parsedPackage.id}`
);

const initialAnswers =
  savedAnswers
    ? JSON.parse(savedAnswers)
    : Array(parsedPackage.questions.length).fill(null);

const initialDoubt =
  savedDoubt
    ? JSON.parse(savedDoubt)
    : Array(parsedPackage.questions.length).fill(false);
// =============================
// Ambil jawaban dari database
// =============================
const { data: savedAnswerRows } = await supabase
  .from("attempt_answers")
  .select(
    "question_id, selected_answer, essay_answer, is_doubt"
  )
  .eq("attempt_id", currentAttemptId);

if (savedAnswerRows) {
  savedAnswerRows.forEach((row: any) => {
    const index = parsedPackage.questions.findIndex(
      (q) => q.id === row.question_id
    );

    if (index !== -1) {
      initialAnswers[index] = row.selected_answer;
      initialDoubt[index] = row.is_doubt ?? false;
    }
  });
}
const initialEssayAnswers = Array(
  parsedPackage.questions.length
).fill("");

if (savedAnswerRows) {
  savedAnswerRows.forEach((row: any) => {

    const index = parsedPackage.questions.findIndex(
      (q) => q.id === row.question_id
    );

    if (index !== -1) {

      if (
        parsedPackage.questions[index].essayAnswer
      ) {
        initialEssayAnswers[index] =
  row.essay_answer || "";
      }

    }

  });
}
setSelectedPackage(parsedPackage);
setCurrent(savedCurrent ? Number(savedCurrent) : 0);
setAnswers(initialAnswers);
setDoubt(initialDoubt);
setEssayAnswers(initialEssayAnswers);
console.log("SESSION =", session);
console.log("PACKAGE DURATION =", packageData.duration);
const startedAt = new Date(session.started_at).getTime();

const endTime =
  startedAt + session.duration * 60 * 1000;

const remaining = Math.max(
  0,
  Math.floor((endTime - Date.now()) / 1000)
);
console.log("START =", startedAt);
console.log("END =", endTime);
console.log("REMAIN =", remaining);
if (remaining <= 0) {
  submitExam();
  return;
}
setTimeLeft(remaining);
setToken(savedToken);
setCheckingAccess(false);
    } catch {
      window.location.href = "/simulasi";
    }
    };

loadExam();
}, []);

 useEffect(() => {
  if (answers.length > 0) {
    // kosong
  }
}, [answers]);
useEffect(() => {
  if (!selectedPackage) return;

  localStorage.setItem(
    `exam-current-${selectedPackage.id}`,
    current.toString()
  );
}, [current, selectedPackage]);
useEffect(() => {
  if (!numberScrollRef.current) return;

  numberScrollRef.current.scrollTop = 320;
}, [questions.length]);
useEffect(() => {
  if (!selectedPackage) return;

  localStorage.setItem(
    `exam-answers-${selectedPackage.id}`,
    JSON.stringify(answers)
  );

  localStorage.setItem(
    `exam-doubt-${selectedPackage.id}`,
    JSON.stringify(doubt)
  );
}, [answers, doubt, selectedPackage]);



  useEffect(() => {
    if (checkingAccess || submitted || !selectedPackage) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [checkingAccess, submitted, selectedPackage, answers]);

  const score = answers.reduce((total, answer, index) => {
  const q = selectedPackage?.questions[index];

  if (!q) return total;

  if (q.essayAnswer) return total;

  return answer === q.answer ? total + 1 : total;
}, 0);

// =============================
// TAMBAHKAN INI
// =============================
async function saveAnswer(
  questionId: string,
  answer: number | string
) {
  const currentAttemptId =
    attemptId || localStorage.getItem("medivault_attempt_id");

  if (!currentAttemptId) return;

  const currentQuestion =
    selectedPackage?.questions.find(
      (q) => q.id === questionId
    );

  if (!currentQuestion) return;

  const payload: any = {
    attempt_id: currentAttemptId,
    question_id: questionId,
    is_doubt: doubt[current],
  };

  // SOAL ESSAY
  if (
    currentQuestion.essayAnswer &&
    currentQuestion.essayAnswer.length > 0
  ) {
    payload.essay_answer = String(answer);
    payload.selected_answer = null;

    payload.is_correct = isEssayCorrect(
      String(answer),
      currentQuestion.essayAnswer
    );
  }

  // PILIHAN GANDA
  else {
    payload.selected_answer = Number(answer);
    payload.essay_answer = null;

    payload.is_correct =
      Number(answer) === currentQuestion.answer;
  }

  const { error } = await supabase
    .from("attempt_answers")
    .upsert(payload, {
      onConflict: "attempt_id,question_id",
    });

  if (error) {
    console.log(error);
  }
}
// =============================


const formatTime = (seconds: number) => {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;

    return `${String(minute).padStart(2, "0")}:${String(second).padStart(
      2,
      "0"
    )}`;
  };

  const chooseAnswer = async (optionIndex: number) => {
  const copy = [...answers];
  copy[current] = optionIndex;

  setAnswers(copy);

  console.log("SET ANSWERS =", copy);

  await saveAnswer(
    selectedPackage!.questions[current].id,
    optionIndex
  );
};

  const toggleDoubt = async () => {
  const copy = [...doubt];
  copy[current] = !copy[current];
  setDoubt(copy);

  const currentAttemptId =
    attemptId || localStorage.getItem("medivault_attempt_id");

  if (!currentAttemptId) return;

  await supabase
    .from("attempt_answers")
    .update({
      is_doubt: copy[current],
    })
    .eq("attempt_id", currentAttemptId)
    .eq("question_id", question.id);
};

  const goNext = () => {
    if (current < (selectedPackage?.questions.length ?? 0) - 1) {
      setCurrent(current + 1);
    }
  };

  const goBack = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const confirmSubmit = () => {
  const unanswered = selectedPackage.questions.filter((q, index) => {
  if (q.essayAnswer?.length) {
    return (essayAnswers[index] ?? "").trim() === "";
  }

  return answers[index] == null;
}).length;

  const message =
    unanswered > 0
      ? `Masih ada ${unanswered} soal yang belum dijawab.\n\nYakin ingin mengakhiri ujian?`
      : "Semua soal sudah dijawab.\n\nYakin ingin mengakhiri ujian?";

  if (!window.confirm(message)) return;

  submitExam();
};

  async function submitExam() {
  if (submitted || !selectedPackage) return;
const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) return;

setSubmitted(true);

  const totalQuestions = selectedPackage.questions.length;

let correctCount = 0;
let wrongCount = 0;
const topicStats: Record<
  string,
  {
    total: number;
    correct: number;
  }
> = {};
let unansweredCount = 0;



selectedPackage.questions.forEach((q, index) => {
const topic = q.topic || "Lainnya";

if (!topicStats[topic]) {
  topicStats[topic] = {
    total: 0,
    correct: 0,
  };
}

topicStats[topic].total++;

  if (
  Array.isArray(q.essayAnswer) &&
  q.essayAnswer.length > 0
) {

    const userEssay = (essayAnswers[index] || "").trim();

    if (userEssay === "") {
      unansweredCount++;
    } else {

      const result = getEssayScore(
  userEssay,
  q.essayAnswer
);

// salah = bagian yang tidak didapat
correctCount += result.score;

wrongCount += 1 - result.score;

if(result.score >= 0.85){
  topicStats[topic].correct++;
}

    }

    return;
  }

  // pilihan ganda
  const answer = answers[index];

  if (answer == null) {
    unansweredCount++;
  } else if (answer === q.answer) {
    correctCount++;
topicStats[topic].correct++;
  } else {
    wrongCount++;
  }

});

// =============================
// SIMPAN RIWAYAT SOAL UNTUK AI ADAPTIVE CBT
// =============================

const attempts = selectedPackage.questions.map((q, index) => ({
  user_id: user.id,
  question_id: q.id,
  topic: q.topic || "Lainnya",
  difficulty: "sedang",
  correct:
    Array.isArray(q.essayAnswer) && q.essayAnswer.length > 0
      ? getEssayScore(
          (essayAnswers[index] || "").trim(),
          q.essayAnswer
        ).score >= 0.85
      : answers[index] === q.answer,
  score:
    Array.isArray(q.essayAnswer) && q.essayAnswer.length > 0
      ? Math.round(
          getEssayScore(
            (essayAnswers[index] || "").trim(),
            q.essayAnswer
          ).score * 100
        )
      : answers[index] === q.answer
      ? 100
      : 0,
}));

await supabase
  .from("question_attempts")
  .insert(attempts);

const doubtCount = doubt.filter(Boolean).length;

const finalScore = Math.round(
  (correctCount / totalQuestions) * 100
);

if (isAIPractice) {
  await supabase
    .from("profiles")
    .update({
      ai_last_score: finalScore,
    })
    .eq("id", user.id);
}

const weakestTopics = Object.entries(topicStats)
  .map(([topic, data]) => ({
    topic,
    accuracy:
      data.total === 0
        ? 0
        : Math.round((data.correct / data.total) * 100),
  }))
  .sort((a, b) => a.accuracy - b.accuracy);

  const savedAttemptId = localStorage.getItem("medivault_attempt_id");

const currentAttemptId = attemptId || savedAttemptId;

if (!currentAttemptId) {
  alert("Session ujian tidak ditemukan.");
  return;
}

console.log("AUTH USER =", user);
console.log("AUTH UID =", user.id);

console.log("INSERT DATA =", {
  user_id: user.id,
  package_id: selectedPackage.id,
  score: finalScore,
  passing_grade: 70,
  correct_count: correctCount,
  wrong_count: wrongCount,
  unanswered_count: unansweredCount,
  doubt_count: doubtCount,
  total_questions: totalQuestions,
  duration: selectedPackage.duration,
  status: finalScore >= 70 ? "Lulus" : "Belum Lulus",
});

const { error: attemptError } = await supabase
  .from("exam_attempts")
  .update({
    score: finalScore,
    passing_grade: 70,
    correct_count: correctCount,
    wrong_count: wrongCount,
    unanswered_count: unansweredCount,
    doubt_count: doubtCount,
    total_questions: totalQuestions,
    duration: selectedPackage.duration,
    topic_stats: topicStats,
    status: finalScore >= 70 ? "Lulus" : "Belum Lulus",
  })
  .eq("id", currentAttemptId);

console.log("ATTEMPT ERROR =", attemptError);

if (attemptError) {
  setSubmitted(false);
  alert(attemptError.message);
  return;
}

await supabase
  .from("exam_sessions")
  .update({
    finished: true,
  })
  .eq("attempt_id", currentAttemptId);
  await supabase
  .from("profiles")
  .update({
    weakest_topics: weakestTopics,
  })
  .eq("id", user.id);

  await updateAILevel(user.id);

setResultAttemptId(currentAttemptId);
  localStorage.removeItem("medivault_attempt_id");
localStorage.removeItem(`exam-current-${selectedPackage.id}`);
localStorage.removeItem(`exam-answers-${selectedPackage.id}`);
localStorage.removeItem(`exam-doubt-${selectedPackage.id}`);

}

  if (checkingAccess || !selectedPackage || !question) {
    return (
      <main>
        <Navbar />

        <section className="flex min-h-screen items-center justify-center bg-[#f8fbff] px-6">
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-extrabold text-[#061B3A]">
              Memeriksa akses ujian...
            </h1>

            <p className="mt-2 text-slate-500">
              Pastikan kamu sudah login, memiliki token, dan memilih paket soal.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fbff]">
      <Navbar />

      <section
className="
min-h-[calc(100vh-90px)]
lg:h-[calc(100vh-90px)]
px-4
pt-2
pb-2
md:px-8
overflow-visible
lg:overflow-hidden
"
>
        {!submitted ? (
          <div className="mx-auto w-full max-w-[1400px]">
            <div className="mb-2 rounded-3xl border border-slate-100 bg-white p-4 md:p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="mb-2 font-extrabold text-emerald-600">
                    Latihan CBT
                  </p>

                 <h1 className="text-xl md:text-3xl font-extrabold text-[#061B3A] leading-tight">
                    {selectedPackage.title}
                  </h1>

                  <p className="mt-2 font-bold text-slate-500">
                  </p>
                </div>

                <div className="w-full md:w-fit rounded-2xl bg-[#061B3A] px-3 py-2 md:px-4 md:py-3 text-center text-white">
                  <p className="text-xs opacity-80">Sisa Waktu</p>
                  <p className="text-xl md:text-3xl font-extrabold">

                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>
            </div>

            
                <div className="flex flex-col lg:flex-row gap-4">
  {/* Soal & Pilihan */}
<div
className="
flex
flex-1
flex-col
min-h-fit
lg:h-[calc(100vh-210px)]
rounded-3xl
border
border-slate-100
bg-white
p-3
md:p-5
shadow-sm
"
>
      <div className="mb-4 flex justify-between text-sm font-bold text-slate-500">
        <span>Soal {current + 1}</span>
        <span>dari {selectedPackage?.questions.length ?? 0} soal</span>
      </div>

<div
className="
flex-1
overflow-y-auto
pr-2
"
>

     <h2 className="mb-4 whitespace-pre-wrap text-base md:text-xl leading-7 md:leading-relaxed text-[#061B3A]">
  {question.question}
</h2>
{question.image && (
  <img
    src={question.image}
    alt="Soal"
    onClick={() => setZoomImage(question.image!)}
    className="
      mb-6
      mx-auto
      max-h-[300px]
      max-w-[400px]
      cursor-zoom-in
      rounded-xl
      border
      object-contain
    "
  />
)}

      {!isEssay ? (
  <div className="space-y-2">
    {question.options?.map((option, index) => (
      <button
        key={index}
        onClick={() => chooseAnswer(index)}
        className={`w-full rounded-2xl border p-3 text-left font-semibold transition ${
          answers[current] === index
            ? "border-[#061B3A] bg-[#061B3A] text-white"
            : "border-slate-200 bg-white text-[#061B3A]"
        }`}
      >
        {String.fromCharCode(65 + index)}. {option}
      </button>
    ))}
  </div>
) : (
  <textarea
  value={essayAnswers[current] || ""}
  onChange={async (e) => {
  const value = e.target.value;

  const copy = [...essayAnswers];
  copy[current] = value;
  setEssayAnswers(copy);

  await saveAnswer(
    question.id,
    value
  );
}}
    placeholder="Masukkan nama struktur anatomi..."
    className="min-h-[180px] md:min-h-[150px] w-full rounded-2xl border border-slate-300 p-4"
  />
)}

</div>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button
  onClick={goBack}
  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-[#061B3A]"
>
  Back
</button>

       <button
  onClick={toggleDoubt}
  className="w-full rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 font-bold text-amber-700"
>
  {doubt[current] ? "Batal Ragu-ragu" : "Ragu-ragu"}
</button>

        <button
  onClick={goNext}
  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-bold text-[#061B3A]"
>
  Next
</button>
      </div>
    </div>


 
  {/* Sidebar Nomor Soal */}
<aside
className="
w-full
lg:w-64
lg:h-[calc(100vh-210px)]
flex
flex-col
rounded-3xl
border
border-slate-100
bg-white
p-5
shadow-sm
"
>
  <h3 className="mb-4 text-lg font-extrabold text-[#061B3A]">
    Nomor Soal
  </h3>

  {/* Scroll Area */}
  <div
ref={numberScrollRef}
className="
max-h-40
overflow-y-auto
lg:flex-1
lg:max-h-none
pr-2
"
>
    <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-5 gap-2">
      {questions.map((_, index) => {
        const answered =
  Array.isArray(questions[index].essayAnswer) &&
questions[index].essayAnswer.length > 0
    ? (essayAnswers[index] ?? "").trim() !== ""
    : answers[index] != null;
        const isDoubt = doubt[index];
        const active = current === index;

        return (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-9 md:h-10 rounded-lg border text-sm font-extrabold transition ${
              active
                ? "border-[#061B3A] bg-[#061B3A] text-white"
                : isDoubt
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : answered
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-50 text-[#061B3A]"
            }`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  </div>

  <div className="mt-3 space-y-2 text-xs md:text-sm font-semibold text-slate-500">
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded bg-emerald-500" />
      Dijawab
    </div>
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded bg-amber-500" />
      Ragu-ragu
    </div>
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded bg-slate-300" />
      Belum dijawab
    </div>
  </div>

 <button
  onClick={confirmSubmit}
  className="mt-3 w-full rounded-2xl bg-emerald-500 px-4 py-2.5 md:px-5 md:py-3 font-extrabold text-white"
>
    Submit Ujian
  </button>
</aside>
</div>
          </div>
        ) : (
          <div className="mx-auto mt-20 max-w-xl rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
            <p className="mb-2 font-extrabold text-emerald-600">
              Ujian Selesai
            </p>

<p className="mt-3 text-lg font-semibold text-slate-600">
  Skor Kamu
</p>
            <p className="mt-6 text-5xl font-extrabold text-emerald-600">
  {Math.round((score / (selectedPackage?.questions.length ?? 1)) * 100)}
</p>

            <button
  onClick={() => {
    window.location.href = `/hasil/${resultAttemptId}`;
  }}
  className="mt-6 w-full rounded-2xl bg-emerald-500 px-6 py-4 font-extrabold text-white"
>
  Lihat Hasil & Pembahasan
</button>
          </div>
        )}
      </section>
      {zoomImage && (
  <div
    onClick={() => setZoomImage(null)}
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-black/70
      p-4
    "
  >
    <img
      src={zoomImage}
      alt="Zoom"
      onClick={(e) => e.stopPropagation()}
      className="
        max-h-[90vh]
        max-w-[90vw]
        rounded-2xl
        object-contain
        shadow-xl
      "
    />
  </div>
)}
    </main>
  );
}

