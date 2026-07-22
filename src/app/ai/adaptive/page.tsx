"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

import { generateLearningReport } from "../../lib/ai/learningReport";

type WeakTopic = {
  topic: string;
  accuracy: number;
};

export default function AdaptivePage() {
  const [topics, setTopics] = useState<WeakTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdaptive();
  }, []);

  async function loadAdaptive() {
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
      const report = generateLearningReport(data.topic_stats);
      setTopics(report.weakestTopics);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8fbff]">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-4xl font-extrabold text-[#061B3A]">
          🧠 AI Adaptive CBT
        </h1>

        <p className="mt-2 text-slate-500">
          Paket soal ini dibuat otomatis berdasarkan kelemahanmu.
        </p>

        {loading ? (
          <p className="mt-8">Memuat...</p>
        ) : (
          <>
            <div className="mt-8 rounded-3xl bg-white p-6 shadow">
              <h2 className="mb-5 text-xl font-bold">
                Komposisi Paket
              </h2>

              {topics.length === 0 ? (
                <p>Belum ada data CBT.</p>
              ) : (
                <>
                  <div className="space-y-4">
                    {topics.map((item, index) => (
                      <div
                        key={item.topic}
                        className="flex justify-between rounded-xl border p-4"
                      >
                        <span>{item.topic}</span>

                        <span>
                          {index === 0
                            ? 15
                            : index === 1
                            ? 10
                            : 5}{" "}
                          soal
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="mt-8 w-full rounded-2xl bg-[#061B3A] py-4 font-bold text-white"
                  >
                    Mulai AI CBT
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}