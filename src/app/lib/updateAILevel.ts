import { supabase } from "./supabase";

export async function updateAILevel(userId: string) {
  const { data, error } = await supabase
    .from("question_attempts")
    .select("correct")
    .eq("user_id", userId);

  if (error || !data || data.length === 0) return;

  const correct = data.filter(
    (item) => item.correct
  ).length;

  const accuracy = Math.round(
    (correct / data.length) * 100
  );

  let level = "mudah";

  if (accuracy >= 80) {
    level = "sulit";
  } else if (accuracy >= 50) {
    level = "sedang";
  }

  await supabase
    .from("profiles")
    .update({
      ai_level: level,
    })
    .eq("id", userId);
}