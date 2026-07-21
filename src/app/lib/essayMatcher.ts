import { anatomyDictionary } from "./anatomyDictionary";

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const synonyms: Record<string, string> = {
  "m": "musculus",
  "muscle": "musculus",
  "otot": "musculus",

  "artery": "arteria",
  "arteri": "arteria",

  "vein": "vena",

  "nerve": "nervus",
  "saraf": "nervus",

  "liver": "hepar",
  "hati": "hepar",

  "deltoid": "deltoideus",

  "biceps": "biceps brachii",
};

function applySynonym(text: string) {
  let result = normalize(text);

  Object.entries(synonyms).forEach(([from, to]) => {
    result = result.replaceAll(from, to);
  });

  return result;
}

function levenshtein(a: string, b: string) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++)
    matrix[i] = [i];

  for (let j = 0; j <= a.length; j++)
    matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1])
        matrix[i][j] = matrix[i - 1][j - 1];
      else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function similarity(a: string, b: string) {
  const distance = levenshtein(a, b);

  return (
    1 -
    distance /
      Math.max(a.length, b.length)
  );
}

export function isEssayCorrect(
  userAnswer: string,
  adminAnswers: string[]
) {
  const user = applySynonym(userAnswer);

  for (const ans of adminAnswers) {
    const admin = applySynonym(ans);

    if (similarity(user, admin) >= 0.85) {
      return true;
    }
  }

  return false;
}

export function getEssayScore(
  userAnswer: string,
  adminAnswers: string[]
) {
  const userItems = userAnswer
    .split(/\n|,/)
    .map(applySynonym)
    .filter(Boolean);

  const adminItems = adminAnswers.map(answer => ({
  original: answer,
  normalized: applySynonym(answer),
}));

  let correct = 0;

  const matched: string[] = [];
  const missing: string[] = [];
  const wrong: string[] = [];

  userItems.forEach((user) => {
  const found = adminItems.find(
    admin => similarity(user, admin.normalized) >= 0.85
  );

  if (!found) {
    wrong.push(user);
  }
});

  adminItems.forEach((admin) => {
  const found = userItems.find(
    user => similarity(user, admin.normalized) >= 0.85
  );

  if (found) {
    correct++;
    matched.push(admin.original);
  } else {
    missing.push(admin.original);
  }
});

  return {
    correct,
    total: adminItems.length,
    score: correct / adminItems.length,

    matched,
    missing,
    wrong,
  };
}

export function getEssayFeedback(
  userAnswer: string,
  adminAnswers: string[]
) {
  const result = getEssayScore(userAnswer, adminAnswers);

  const persen = Math.round(result.score * 100);

  let feedback = `🧠 MediVault AI\n\n`;
  feedback += `Skor: ${persen}%\n\n`;

  if (result.matched.length > 0) {
    feedback += "✅ Struktur yang dikenali:\n";

    result.matched.forEach((item) => {
      feedback += `✔ ${item}\n`;
    });

    feedback += "\n";
  }

  if (result.missing.length > 0) {
    feedback += "❌ Struktur yang belum disebutkan:\n";

    result.missing.forEach((item) => {
      feedback += `• ${item}\n`;
    });

    feedback += "\n";
  }

  if (result.wrong.length > 0) {
    feedback += "⚠ Jawaban yang tidak dikenali:\n";

    result.wrong.forEach((item) => {
      feedback += `• ${item}\n`;
    });

    feedback += "\n";
  }

  if (result.score === 1) {
    feedback +=
      "🎉 Semua struktur berhasil diidentifikasi dengan benar.";
  } else if (result.score >= 0.75) {
    feedback +=
      "👍 Jawabanmu sudah sangat baik. Tinggal melengkapi beberapa struktur yang belum disebutkan.";
  } else if (result.score >= 0.5) {
    feedback +=
      "📚 Sebagian struktur sudah benar, namun masih ada beberapa bagian yang perlu dipelajari kembali.";
  } else {
    feedback +=
      "📖 Masih banyak struktur yang belum sesuai. Coba pelajari kembali anatomi pada regio ini.";
  }

  return {
    correct: result.score >= 0.85,
    feedback,

    highlight:{
      correct: getHighlightExplanation(result.matched)
      .map(item=>({
        ...item,
        status:"correct",
        message:"Struktur dikenali dengan benar"
      })),

      missing: getHighlightExplanation(result.missing)
      .map(item=>({
        ...item,
        status:"missing",
        message:"Struktur belum disebutkan"
      })),

      wrong: getHighlightExplanation(result.wrong)
      .map(item=>({
        ...item,
        status:"wrong",
        message:"Jawaban tidak sesuai dengan kunci anatomi"
      }))
    }
};
}

export function getEssayExplanation(
  userAnswer: string,
  adminAnswers: string[]
) {
  const userWords = applySynonym(userAnswer)
    .split(/\s+/)
    .filter(Boolean);

  const adminWords = applySynonym(adminAnswers[0])
    .split(/\s+/)
    .filter(Boolean);

  const correctWords = adminWords.filter(word =>
    userWords.includes(word)
  );

  const missingWords = adminWords.filter(
    word => !userWords.includes(word)
  );

  const extraWords = userWords.filter(
    word => !adminWords.includes(word)
  );

  return {
    correctWords,
    missingWords,
    extraWords,
  };
}

export function buildAIExplanation(
  userAnswer: string,
  adminAnswers: string[]
) {
  const feedback = getEssayFeedback(
    userAnswer,
    adminAnswers
  );

  const explain = getEssayExplanation(
    userAnswer,
    adminAnswers
  );

  let text = feedback.feedback;

  if (explain.correctWords.length) {
    text +=
      "\n\n✅ Istilah yang sudah benar:\n";

    explain.correctWords.forEach(word => {
      text += `• ${word}\n`;
    });
  }

  if (explain.missingWords.length) {
    text +=
      "\n⚠ Istilah yang masih kurang:\n";

    explain.missingWords.forEach(word => {
      text += `• ${word}\n`;
    });
  }

  if (explain.extraWords.length) {
    text +=
      "\nℹ Istilah tambahan yang tidak dikenali:\n";

    explain.extraWords.forEach(word => {
      text += `• ${word}\n`;
    });
  }

  const anatomy =
  getAnatomyExplanation(adminAnswers);

if (anatomy) {
  text += "\n\n📚 Penjelasan Anatomi\n";

  text +=
    "\n" + anatomy.explanation;

  if (anatomy.function) {
    text +=
      "\n\n🦾 Fungsi\n" +
      anatomy.function;
  }

  if (anatomy.innervation) {
    text +=
      "\n\n🧠 Persarafan\n" +
      anatomy.innervation;
  }

  if (anatomy.bloodSupply) {
    text +=
      "\n\n🩸 Vaskularisasi\n" +
      anatomy.bloodSupply;
  }

  if (anatomy.mnemonic) {
    text +=
      "\n\n💡 Mnemonic\n" +
      anatomy.mnemonic;
  }
}

  return {
  text,
  highlight: feedback.highlight,
};
}

export function getAnatomyExplanation(
  adminAnswers: string[]
) {

  if (!adminAnswers || adminAnswers.length === 0) {
    return null;
  }

  const key = applySynonym(adminAnswers[0]);

  return anatomyDictionary[key];
}

export function getHighlightExplanation(
  items: string[]
) {

  return items.map(item => {

    const key = applySynonym(item);

    const anatomy = anatomyDictionary[key];

    return {
      text: item,

      explanation: anatomy
        ? anatomy.explanation
        : "Tidak ada informasi anatomi.",

      function: anatomy?.function,
      innervation: anatomy?.innervation,
      bloodSupply: anatomy?.bloodSupply,
      mnemonic: anatomy?.mnemonic,
    };

  });

}

export function compareEssayWords(
  userAnswer: string,
  adminAnswers: string[]
) {
  const userWords = applySynonym(userAnswer)
    .split(/\s+/)
    .filter(Boolean);

  const adminWords = applySynonym(adminAnswers[0])
    .split(/\s+/)
    .filter(Boolean);

  return adminWords.map(word => ({
    word,
    correct: userWords.includes(word),
  }));
}