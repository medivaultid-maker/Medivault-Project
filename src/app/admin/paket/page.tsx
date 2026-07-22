"use client";
import { supabase } from "../../lib/supabase";
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import QuestionEditor from "../../components/admin/QuestionEditor";
import { TOPICS } from "../../lib/topics";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

type QuestionItem = {
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

const categories = [
  { label: "CBT Anatomi", value: "anatomi-teori" },
  { label: "Praktikum Anatomi", value: "anatomi-praktikum" },
  { label: "CBT Histologi", value: "histologi-teori" },
  { label: "Praktikum Histologi", value: "histologi-praktikum" },
];

function SortableJump({
  id,
  number,
}: {
  id: string;
  number: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition ||
      "transform 200ms cubic-bezier(0.2,0,0,1)",
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        document
          .getElementById(`soal-${number}`)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }}
      className="flex h-10 w-10 cursor-grab items-center justify-center rounded-lg border bg-slate-50 hover:bg-[#061B3A] hover:text-white active:cursor-grabbing"
    >
      {number}
    </button>
  );
}

export default function AdminPaketPage() {
  const [importText, setImportText] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("anatomi-teori");
  const isPraktikum = category.includes("praktikum");
  const [duration, setDuration] = useState(60);
  const [tokenCost, setTokenCost] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);

const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5,
    },
  })
);

  const [questions, setQuestions] = useState<QuestionItem[]>([
  {
  id: crypto.randomUUID(),
  topic: "",

  question: "",
    options: isPraktikum ? undefined : ["", "", "", "", ""],
    answer: isPraktikum ? undefined : 0,
    essayAnswer: [""],
    discussion: "",
  },
]);
const answerRefs = useRef<HTMLInputElement[]>([]);
  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50";

  const textareaClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50";

  const primaryButton =
    "rounded-xl bg-[#061B3A] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#0A2A56]";

  const emeraldButton =
    "rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700";

  useEffect(() => {
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || profile?.role !== "admin") {
      window.location.href = "/login";
    }
  };

  checkUser();
}, []);

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

  const getAnswerIndex = (label: string) => {
    const idx = optionLabels.indexOf(label.toUpperCase());
    return idx >= 0 ? idx : 0;
  };

  const hasEnoughOptions = (block: string) => {
    const matches = block.match(/(?:^|\n)\s*[A-E]\s*[\.\)]\s+/gi);
    return (matches ?? []).length >= 3;
  };

  const splitQuestionBlocks = (text: string) => {
    const marked = ("\n" + text).replace(
      /\n\s*(\d{1,3})\s*[\.\)]\s+/g,
      "\n@@Q@@$1. "
    );

    const segments = marked
      .split("@@Q@@")
      .map((s) => s.trim())
      .filter(Boolean);

    const blocks: string[] = [];
    let current = "";

    for (const segment of segments) {
      if (!current) {
        current = segment;
        continue;
      }

      if (hasEnoughOptions(current)) {
        blocks.push(current.trim());
        current = segment;
      } else {
        current += "\n" + segment;
      }
    }

    if (current.trim()) blocks.push(current.trim());

    return blocks;
  };

  const parseSingleQuestionBlock = (block: string): QuestionItem => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const questionLines: string[] = [];
    const discussionLines: string[] = [];
    const optionMap = ["", "", "", "", ""];

    let currentOption: number | null = null;
    let answerIndex = 0;
    let isDiscussion = false;

    lines.forEach((rawLine, index) => {
      let line = rawLine.trim();

      if (index === 0) {
        line = line.replace(/^\d{1,3}\s*[\.\)]\s*/, "").trim();
      }

      const answerMatch = line.match(
        /^(?:kunci\s*)?(?:jawaban|answer|ans)\s*[:=\-]?\s*([A-E])/i
      );

      if (answerMatch) {
        answerIndex = getAnswerIndex(answerMatch[1]);
        currentOption = null;
        return;
      }

      const discussionMatch = line.match(
        /^(?:pembahasan|bahasan|penjelasan|discussion|rationale)\s*[:=\-]?\s*(.*)$/i
      );

      if (discussionMatch) {
        isDiscussion = true;
        currentOption = null;

        const discussionText = discussionMatch[1]?.trim();
        if (discussionText) discussionLines.push(discussionText);

        return;
      }

      if (isDiscussion) {
        discussionLines.push(line);
        return;
      }

      const optionMatch = line.match(/^([A-E])\s*[\.\)]\s*(.*)$/i);

      if (optionMatch) {
        const optionIndex = getAnswerIndex(optionMatch[1]);
        optionMap[optionIndex] = optionMatch[2]?.trim() || "";
        currentOption = optionIndex;
        return;
      }

      if (currentOption !== null && optionMap[currentOption]) {
        optionMap[currentOption] += " " + line;
        return;
      }

      questionLines.push(line);
    });

    return {
  id: crypto.randomUUID(),
  topic: "",

  question: questionLines.join("\n").trim(),
  options: optionMap,
  answer: answerIndex,
  discussion: discussionLines.join("\n").trim(),
};
  };

  const parseQuestionsFromText = () => {
    if (!importText.trim()) return alert("Paste soal dulu!");

    const cleanText = normalizeImportText(importText);
    const blocks = splitQuestionBlocks(cleanText);

    const parsed = blocks
      .map(parseSingleQuestionBlock)
      .filter((q) => q.question || q.options.some((opt) => opt.trim()));

    if (!parsed.length) {
      return alert("Format soal belum terbaca. Cek lagi format copas PDF-nya.");
    }

    console.log("BLOCKS =", blocks);
console.log("PARSED =", parsed);
console.log("JUMLAH =", parsed.length);

    setQuestions([...parsed]);
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

  const addQuestion = () => {
  setQuestions([
    ...questions,
    {
      id: crypto.randomUUID(),
      topic: "",
      
      question: "",
      options: isPraktikum ? undefined : ["", "", "", "", ""],
      answer: isPraktikum ? undefined : 0,
      essayAnswer: [""],
      discussion: "",
    },
  ]);
};

  const deleteQuestion = (i: number) => {
    if (questions.length === 1) return alert("Minimal 1 soal");
    setQuestions(questions.filter((_, idx) => idx !== i));
  };
  const handleDragEnd = (event: any) => {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  setQuestions((items) => {
    const oldIndex = items.findIndex((q) => q.id === active.id);
    const newIndex = items.findIndex((q) => q.id === over.id);

    return arrayMove(items, oldIndex, newIndex);
  });
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

  const publishPackage = async () => {
  if (!title.trim()) {
    alert("Nama paket belum diisi!");
    return;
  }

  // 1. Simpan paket
  const { data: paket, error: paketError } = await supabase
    .from("exam_packages")
    .insert([
      {
        title,
        category,
        duration,
        token_cost: tokenCost,
        total_questions: questions.length,
      },
    ])
    .select()
    .single();

  if (paketError) {
    console.error(paketError);
    alert("Gagal menyimpan paket");
    return;
  }

  // 2. Simpan semua soal
  const soalRows = questions.map((q) => ({
    package_id: paket.id,
    topic: q.topic || null,

    question: q.question,
    image: q.image || null,

    options: q.options || null,
    answer: q.answer ?? null,

    essay_answer:
  q.essayAnswer?.filter((v) => v.trim() !== "") || [],

    discussion: q.discussion || "",
    discussion_image: q.discussionImage || null,
  }));

  const { data, error: soalError } = await supabase
  .from("questions")
  .insert(soalRows)
  .select();

console.log("SOAL YANG DIKIRIM =", soalRows);
console.log("HASIL INSERT =", data);
console.log("ERROR INSERT =", soalError);

if (soalError) {
  alert(JSON.stringify(soalError));
  return;
}

alert("Paket & soal berhasil disimpan!");

window.location.href = "/admin";
};

  if (previewMode) {
    return (
      <main className="min-h-screen bg-slate-50 font-inter">
        <Navbar />

        <section className="border-b border-slate-200 bg-white px-6 py-6">
          <div className="mx-auto max-w-6xl">
            <button
              onClick={() => setPreviewMode(false)}
              className="mb-5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              ← Kembali Edit
            </button>

            <div className="rounded-2xl border border-slate-200 bg-[#061B3A] p-6 text-white">
              <p className="text-sm font-medium text-emerald-200">
                Preview Paket Ujian
              </p>

              <h1 className="mt-2 font-poppins text-3xl font-bold">
                {title || "Nama Paket Belum Diisi"}
              </h1>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Kategori</p>
                  <p className="mt-1 font-semibold">
                    {categories.find((c) => c.value === category)?.label}
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Durasi</p>
                  <p className="mt-1 font-semibold">{duration} menit</p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Token</p>
                  <p className="mt-1 font-semibold">{tokenCost}</p>
                </div>

                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-xs text-slate-300">Jumlah Soal</p>
                  <p className="mt-1 font-semibold">{questions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="mx-auto max-w-6xl space-y-5">
           <QuestionEditor
  questions={questions}
  setQuestions={setQuestions}
  isPraktikum={isPraktikum}
  category={category}
/>

{questions.map((q, i) => (
  <div key={q.id} className="mt-5 rounded-xl bg-white p-5">
    <h3 className="font-bold">
      Pembahasan Soal {i + 1}
    </h3>

    <p className="mt-2 text-slate-700">
      {q.discussion}
    </p>
  </div>
))}
                </div>

               
          
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 font-inter">
      <Navbar />

      <section className="border-b border-slate-200 bg-white px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold text-emerald-600">
            
          </p>

          <h1 className="mt-1 font-poppins text-3xl font-extrabold text-[#061B3A]">
            Upload Soal
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Buat paket ujian CBT & praktikum, import soal dari PDF, atur kunci jawaban, dan
            tambahkan pembahasan sebelum dipublikasikan.
          </p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-poppins text-xl font-bold text-[#061B3A]">
                  Data Paket
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Informasi dasar paket ujian yang akan ditampilkan ke user.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                Draft
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
             <div>
  <label className="mb-2 block text-sm font-bold text-slate-700">
    Nama Paket
  </label>

  <input
    type="text"
    className={inputClass}
    placeholder="Masukkan nama paket"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />
</div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Kategori Ujian
                </label>
                <select
                  className={inputClass}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Durasi Ujian
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Durasi dalam menit"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Isi durasi pengerjaan ujian dalam satuan menit. Contoh: 60
                  untuk 1 jam.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Biaya Token
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Jumlah token"
                  value={tokenCost}
                  onChange={(e) => setTokenCost(Number(e.target.value))}
                />
                
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Jumlah token yang dibutuhkan user untuk membuka paket ujian
                  ini.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center">
              <div>
                <h2 className="font-poppins text-xl font-bold text-[#061B3A]">
                  Import Soal dari PDF
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Support opsi A-E, tipe kombinasi angka, kunci jawaban, dan
                  pembahasan otomatis dari teks.
                </p>
              </div>

              <button onClick={parseQuestionsFromText} className={primaryButton}>
                Generate Soal
              </button>
            </div>

            <textarea
              className={`${textareaClass} h-72`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Format disarankan:

1. Pernyataan yang benar tentang anatomi jantung adalah...
1) Atrium kanan menerima darah vena
2) Ventrikel kiri memompa darah ke aorta
3) Katup trikuspid berada di sisi kanan
4) Vena pulmonalis membawa darah miskin oksigen

A. 1, 2, dan 3
B. 1 dan 3
C. 2 dan 4
D. 4 saja
E. Semua benar

Jawaban: A
Pembahasan: Pernyataan 1, 2, dan 3 benar karena sesuai dengan alur sirkulasi jantung.`}
            />

            <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-800">
              Gunakan label <b>Jawaban:</b> untuk kunci dan{" "}
              <b>Pembahasan:</b> untuk isi pembahasan.
            </div>
          </div>

          <div className="flex flex-col gap-3 md:flex-row">
            <button
              onClick={() => setPreviewMode(true)}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Preview Ujian
            </button>

            <button
              onClick={addQuestion}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-[#061B3A] shadow-sm transition hover:bg-slate-50"
            >
              + Tambah Soal
            </button>
          </div>

          {questions.map((q, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              
<div className="sticky top-0 z-20 mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 bg-white pb-4 pt-2 md:flex-row md:items-center">
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#061B3A] text-lg font-bold text-white">
      {i + 1}
    </div>

    <div>
      <h3 className="font-poppins text-xl font-bold text-[#061B3A]">
        Soal Nomor {i + 1}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Edit soal, jawaban, dan pembahasan.
      </p>
    </div>
  </div>

  <button
    onClick={() => deleteQuestion(i)}
    className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
  >
    Hapus Soal
  </button>
</div>

<div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">

  {/* KOLOM SOAL */}
  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-6 border-b border-slate-200 pb-4">
      <span className="text-2xl">📄</span>
      <h3 className="text-3xl font-extrabold tracking-wide text-[#061B3A] uppercase">
        SOAL
      </h3>
    </div>

    <label className="mb-2 block font-semibold text-slate-700">
  Topik
</label>

<select
  className={`${inputClass} mb-4`}
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

    <label className="font-semibold text-slate-700">
      Tulis Soal
    </label>

    <textarea
      className={`${textareaClass} h-[260px] resize-none`}
      placeholder="Tulis soal"
      value={q.question}
      onChange={(e) => updateQuestion(i, e.target.value)}
    />

    <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <label className="mb-2 block font-semibold text-[#061B3A]">
        Gambar Soal
      </label>

      <input
        type="file"
        accept="image/*"
        className="text-sm text-slate-500"
        onChange={(e) => uploadImage(i, e.target.files?.[0])}
      />

      <div className="mt-3">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Atau tempel link gambar (ImgBB)
        </label>

        <input
          type="text"
          placeholder="https://i.ibb.co/xxxxx/gambar.png"
          value={q.image || ""}
          onChange={(e) => {
            const copy = [...questions];
            copy[i].image = e.target.value;
            setQuestions(copy);
          }}
          className={inputClass}
        />
      </div>

      {q.image && (
        <img
          src={q.image}
          alt={`Soal ${i + 1}`}
          className="mt-4 max-h-52 rounded-xl border border-slate-200 bg-white object-contain"
        />
      )}
    </div>
  </div>

  {/* KOLOM JAWABAN */}
  <div className="flex h-full flex-col rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
    <div className="mb-6 border-b border-slate-200 pb-4">
      <span className="text-2xl">🟡</span>
      <h3 className="text-3xl font-extrabold tracking-wide text-[#061B3A] uppercase">
        JAWABAN
      </h3>
    </div>

    {!isPraktikum ? (
      <>
        {optionLabels.map((label, oi) => (
          <div key={oi} className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Pilihan {label}
            </label>

            <input
              className={inputClass}
              value={q.options?.[oi] || ""}
              onChange={(e) => updateOption(i, oi, e.target.value)}
            />
          </div>
        ))}

        <hr className="border-slate-200" />

        <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
          Kunci Jawaban
        </label>

        <select
          className={inputClass}
          value={q.answer}
          onChange={(e) => updateAnswer(i, Number(e.target.value))}
        >
          {optionLabels.map((l, idx) => (
            <option key={idx} value={idx}>
              {l}
            </option>
          ))}
        </select>
      </>
    ) : (
      <>
        <>
  <div className="flex items-center justify-between">
  <label className="text-sm font-semibold text-slate-700">
    Kata Kunci Jawaban Benar
  </label>

  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
    {q.essayAnswer?.length || 0} Jawaban
  </span>
</div>

  <p className="mb-3 text-xs text-slate-500">
    Satu baris = satu jawaban yang dianggap benar.
  </p>

<div className="mt-3 rounded-xl bg-blue-50 p-3 text-xs leading-6 text-blue-700">
Misalnya:
<br />
• Deltoideus
<br />
• M. Deltoideus
<br />
• Musculus Deltoideus
</div>

  {(q.essayAnswer || [""]).map((item, idx) => (
  <div key={idx} className="mb-3 flex items-center gap-3">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
      {idx + 1}
    </div>

    <input
  ref={(el) => {
    if (el) answerRefs.current[idx] = el;
  }}
  className={`${inputClass} flex-1`}
  placeholder={`Jawaban ${idx + 1}`}
  value={item}
  onChange={(e) => {
    const copy = [...questions];
    copy[i].essayAnswer![idx] = e.target.value;
    setQuestions(copy);
  }}
/>

    <button
  type="button"
  onClick={() => deleteEssayAnswer(i, idx)}
  className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-xl font-bold text-red-600 hover:bg-red-100"
>
  ×
</button>

  </div>
))}

  <button
    type="button"
    onClick={() => {
      const copy = [...questions];

      copy[i].essayAnswer = [
 ...(copy[i].essayAnswer || []),
 ""
];
      setQuestions(copy);
    }}
    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 py-3 font-bold text-emerald-700 hover:bg-emerald-100"
  >
    + Tambah Jawaban Benar
  </button>
</>
      </>
    )}
  </div>

  {/* KOLOM PEMBAHASAN */}
<div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-6 border-b border-slate-200 pb-4">
      <span className="text-2xl">🟡</span>
      <h3 className="text-3xl font-extrabold tracking-wide text-[#061B3A] uppercase">
        PEMBAHASAN
      </h3>
    </div>

    <label className="font-semibold text-slate-700">
  Pembahasan
</label>

<textarea
  className={`${textareaClass} h-[260px] resize-none`}
  placeholder="Tulis pembahasan"
  value={q.discussion}
  onChange={(e) => updateDiscussion(i, e.target.value)}
/>

<div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
  <label className="mb-2 block font-semibold text-[#061B3A]">
    Gambar Pembahasan
  </label>

  <input
    type="file"
    accept="image/*"
    className="text-sm text-slate-500"
    onChange={(e) => uploadDiscussionImage(i, e.target.files?.[0])}
  />

  <div className="mt-3">
    <label className="mb-2 block text-sm font-medium text-slate-700">
      Atau tempel link gambar (ImgBB)
    </label>

    <input
      type="text"
      placeholder="https://i.ibb.co/xxxxx/gambar.png"
      value={q.discussionImage || ""}
      onChange={(e) => {
        const copy = [...questions];
        copy[i].discussionImage = e.target.value;
        setQuestions(copy);
      }}
      className={inputClass}
    />
  </div>

  {q.discussionImage && (
    <img
      src={q.discussionImage}
      className="mt-4 max-h-52 rounded-xl border border-slate-200 bg-white object-contain"
    />
  )}
</div>
  </div>
</div>

            </div>
          ))}

<div className="flex justify-center">
  <button
    onClick={addQuestion}
    className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#061B3A] shadow-sm transition hover:bg-slate-50"
  >
    + Tambah Soal Berikutnya
  </button>
</div>
          <button onClick={publishPackage} className={`w-full ${emeraldButton}`}>
            Publish Paket
          </button>
        </div>
      </section>
    </main>
  );
}
