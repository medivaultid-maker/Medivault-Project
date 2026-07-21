export function generateAchievements(history:any[]) {

  const badges = [];


  if (!history || history.length === 0) {
    return [];
  }


  const highestScore = Math.max(
    ...history.map(item => item.score)
  );


  // 🧠 Anatomi Master
  if (highestScore >= 90) {
    badges.push({
      icon:"🧠",
      title:"Anatomi Master",
      description:"Mencapai nilai di atas 90"
    });
  }


  // 🎯 Perfect Score
  if (
    history.some(
      item => item.score === 100
    )
  ) {
    badges.push({
      icon:"🎯",
      title:"Perfect Score",
      description:"Berhasil mendapatkan nilai sempurna"
    });
  }


  // 🔥 Konsisten Belajar
  if (history.length >= 10) {
    badges.push({
      icon:"🔥",
      title:"Konsisten Belajar",
      description:"Menyelesaikan 10 latihan"
    });
  }


  // 📚 Pejuang UKOM
  if (history.length >= 5) {
    badges.push({
      icon:"📚",
      title:"Pejuang Latihan",
      description:"Aktif berlatih soal"
    });
  }


  return badges;

}