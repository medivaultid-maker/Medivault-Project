"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { generateAIReport } from "../lib/aiLearningReport";
import { generateRecommendation } from "../lib/studyRecommendation";
import { generateAchievements } from "../lib/achievement";

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
  const [aiReport, setAiReport] = useState<any>(null);
const [recommendation, setRecommendation] = useState<any>(null);
const [achievements, setAchievements] = useState<any[]>([]);

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

    if(attempts){

 const badge =
 generateAchievements(
   attempts.map((item:any)=>({
     score:item.score
   }))
 );

 setAchievements(badge);

}

    // ======================
// AI LEARNING REPORT
// ======================

if (attempts && attempts.length > 0) {

  const latest = attempts[0];

  if (latest.topic_stats) {

   const report =
  generateAIReport(
    latest.topic_stats
  );

setAiReport(report);
 const rec =
      generateRecommendation(
        report.weakest
      );

    setRecommendation(rec);



  }

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
        <div className="mx-auto max-w-[1400px] px-2">

         {/* HERO */}
<div className="mb-10 overflow-hidden rounded-[32px] bg-gradient-to-r from-[#061B3A] via-[#0E2A56] to-[#234F42] p-8 text-white shadow-[0_20px_60px_rgba(6,27,58,.25)]">

  <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

    <div className="max-w-2xl">

     
      <h1 className="mt-5 text-4xl font-black lg:text-5xl">
        Selamat datang,
        <br />
        {name}
      </h1>

      <p className="mt-4 max-w-xl text-white/80 leading-7">
        Pantau perkembangan belajar, analisis kemampuan,
        dan rekomendasi belajar otomatis dari Medivault AI.
      </p>

    </div>

  

  </div>

</div>

          {/* AI DASHBOARD */}

{aiReport && (

<div className="mb-10 rounded-3xl border border-indigo-100 bg-gradient-to-r
from-indigo-50
to-sky-50 p-6 shadow-sm">


<h2 className="text-2xl font-extrabold text-[#061B3A]">
🤖 AI Learning Dashboard
</h2>


<p className="mt-2 text-slate-600">
Analisis kemampuan berdasarkan latihan terakhir kamu.
</p>



<div className="mt-6 grid gap-4 md:grid-cols-2">


<div className="
rounded-3xl
border
border-white
bg-white/80
backdrop-blur
p-6
shadow-lg
">

<h3 className="font-extrabold text-emerald-600">
💪 Topik Terkuat
</h3>


{aiReport.strongest.map(
(item:any)=>(
<div
key={item.topic}
className="mt-3 rounded-xl bg-emerald-50 p-3"
>

<p className="font-bold text-[#061B3A]">
{item.topic}
</p>

<p>
Kemampuan {item.score}%
</p>

</div>
)
)}

</div>



<div className="rounded-2xl bg-white p-5">

<h3 className="font-extrabold text-red-600">
📚 Perlu Review
</h3>


{aiReport.weakest.map(
(item:any)=>(
<div
key={item.topic}
className="mt-3 rounded-xl bg-red-50 p-3"
>

<p className="font-bold text-[#061B3A]">
{item.topic}
</p>

<p>
Kemampuan {item.score}%
</p>

</div>
)
)}

</div>


</div>


</div>

)}

{/* ACHIEVEMENT BADGE */}

{achievements.length > 0 && (

<div className="mb-10 rounded-3xl border border-yellow-100 bg-gradient-to-r
from-yellow-50
to-orange-50 p-6">


<h2 className="text-2xl font-extrabold text-[#061B3A]">
🏆 Achievement
</h2>


<p className="mt-2 text-slate-600">
Badge yang berhasil kamu kumpulkan.
</p>


<div className="mt-5 grid gap-4 md:grid-cols-3">


{achievements.map((badge,index)=>(

<div
key={index}
className="rounded-2x rounded-3xl
border
border-white
bg-white/80
backdrop-blur
shadow-lg
hover:-translate-y-1
transition p-5 shadow-[0_18px_45px_rgba(79,70,229,.08)]"
>


<div className="text-4xl">
{badge.icon}
</div>


<h3 className="mt-3 font-extrabold text-[#061B3A]">
{badge.title}
</h3>


<p className="mt-1 text-sm text-slate-600">
{badge.description}
</p>


</div>

))}


</div>


</div>

)}
{/* AI STUDY RECOMMENDATION */}

{recommendation && (

<div className="mb-10 rounded-3xl border border-emerald-100 bg-gradient-to-r
from-emerald-50
to-teal-50 p-6 shadow-sm">


<h2 className="text-2xl font-extrabold text-[#061B3A]">
📚 Rekomendasi Belajar AI
</h2>


<p className="mt-2 text-slate-600">
Materi yang disarankan berdasarkan hasil latihan terakhir.
</p>


<div className="mt-5 space-y-3">


{recommendation.map((item:any,index:number)=>(

<div
key={index}
className="rounded-2xl bg-white p-4 shadow-sm"
>

<p className="font-extrabold text-[#061B3A]">
{item.topic}
</p>


<p className="mt-1 text-slate-600">
Kemampuan saat ini: {item.score}%
</p>


<div className="mt-3">

<p className="font-bold text-[#061B3A]">
Materi yang disarankan:
</p>


<ul className="mt-2 list-disc pl-5 text-slate-600">

{item.materials.map((m:string,index:number)=>(

<li key={index}>
{m}
</li>

))}

</ul>

</div>

<Link
href={`/materi/${item.topic}`}
className="mt-3 inline-block font-bold text-emerald-600"
>
Pelajari materi →
</Link>


</div>

))}


</div>


</div>

)}

          

          {/* HISTORY (FULL BALIK PUNYA KAMU) */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(6,27,58,.06)]">
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
hover:bg-[#061B3A]
hover:text-white
hover:shadow-lg
"
>
  Mulai Latihan →
</Link>
            </div>

            {history.length === 0 ? (
              <div className="rounded-3xl bg-gradient-to-r
from-slate-50
to-slate-100 p-8 text-center">
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
    className="
grid
grid-cols-[1.5fr_1fr_0.6fr_0.8fr_1fr]
gap-4
border-t
border-slate-100
p-4
text-sm
text-slate-700
hover:bg-slate-50
transition
"
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

