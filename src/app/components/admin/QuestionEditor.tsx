"use client";
import { useEffect, useRef } from "react";
import { TOPICS } from "../../lib/topics";
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
  category: string;
};

export default function QuestionEditor({
  questions,
  setQuestions,
  isPraktikum,
  category,
}: Props) {

     const optionLabels = ["A", "B", "C", "D", "E"];
const editorRefs = useRef<(HTMLDivElement | null)[]>([]);

useEffect(() => {
  questions.forEach((q, index) => {
    const editor = editorRefs.current[index];

    if (
      editor &&
      editor.innerHTML !== (q.discussion || "")
    ) {
      editor.innerHTML = q.discussion || "";
    }
  });
}, [questions]);
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
  id={`soal-${i + 1}`}
  className="mt-6 rounded-3xl bg-[#061B3A] p-6 shadow-lg"
>

<div className="mb-6 flex items-center justify-between">
  <div>
    <p className="text-sm font-semibold text-emerald-300">
      Soal #{i + 1}
    </p>

    <h3 className="text-2xl font-bold text-white">
      Editor Soal
    </h3>
  </div>
</div>
<div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">

<div className="flex h-full flex-col rounded-2xl border-2 border-blue-200 bg-blue-50 p-5 shadow-sm">
  <div className="mb-6 rounded-xl bg-violet-100 p-4">
    <span className="text-2xl">📝</span>
    <h3 className="text-3xl font-extrabold tracking-wide text-[#061B3A] uppercase">
      SOAL
    </h3>
  </div>
{/* TOPIK */}
<label className="mb-2 block font-semibold text-slate-700">
Topik
</label>

<select
  className={inputClass}
  value={q.topic}
  onChange={(e) => updateTopic(i, e.target.value)}
>
  <option value="">Pilih BAB</option>

  {(TOPICS[category] || []).map((topic) => (
    <option key={topic} value={topic}>
      {topic}
    </option>
  ))}
</select>



{/* SOAL */}
<label className="mt-5 mb-2 block font-semibold text-slate-700">
Tulis Soal
</label>

<textarea
  className={`${textareaClass} h-[260px] resize-none`}
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
<div className="flex h-full flex-col rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-sm">
  <div className="mb-6 rounded-xl bg-blue-100 p-4">
    <span className="text-2xl">✅</span>
    <h3 className="text-3xl font-extrabold tracking-wide text-emerald-700 uppercase">
      JAWABAN
    </h3>
  </div>
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
<div className="flex h-full flex-col rounded-2xl border-2 border-violet-300 bg-violet-50 p-5 shadow-sm">
  <div className="mb-6 rounded-xl bg-emerald-100 p-4">
    <span className="text-2xl">💡</span>
    <h3 className="text-3xl font-black tracking-wide text-blue-700 uppercase">
      PEMBAHASAN
    </h3>
  </div>
<label className="mt-5 block font-semibold">
Pembahasan
</label>


<div
  ref={(el) => {
    editorRefs.current[i] = el;
  }}
  contentEditable
  suppressContentEditableWarning
  style={{ whiteSpace: "pre-wrap" }}
  className="h-[260px] overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none focus:border-emerald-400 focus:bg-white"
  onInput={(e) => {
    updateDiscussion(i, e.currentTarget.innerHTML);
  }}
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