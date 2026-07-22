import { getWeakTopics } from "./weakTopic";
import { getStudyRecommendation } from "./studyRecommendation";

export function generateLearningReport(topicStats: any) {
  const weakest = getWeakTopics(topicStats);

  return {
    weakestTopics: weakest.slice(0, 3),

    recommendation:
      weakest.length > 0
        ? getStudyRecommendation(weakest[0].topic)
        : "Belum ada data latihan.",
  };
}
