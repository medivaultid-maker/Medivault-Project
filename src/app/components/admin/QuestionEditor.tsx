"use client";

export type QuestionItem = {
  id: string;
  topic: string;
  question: string;
  image?: string;
  options?: string[];
  answer?: number;
  essayAnswer?: string[];
  discussion: string;
  discussionImage?: string;
};

type Props = {
  questions: QuestionItem[];
  setQuestions: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
  isPraktikum: boolean;
};

export default function QuestionEditor({
  questions,
  setQuestions,
  isPraktikum,
}: Props) {

     const optionLabels = ["A", "B", "C", "D", "E"];

  const normalizeImportText = (text: string) => {
    return text
      .replace(/\r/g, "\n")
      .replace(/\u00A0/g, " ")
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[–—]/g, "-")
      .replace(/[ \t]+/g, " ")
      .replace(/\s+(?=[A-Ea-e]\s*[\.\)]\s+)/g, "\n")
      .replace(/\s+(?=(?:Kunci\s*)?Jawaban\s*[:=\-])/gi, "\n")
      .replace(
        /\s+(?=(?:Pembahasan|Bahasan|Penjelasan|Discussion|Rationale)\s*[:=\-]?)/gi,
        "\n"
      )
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  };

  const updateQuestion = (i: number, val: string) => {
    const copy = [...questions];
    copy[i].question = val;
    setQuestions(copy);
  };

  const updateTopic = (i: number, val: string) => {
  const copy = [...questions];
  copy[i].topic = val;
  setQuestions(copy);
};

  const updateOption = (qi:number, oi:number, val:string)=>{
 const copy=[...questions];

 if(!copy[qi].options){
   copy[qi].options=["","","","",""];
 }

 copy[qi].options[oi]=val;

 setQuestions(copy);
};

  const updateAnswer = (qi: number, val: number) => {
    const copy = [...questions];
    copy[qi].answer = val;
    setQuestions(copy);
  };

 const updateDiscussion = (i: number, val: string) => {
  const copy = [...questions];
  copy[i].discussion = val;
  setQuestions(copy);
};

  const updateEssayAnswer = (
  questionIndex: number,
  answerIndex: number,
  value: string
) => {
  const copy = [...questions];

  copy[questionIndex].essayAnswer![answerIndex] = value;

  setQuestions(copy);
};

const addEssayAnswer = (questionIndex: number) => {
  const copy = [...questions];

  if (!copy[questionIndex].essayAnswer) {
    copy[questionIndex].essayAnswer = [];
  }

  copy[questionIndex].essayAnswer!.push("");

  setQuestions(copy);
};

const deleteEssayAnswer = (
  questionIndex: number,
  answerIndex: number
) => {
  const copy = [...questions];

  copy[questionIndex].essayAnswer!.splice(answerIndex, 1);

  if (copy[questionIndex].essayAnswer!.length === 0) {
    copy[questionIndex].essayAnswer!.push("");
  }

  setQuestions(copy);
};

 const uploadImage = (i: number, file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const copy = [...questions];
      copy[i].image = reader.result as string;
      setQuestions(copy);
    };

    reader.readAsDataURL(file);
  };

  const uploadDiscussionImage = (i: number, file?: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const copy = [...questions];
      copy[i].discussionImage = reader.result as string;
      setQuestions(copy);
    };

    reader.readAsDataURL(file);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50";

  const textareaClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50";


    return (
<>
{questions.map((q, i) => (
<div
key={q.id}
className="mt-6"
>

<div className="mb-5 flex items-center justify-between">
  <div>
    <h3 className="font-poppins text-xl font-bold text-[#061B3A]">
      Soal Nomor {i + 1}
    </h3>
  </div>
</div>
<div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">

<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
{/* TOPIK */}
<label className="mb-2 block font-semibold text-slate-700">
Topik
</label>

<input
className={inputClass}
placeholder="Contoh: Thorax, Abdomen, Epitel..."
value={q.topic}
onChange={(e)=>updateTopic(i,e.target.value)}
/>



{/* SOAL */}
<label className="mt-5 mb-2 block font-semibold text-slate-700">
Tulis Soal
</label>

<textarea
className={textareaClass}
value={q.question}
onChange={(e)=>updateQuestion(i,e.target.value)}
/>
<label className="mt-5 block font-semibold">
Gambar Soal
</label>

<input
type="file"
accept="image/*"
onChange={(e)=>
uploadImage(i,e.target.files?.[0])
}
/>

{q.image && (
<img
src={q.image}
className="mt-3 max-h-60 rounded-xl border"
/>
)}

</div>
<div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
{/* JAWABAN CBT */}
{!isPraktikum && (
<>
{optionLabels.map((label,oi)=>(
<div key={oi} className="mt-3">

<label>
Pilihan {label}
</label>

<input
className={inputClass}
value={q.options?.[oi] || ""}
onChange={(e)=>updateOption(i,oi,e.target.value)}
/>

</div>
))}


<label className="mt-5 block">
Kunci Jawaban
</label>

<select
className={inputClass}
value={q.answer ?? 0}
onChange={(e)=>updateAnswer(i,Number(e.target.value))}
>

{optionLabels.map((l,idx)=>(
<option key={idx} value={idx}>
{l}
</option>
))}

</select>

</>
)}



{/* ESSAY PRAKTIKUM */}
{isPraktikum && (
  <div className="mt-5">

    <label className="font-semibold">
      Kata Kunci Jawaban Benar
    </label>

    {(q.essayAnswer || [""]).map((item, idx) => (
      <div key={idx} className="mt-3 flex gap-3">

        <input
          className={inputClass}
          value={item}
          onChange={(e) =>
            updateEssayAnswer(i, idx, e.target.value)
          }
        />

        <button
          type="button"
          onClick={() => deleteEssayAnswer(i, idx)}
        >
          ×
        </button>

      </div>
    ))}

    <button
      type="button"
      onClick={() => addEssayAnswer(i)}
      className="mt-3 rounded-xl bg-emerald-50 px-4 py-2 font-bold text-emerald-700"
    >
      + Tambah Jawaban Benar
    </button>

  </div>
)}

</div>

{/* PEMBAHASAN */}
<div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
<label className="mt-5 block font-semibold">
Pembahasan
</label>


<textarea
className={textareaClass}
value={q.discussion}
onChange={(e)=>updateDiscussion(i,e.target.value)}
/>
<label className="mt-5 block font-semibold">
Gambar Pembahasan
</label>

<input
type="file"
accept="image/*"
onChange={(e)=>
uploadDiscussionImage(i,e.target.files?.[0])
}
/>


{q.discussionImage && (
  <img
    src={q.discussionImage}
    className="mt-3 max-h-60 rounded-xl border"
  />
)}

</div>

</div>

</div>

))}
</>
);
}