"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";

type TopicItem = {
  topic: string;
  accuracy: number;
};

export default function LatihanAI() {
  const [topics, setTopics] = useState<TopicItem[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("weakest_topics")
      .eq("id", user.id)
      .single();

    setTopics(data?.weakest_topics || []);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-5xl p-8">

        <h1 className="text-3xl font-bold">
          Latihan AI
        </h1>

        <p className="mt-2 text-slate-500">
          AI mendeteksi kelemahanmu pada topik berikut.
        </p>

        <div className="mt-8 grid gap-5">

          {topics.map((item) => (

            <div
              key={item.topic}
              className="rounded-2xl border bg-white p-6"
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-xl font-bold">
                    {item.topic}
                  </h2>

                  <p className="text-slate-500">
                    Akurasi {item.accuracy}%
                  </p>

                </div>

                <button
  onClick={() => {
    window.location.href =
      "/latihan-ai/" +
      encodeURIComponent(item.topic);
  }}
  className="rounded-xl bg-emerald-500 px-5 py-2 font-bold text-white"
>
  Mulai Latihan
</button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}