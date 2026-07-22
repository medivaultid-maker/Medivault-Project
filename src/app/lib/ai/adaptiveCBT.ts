export function getAdaptiveTopics(
  weakestTopics: {
    topic: string;
    accuracy: number;
  }[]
) {
  if (weakestTopics.length === 0) return [];

  const result: string[] = [];

  weakestTopics.forEach((topic, index) => {
    if (index === 0) {
      result.push(
        ...Array(15).fill(topic.topic)
      );
    }

    else if (index === 1) {
      result.push(
        ...Array(10).fill(topic.topic)
      );
    }

    else {
      result.push(
        ...Array(5).fill(topic.topic)
      );
    }
  });

  return result;
}