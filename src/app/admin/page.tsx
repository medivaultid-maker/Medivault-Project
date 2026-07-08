"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

type ExamPackage = {
  id: string;
  category: string;
  title: string;
  description?: string;
  totalQuestions: number;
  duration: number;
  tokenCost: number;
  pdfName?: string;
  status?: "published";
  createdAt?: string;
};

const categoryLabels: Record<string, string> = {
  "anatomi-teori": "CBT Anatomi",
  "anatomi-praktikum": "Praktikum Anatomi",
  "histologi-teori": "CBT Histologi",
  "histologi-praktikum": "Praktikum Histologi",
};

export default function AdminPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [packages, setPackages] = useState<ExamPackage[]>([]);
const [userCount, setUserCount] = useState(0);
const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
  const loadDashboard = async () => {
    try {
      // =====================
      // CEK LOGIN
      // =====================
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/login";
        return;
      }

      // =====================
      // CEK ROLE
      // =====================
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        window.location.href = "/";
        return;
      }

      // =====================
      // AMBIL PAKET
      // =====================
      const { data: packageData } = await supabase
        .from("exam_packages")
        .select("*")
        .order("created_at", { ascending: false });

      // =====================
      // AMBIL JUMLAH USER
      // =====================
      const { count: profileCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // =====================
      // AMBIL JUMLAH SOAL
      // =====================
      const { count: questionsCount } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true });

      setUserCount(profileCount || 0);
      setQuestionCount(questionsCount || 0);

      if (packageData) {
        setPackages(
          packageData.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            totalQuestions: item.total_questions,
            duration: item.duration,
            tokenCost: item.token_cost,
            createdAt: item.created_at,
            status: "published",
          }))
        );
      }

      setCheckingAccess(false);

    } catch (err) {
      console.error(err);
      window.location.href = "/login";
    }
  };

  loadDashboard();
}, []);

  const totalTokens = packages.reduce(
    (total, item) => total + item.tokenCost,
    0
  );

  const averageDuration =
    packages.length > 0
      ? Math.round(
          packages.reduce((total, item) => total + item.duration, 0) /
            packages.length
        )
      : 0;

  const latestPackages = packages.slice(-5).reverse();

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

  if (checkingAccess) {
    return (
      <main className="min-h-screen bg-[#F4F7FB] font-inter">
        <Navbar />
        <section className="relative overflow-hidden bg-gradient-to-br from-[#061B3A] via-[#10284D] to-[#234F42]">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-md">
            <div className="mx-auto mb-5 h-12 w-12 animate-pulse rounded-2xl bg-blue-100" />

            <h1 className="text-2xl font-poppins font-bold text-[#061B3A]">
              Memeriksa akses admin...
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Sistem sedang memvalidasi akses dashboard.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4F7FB] font-inter">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#061B3A]
via-[#10284D]
to-[#234F42] px-6 py-10 text-white md:px-10">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

<div className="absolute -bottom-32 left-10 h-80 w-80 rounded-full bg-green-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-white/10 bg-[#234F42]/40 px-4 py-2 text-sm font-bold text-blue-100 backdrop-blur">
                ● Admin Control Center
              </div>

              <h1 className="font-poppins text-4xl font-extrabold tracking-tight md:text-5xl">
                Dashboard Administrator
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Kelola seluruh sistem Medivault Exam dari satu dashboard.
              </p>
            </div>

          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/8
backdrop-blur-xl p-5 backdrop-blur">
              <p className="text-xs font-semibold text-[#DDEDE7]">
                Paket Soal
              </p>
              <h2 className="mt-3 text-4xl font-poppins font-extrabold">{packages.length}</h2>
              <p className="mt-2 text-xs text-[#DDEDE7]">Paket tersimpan</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold text-blue-100">Bank Soal</p>
              <h2 className="mt-3 text-4xl font-poppins font-extrabold">{questionCount}</h2>
              <p className="mt-2 text-xs text-[#DDEDE7]">Akumulasi soal</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold text-blue-100">Pengguna</p>
              <h2 className="mt-3 text-4xl font-poppins font-extrabold">{userCount}</h2>
              <p className="mt-2 text-xs text-blue-100">User terdaftar</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-semibold text-blue-100">
                Durasi Ujian
              </p>
              <h2 className="mt-3 text-4xl font-poppins font-extrabold">{averageDuration}m</h2>
              <p className="mt-2 text-xs text-blue-100">Menit</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8 md:px-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <p className="text-xs font-poppins font-bold uppercase tracking-[0.2em] text-[#234F42]">
                    Menu Cepat
                  </p>
                  <h2 className="mt-1 text-2xl font-poppins font-extrabold text-[#061B3A]">
                    Kelola Sistem
                  </h2>
                </div>
              </div>

             <div className="grid gap-4 md:grid-cols-3">
                <Link
                  href="/admin/paket"
                  className="group rounded-3xl border border-[#DCE5E0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF6F3] text-3xl font-bold text-[#234F42]">
                    +
                  </div>

                  <h3 className="text-2xl font-poppins font-bold">Tambah Paket Soal</h3>

                  <p className="mt-2 text-sm leading-6 text-white/80">
                    Buat paket baru, import soal PDF, tambah kunci, dan
                    pembahasan.
                  </p>

                  <p className="mt-5 text-sm font-bold text-[#234F42]">
                    Buka exam builder →
                  </p>
                </Link>

                <Link
                  href="/admin/daftar-paket"
                  className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl font-poppins font-bold text-blue-700">
                    ≡
                  </div>

                  <h3 className="text-2xl font-poppins font-bold text-[#061B3A]">
                    Daftar Paket Soal
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Lihat, cek, dan kelola semua paket soal yang sudah
                    dipublish.
                  </p>

                  <p className="mt-5 text-sm font-bold text-[#234F42]">
                    Kelola paket →
                  </p>
                </Link>

                <Link
  href="/admin/payment"
  className="group rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
>
  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-100 text-3xl">
    💳
  </div>

  <h3 className="text-2xl font-poppins font-bold text-[#061B3A]">
    Verifikasi Pembayaran
  </h3>

  <p className="mt-2 text-sm leading-6 text-slate-500">
    Lihat pembayaran yang masuk dan tambahkan token ke akun user.
  </p>

  <p className="mt-5 text-sm font-bold text-[#234F42]">
    Buka pembayaran →
  </p>
</Link>

              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
              <p className="text-xs font-poppins font-bold uppercase tracking-[0.2em] text-[#234F42]">
                System Summary
              </p>

              <h2 className="mt-1 text-2xl font-poppins font-extrabold text-[#061B3A]">
                Informasi Sistem
              </h2>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-sm font-inter font-semibold text-slate-500">
                    Database
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-poppins font-bold text-emerald-700">
  Supabase
</span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-sm font-inter font-semibold text-slate-500">
                    Total Token Paket
                  </span>
                  <span className="text-sm font-poppins font-bold text-[#061B3A]">
                    {totalTokens}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <span className="text-sm font-inter font-semibold text-slate-500">
                    Status Sistem
                  </span>
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-poppins font-bold text-emerald-700">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
            <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-poppins font-bold uppercase tracking-[0.2em] text-[#234F42]">
                  Recent Packages
                </p>

                <h2 className="mt-1 text-2xl font-poppins font-extrabold text-[#061B3A]">
                  Paket Terbaru
                </h2>

                <p className="mt-2 text-sm font-inter text-slate-500">
                  Menampilkan 5 paket terakhir yang dibuat.
                </p>
              </div>

              <Link
                href="/admin/daftar-paket"
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-poppins font-bold text-slate-700 transition hover:bg-slate-200"
              >
                Lihat Semua
              </Link>
            </div>

            {latestPackages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  +
                </div>

                <h3 className="text-xl font-poppins font-bold text-[#061B3A]">
                  Belum ada paket soal
                </h3>

                <p className="mt-2 text-sm font-inter text-slate-500">
                  Mulai buat paket pertama lewat menu Upload Paket Soal.
                </p>

                <Link
                  href="/admin/paket"
                  className="mt-5 inline-flex rounded-2xl border border-[#DCE5E0] bg-white px-5 py-3 text-sm font-bold text-[#061B3A] shadow-sm transition hover:bg-[#EEF6F3]"
                >
                  Buat Paket Sekarang
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[900px] overflow-hidden rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-[1.5fr_1fr_0.6fr_0.6fr_0.6fr_0.8fr] gap-4 bg-slate-50 px-5 py-4 text-sm font-poppins font-bold text-slate-500">
                    <span>Nama Paket</span>
                    <span>Kategori</span>
                    <span>Soal</span>
                    <span>Durasi</span>
                    <span>Token</span>
                    <span>Status</span>
                  </div>

                  {latestPackages.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.5fr_1fr_0.6fr_0.6fr_0.6fr_0.8fr] gap-4 border-t border-slate-100 px-5 py-5 text-sm font-inter text-slate-700 transition hover:bg-slate-50"
                    >
                      <div>
                        <strong className="block font-poppins text-[#061B3A]">
                          {item.title || "Tanpa Judul"}
                        </strong>

                        <span className="mt-1 block font-inter text-xs text-slate-400">
                          Dibuat: {formatDate(item.createdAt)}
                        </span>
                      </div>

                      <span className="text-slate-500">
                        {categoryLabels[item.category] || item.category || "-"}
                      </span>

                      <span className="font-bold text-[#061B3A]">
                        {item.totalQuestions || 0}
                      </span>

                      <span>{item.duration || 0}m</span>

                      <span>{item.tokenCost || 0}</span>

                      <span>
                        <span className="inline-flex w-fit rounded-full bg-[#EEF6F3]
 px-3 py-1 text-xs font-poppins font-bold text-[#234F42]">
                          Published
                        </span>
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
