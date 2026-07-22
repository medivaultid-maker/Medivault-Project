export type TopicStats = Record<
  string,
  {
    total: number;
    correct: number;
  }
>;

export function getWeakTopics(topicStats: TopicStats) {
  return Object.entries(topicStats)
    .map(([topic, stat]) => ({
      topic,
      total: stat.total,
      correct: stat.correct,
      accuracy:
        stat.total === 0
          ? 0
          : (stat.correct / stat.total) * 100,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}