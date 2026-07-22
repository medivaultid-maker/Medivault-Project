import { supabase } from "../supabase";

export async function getAIWeakness(userId: string) {
  const { data, error } = await supabase
    .from("question_attempts")
    .select("topic, correct")
    .eq("user_id", userId);

  if (error || !data) {
    return [];
  }

  const topics: Record<
    string,
    { total: number; correct: number }
  > = {};

  data.forEach((item) => {
    const topic = item.topic || "Lainnya";

    if (!topics[topic]) {
      topics[topic] = {
        total: 0,
        correct: 0,
      };
    }

    topics[topic].total++;

    if (item.correct) {
      topics[topic].correct++;
    }
  });

  return Object.entries(topics)
    .map(([topic, value]) => ({
      topic,
      accuracy: Math.round(
        (value.correct / value.total) * 100
      ),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}