type Topic = {
  topic: string;
  accuracy: number;
};

type Props = {
  weakestTopics: Topic[];
  recommendation: string;
};

export default function LearningReportCard({
  weakestTopics,
  recommendation,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-extrabold text-[#061B3A]">
        🧠 MediVault AI
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Analisis hasil belajar berdasarkan CBT terakhir.
      </p>

      <div className="mt-6">
        <h3 className="mb-3 text-lg font-bold text-[#061B3A]">
          Weakest Topics
        </h3>

        {weakestTopics.length === 0 ? (
          <p className="text-slate-500">
            Belum ada data CBT.
          </p>
        ) : (
          <div className="space-y-3">
            {weakestTopics.map((item) => (
              <div
                key={item.topic}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3"
              >
                <span className="font-semibold text-[#061B3A]">
                  {item.topic}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-bold ${
                    item.accuracy < 50
                      ? "bg-red-100 text-red-600"
                      : item.accuracy < 75
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.accuracy.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl bg-blue-50 p-5">
        <h3 className="font-bold text-[#061B3A]">
          📚 Rekomendasi Belajar
        </h3>

        <p className="mt-2 text-slate-700">
          {recommendation}
        </p>

        <button
  onClick={() => {
    window.location.href = "/ai/adaptive";
  }}
  className="mt-5 rounded-xl bg-[#061B3A] px-5 py-3 font-bold text-white transition hover:opacity-90"
>
  Mulai Latihan AI
</button>
      </div>
    </div>
  );
}
