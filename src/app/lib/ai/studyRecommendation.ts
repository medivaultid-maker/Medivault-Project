export function getStudyRecommendation(topic: string) {
  switch (topic) {
    case "Farmakologi":
      return "Kerjakan 40 soal Farmakologi dan review obat-obatan yang sering muncul.";

    case "Obgyn":
      return "Pelajari algoritma persalinan normal dan preeklamsia.";

    case "Penyakit Dalam":
      return "Latih diagnosis banding dan tata laksana awal.";

    default:
      return `Fokus memperkuat topik ${topic}.`;
  }
}