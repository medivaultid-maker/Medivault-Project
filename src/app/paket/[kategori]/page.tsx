"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";
import {
  getPackages,
  getHistory,
  getUserToken,
  getQuestions,
  createAttempt,
  createSession,
  getActiveSession,
  updateUserToken,
} from "../../lib/exam";
import { startExam } from "../../lib/exam";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

type ExamPackage = {
  id: string;
  category: string;
  title: string;
  description?: string;
  duration: number;
  tokenCost: number;
  totalQuestions: number;
  questions?: any[];
};

type ExamHistoryItem = {
  id: string;
  packageId: string;
  title: string;
  category: string;
  date: string;
  score: number;
  status: "ongoing" | "finished";
};

const categoryLabels: Record<string, string> = {
  "anatomi-teori": "CBT Anatomi",
  "anatomi-praktikum": "Praktikum Anatomi",
  "histologi-teori": "CBT Histologi",
  "histologi-praktikum": "Praktikum Histologi",
};

export default function PaketPage() {
  const params = useParams();
  const kategori = (params?.kategori as string) || "";

  const [token, setToken] = useState(0);
  const [packages, setPackages] = useState<ExamPackage[]>([]);
  const [history, setHistory] = useState<ExamHistoryItem[]>([]);

  useEffect(() => {
    console.log("USE EFFECT JALAN");
  const loadData = async () => {
    console.log("LOAD DATA JALAN");
    
    const session = await supabase.auth.getSession();

console.log("SESSION =", session.data.session);

const {
  data: { user },
} = await supabase.auth.getUser();

console.log("USER =", user);

if (!user) {
  console.log("USER NULL");
  return;
}

    // ambil token
   const { data: profile } =
  await getUserToken(user.id);
    if (profile) {
      setToken(profile.token);
    }

    // ambil paket
   const { data: packageData, error } =
  await getPackages();

console.log("DATA =", packageData);
console.log("ERROR =", error);
  console.log("PACKAGE DATA =", packageData);

    if (packageData) {
      setPackages(
        packageData.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description || "",
          category: item.category,
          duration: item.duration,
          tokenCost: item.token_cost,
          totalQuestions: item.total_questions,
        }))
      );
    }

    // ambil riwayat
    const {
  data: attempts,
  error: attemptsError,
} = await getHistory(user.id);

console.log("ATTEMPTS =", attempts);
console.log("ATTEMPTS ERROR =", attemptsError);

if (attempts) {
  setHistory(
    attempts
      .filter((item: any) => item.exam_packages)
      .map((item: any) => ({
  id: item.id,
  packageId: item.package_id,
  title: item.exam_packages.title,
  category: item.exam_packages.category,
  score: item.score,
  status: item.status,
  date: (() => {
    const d = new Date(item.created_at);

    const tanggal = d.toLocaleDateString("id-ID");
    const jam = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${tanggal} • ${jam}`;
  })(),
}))
  );
}
  };

  loadData();
}, []);

  console.log("URL =", kategori);

packages.forEach((p) =>
  console.log("DB =", `"${p.category}"`)
);

const filteredPackages = packages.filter(
  (p) => p.category.trim() === kategori.trim()
);
  const filteredHistory = history.filter((h) => h.category === kategori);

  const categoryTitle = categoryLabels[kategori] || "Paket Soal";

/* FORMAT DATA UNTUK CHART */
const chartData = filteredHistory
  .slice()
  .reverse()
  .map((item, index) => ({
    name: `Latihan ${index + 1}`, // <-- WAJIB unik
    score: item.score,
    fullTitle: item.title,
    date: item.date,
  }));

console.table(chartData);

return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="px-6 py-10 md:px-10">

        {/* HEADER */}
        <div className="mx-auto mt-8 max-w-7xl text-center">
  <h1 className="text-4xl font-extrabold text-[#061B3A]">
    {categoryTitle}
  </h1>

  <p className="mt-3 text-slate-600">
    Pilih paket latihan yang ingin kamu kerjakan.
  </p>
        
        
        </div>
        <hr className="mx-auto mt-8 mb-10 max-w-7xl border-slate-200" />
<div className="mx-auto grid max-w-7xl gap-8 items-start lg:grid-cols-[380px_1fr]">

  {/* KOLOM KIRI */}
  <div className="space-y-6">

    {/* TOKEN */}
    <div className="rounded-3xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">
        Jumlah Akses
      </p>

      <p className="mt-2 text-4xl font-extrabold text-emerald-600">
        {token}
      </p>
    </div>

    {/* DAFTAR PAKET */}
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <h2 className="mb-5 text-xl font-bold text-[#061B3A]">
        Paket Latihan
      </h2>

      <div className="max-h-[650px] space-y-4 overflow-y-auto pr-2">

        {filteredPackages.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border p-4"
          >
            <h3 className="font-bold text-lg">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              📝 {item.totalQuestions} soal • ⏱ {item.duration} menit • 🪙 {item.tokenCost} token
            </p>

            <button
              disabled={token < item.tokenCost}
              onClick={() => startExam(item, setToken)}
              className={`mt-4 w-full rounded-xl py-2 font-bold ${
                token >= item.tokenCost
                  ? "bg-emerald-500 text-white"
                  : "cursor-not-allowed bg-slate-300 text-slate-500"
              }`}
            >
              {token >= item.tokenCost
                ? "Mulai Latihan"
                : "Token Tidak Cukup"}
            </button>

          </div>
        ))}

      </div>

    </div>

    </div>

  {/* KOLOM KANAN */}
  <div className="-mt-6 space-y-6">
    
        {/* HISTORY */}
        <div className="w-full mt-0">

      

          {/* ================= CHART ================= */}
          {chartData.length > 0 && (
            <div className="mt-6 rounded-3xl border bg-white p-6 shadow-sm">

              <h2 className="mb-6 text-2xl font-bold text-[#061B3A]">
  Riwayat Latihan
</h2>

<h3 className="mb-4 text-lg font-semibold text-slate-600">
  Perkembangan Hasil Latihan
</h3>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    
                    <CartesianGrid strokeDasharray="4" stroke="#e2e8f0" />

                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                    />

                    <YAxis domain={[0, 100]} />

                    <Tooltip
                      content={({ active, payload }) => {
  if (active && payload && payload.length) {

    console.log("PAYLOAD =", payload[0]);

    const data = payload[0].payload;
                          return (
                            <div className="bg-white border rounded-xl p-3 shadow-md">
                             <p className="text-xs text-slate-500">
  {data.fullTitle}
</p>

<p className="font-bold text-emerald-600">
  Skor: {data.score}
</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                  <Line
  type="monotone"
  dataKey="score"
  stroke="#10b981"
  strokeWidth={3}
  dot={{ r: 5 }}
  activeDot={{ r: 7 }}
/>

                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ================= TABLE ================= */}
{filteredHistory.length === 0 ? (
  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
    <p className="text-lg font-bold text-[#061B3A]">
      Belum ada riwayat latihan pada kategori ini.
    </p>

    <p className="mt-2 text-sm text-slate-500">
      Mulai latihan pertamamu untuk melihat perkembangan skor dan hasil belajar.
    </p>
  </div>
) : (
  <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-sm">

    <div className="grid grid-cols-[60px_2fr_100px_220px_160px_100px] items-center gap-4 border-b bg-slate-50 p-4 text-sm font-bold text-slate-500">
  <span>No</span>
  <span>Judul Latihan</span>
  <span>Skor</span>
  <span>Tanggal</span>
  <span>Status</span>

</div>

            {filteredHistory.map((item, index) => {
  console.log("ITEM HISTORY PAKET =", item);

  return (
              
              <div
  key={item.id}
  className="grid grid-cols-[60px_2fr_100px_220px_160px_100px] items-center gap-4 border-b p-4 text-sm"
>
                <span className="font-semibold text-slate-500">
  {index + 1}
</span>
                {item.status === "ongoing" ? (
  <Link
  href={`/ujian/${item.packageId}`}
  className="font-semibold text-[#061B3A] hover:text-emerald-600 transition"
>
  {item.title}
</Link>
) : (
  <Link
    href={`/hasil/${item.id}`}
    className="font-semibold text-[#061B3A] hover:text-emerald-600 transition"
  >
    {item.title}
  </Link>
)}

                <span className="font-bold text-emerald-600">
                  {item.score}
                </span>

                <span>{item.date}</span>

                <span>
  {item.status === "ongoing" ? (
    <span className="font-bold text-amber-500">
      On Going
    </span>
  ) : item.score >= 75 ? (
    <span className="font-bold text-emerald-600">
      Lulus
    </span>
  ) : (
    <span className="font-bold text-red-500">
      Belum Lulus
    </span>
  )}
</span>

             
                </div>
  );
})}

          </div>
)}
</div> {/* wrapper history */}

</div> {/* KOLOM KANAN */}

</div> {/* GRID */}

</section>
</main>
  );
}
