export function generateAIReport(
  topicStats: Record<
    string,
    {
      total:number;
      correct:number;
    }
  >
){

  const topics = Object.entries(topicStats)
  .map(([topic,stat])=>{

    const score = Math.round(
      (stat.correct / stat.total) * 100
    );

    return {
      topic,
      score
    };

  });


  const strongest =
    [...topics]
    .sort((a,b)=>b.score-a.score)
    .slice(0,2);


  const weakest =
    [...topics]
    .sort((a,b)=>a.score-b.score)
    .slice(0,2);



  return {
    strongest,
    weakest
  };

}
export function buildAIExplanation(
  userAnswer: string,
  correctAnswer: string[]
) {

  const lowerUser = userAnswer.toLowerCase();

  const matched = correctAnswer.filter(item =>
    lowerUser.includes(item.toLowerCase())
  );


  const missing = correctAnswer.filter(item =>
    !lowerUser.includes(item.toLowerCase())
  );


  let text = "";

  if (matched.length === correctAnswer.length) {
    text =
      "Jawaban kamu sudah mencakup seluruh struktur penting. Pertahankan pemahaman konsep anatomi ini.";
  } 
  else if (matched.length > 0) {
    text =
      "Sebagian struktur sudah benar, tetapi masih ada beberapa bagian penting yang perlu ditambahkan.";
  }
  else {
    text =
      "Jawaban belum sesuai dengan konsep yang ditanyakan. Pelajari kembali struktur anatomi terkait.";
  }


  return {
    text,

    highlight: {
      correct: matched.map(item => ({
        text:item,
        explanation:
          "Bagian ini sesuai dengan struktur yang diharapkan."
      })),

      missing: missing.map(item => ({
        text:item,
        explanation:
          "Bagian ini belum disebutkan dalam jawaban kamu."
      })),

      wrong:[]
    }
  };
}