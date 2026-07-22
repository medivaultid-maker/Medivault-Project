"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

import LearningReportCard from "../components/ai/LearningReportCard";

import { generateLearningReport } from "../lib/ai/learningReport";

export default function AIPage() {
  const [loading, setLoading] = useState(true);

  const [report, setReport] = useState<{
    weakestTopics: any[];
    recommendation: string;
  }>({
    weakestTopics: [],
    recommendation: "",
  });

  useEffect(() => {
    loadAI();
  }, []);

  async function loadAI() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("exam_attempts")
      .select("topic_stats")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (data?.topic_stats) {
      setReport(generateLearningReport(data.topic_stats));
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8fbff]">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-2 text-4xl font-extrabold text-[#061B3A]">
          🧠 MediVault AI
        </h1>

        <p className="mb-8 text-slate-500">
          Analisis performa belajar dan rekomendasi personal.
        </p>

        {loading ? (
          <p>Memuat AI...</p>
        ) : (
          <LearningReportCard
            weakestTopics={report.weakestTopics}
            recommendation={report.recommendation}
          />
        )}
      </section>
    </main>
  );
}