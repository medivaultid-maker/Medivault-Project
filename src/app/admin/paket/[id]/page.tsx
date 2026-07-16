"use client";
import { supabase } from "../../../lib/supabase";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";

import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type QuestionItem = {
  id: string;
  question: string;
  image?: string;
  options?: string[];
  answer?: number;
  essayAnswer?: string;
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


  const params = useParams();
const router = useRouter();

const id = params.id as string;

  const [questions, setQuestions] = useState<QuestionItem[]>([
  {
 id: crypto.randomUUID(),
 question: "",
 options: [],
 answer: undefined,
 essayAnswer: "",
 discussion: "",
},
]);

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

useEffect(() => {
  if (!id) return;

  const loadPackage = async () => {
    // ambil paket
    const { data: paket } = await supabase
      .from("exam_packages")
      .select("*")
      .eq("id", id)
      .single();

    if (!paket) return;

    setTitle(paket.title);
    setCategory(paket.category);
    setDuration(paket.duration);
    setTokenCost(paket.token_cost);

    // ambil soal
    const { data: soal } = await supabase
  .from("questions")
  .select("*")
  .eq("package_id", id)
  .order("order_no", { ascending: true });

    if (!soal) return;

    setQuestions(
      soal.map((q) => ({
        id: q.id,
        question: q.question,
        image: q.image,
        options: q.options,
        answer: q.answer,
        essayAnswer: q.essay_answer,
        discussion: q.discussion,
        discussionImage: q.discussion_image,
      }))
    );
  };

  loadPackage();
}, [id]);

  const optionLabels = ["A", "B", "C", "D", "E"];

  const updateQuestion = (i: number, val: string) => {
    const copy = [...questions];
    copy[i].question = val;
    setQuestions(copy);
  };

  const updateOption = (qi: number, oi: number, val: string) => {
    const copy = [...questions];
    copy[qi].options[oi] = val;
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
  i: number,
  val: string
) => {
  const copy = [...questions];
  copy[i].essayAnswer = val;
  setQuestions(copy);
};

  const addQuestion = () => {
  setQuestions([
    ...questions,
    {
  id: crypto.randomUUID(),
  question: "",
      answer: 0,
      discussion: "",
    },
  ]);
};

  const deleteQuestion = (i: number) => {
  if (questions.length === 1) return alert("Minimal 1 soal");
  setQuestions(questions.filter((_, idx) => idx !== i));
};

// TEMPEL DI SINI

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

  if (id) {
    // UPDATE PAKET

    const { error } = await supabase
      .from("exam_packages")
      .update({
        title,
        category,
        duration,
        token_cost: tokenCost,
        total_questions: questions.length,
      })
      .eq("id", id);

    if (error) {
      alert("Gagal update paket");
      return;
    }

    // hapus soal lama
    const { error: deleteError } = await supabase
  .from("questions")
  .delete()
  .eq("package_id", id);


if (deleteError) {
  console.error(deleteError);
  alert("Gagal menghapus soal lama");
  return;
}

    // insert soal baru
const { error: insertQuestionError } = await supabase
  .from("questions")
  .insert(
    questions.map((q, index) => ({
      package_id: id,
      question: q.question,
      image: q.image || null,
      options: q.options || null,
      answer: q.answer ?? null,
      essay_answer: q.essayAnswer || null,
      discussion: q.discussion || "",
      discussion_image: q.discussionImage || null,
      order_no: index + 1,
    }))
  );

if (insertQuestionError) {
  console.error(insertQuestionError);
  alert("Soal gagal diperbarui");
  return;
}

alert("Paket berhasil diupdate!");

router.push("/admin/daftar-paket");
router.refresh();
return;
  }

  // MODE TAMBAH BARU

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
    alert("Gagal membuat paket");
    return;
  }

 await supabase.from("questions").insert(
  questions.map((q, index) => ({
      package_id: paket.id,
      question: q.question,
      image: q.image || null,
      options: q.options || null,
      answer: q.answer ?? null,
      essay_answer: q.essayAnswer || null,
      discussion: q.discussion || "",
      discussion_image: q.discussionImage || null,
order_no: index + 1,
    }))
  );

  alert("Paket berhasil dibuat!");
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
            {questions.map((q, i) => (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <p className="font-poppins text-lg font-bold text-[#061B3A]">
                      Soal {i + 1}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Kunci jawaban:{" "}
                      <span className="font-bold text-emerald-600">
                        {String.fromCharCode(65 + q.answer)}
                      </span>
                    </p>
                  </div>

                  <div className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                    CBT Preview
                  </div>
                </div>

                <div className="whitespace-pre-line rounded-xl bg-slate-50 p-5 text-sm font-medium leading-7 text-slate-800">
                  {q.question}
                </div>

                {q.image && (
  <img
    src={q.image}
    alt={`Soal ${i + 1}`}
    className="mt-4 max-h-52 rounded-xl border border-slate-200 bg-white object-contain"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />
)}

                <div className="mt-5 grid gap-3">
                  {q.options.map((opt, j) => (
                    <div
                      key={j}
                      className={`flex gap-3 rounded-xl border p-4 ${
                        q.answer === j
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          q.answer === j
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {String.fromCharCode(65 + j)}
                      </div>

                      <p className="pt-1 text-sm leading-6 text-slate-700">
                        {opt}
                      </p>
                    </div>
                  ))}
                </div>

                {q.discussion && (
                  <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                    <p className="font-poppins text-sm font-bold text-emerald-800">
                      Pembahasan
                    </p>
                    <div className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {q.discussion}
                    </div>
                  </div>
                )}

                {q.discussionImage && (
                  <img
                    src={q.discussionImage}
                    className="mt-4 max-h-56 rounded-xl border border-slate-200 object-contain"
                  />
                )}
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
            Admin Exam Builder
          </p>

          <h1 className="mt-1 font-poppins text-3xl font-extrabold text-[#061B3A]">
            {id ? "Edit Paket" : "Upload Soal"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
  Buat dan kelola paket ujian CBT maupun praktikum, tambahkan soal, atur kunci jawaban, serta pembahasan sebelum dipublikasikan.
</p>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div
  className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm"
>
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
                  className={inputClass}
                  placeholder="Contoh: Paket Anatomi Dasar 1"
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

          <div className="sticky top-20 z-30 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">

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


  <button
    onClick={publishPackage}
    className={`rounded-xl px-5 py-3 text-sm font-bold text-white shadow-sm transition ${emeraldButton}`}
  >
    {id ? "Update Paket" : "Publish Paket"}
  </button>

</div>

 <DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={({ active }) => {
    setActiveId(active.id as string);
  }}
  onDragEnd={(event) => {
    setActiveId(null);
    handleDragEnd(event);
  }}
  onDragCancel={() => {
    setActiveId(null);
  }}
>
  <SortableContext
  items={questions.map((q) => q.id)}
  strategy={rectSortingStrategy}
>
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
  <p className="font-bold text-[#061B3A]">
  Lompat ke Soal
</p>

<p className="mb-4 text-sm text-slate-500">
  Geser nomor soal untuk mengubah urutan.
</p>

    <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
      {questions.map((q, index) => (
        <SortableJump
          key={q.id}
          id={q.id}
          number={index + 1}
        />
      ))}
    </div>
</div>

<div className="rounded-2xl bg-[#061B3A] p-5 text-white">
  <p className="text-sm opacity-80">
    Total Soal
  </p>

  <h2 className="mt-1 text-3xl font-bold">
    {questions.length}
  </h2>
</div>

          {questions.map((q, i) => (
  <div
  key={q.id}
  id={`soal-${i + 1}`}
>
    <div
      id={`soal-${i + 1}`}
      className="rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm"
    >
              <div className="sticky top-0 z-20 mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 bg-white pb-4 pt-2 md:flex-row md:items-center">
                <div>
                  
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
                </div>

                <button
                  onClick={() => deleteQuestion(i)}
                  className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100"
                >
                  Hapus Soal
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">

<div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

<div className="mb-6 border-b border-slate-200 pb-4">
  <span className="text-2xl">📄</span>
   <h3 className="text-3xl font-extrabold tracking-wide text-[#061B3A] uppercase">
    SOAL
  </h3>
</div>

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
            onChange={(e) =>
              updateOption(i, oi, e.target.value)
            }
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
        onChange={(e) =>
          updateAnswer(i, Number(e.target.value))
        }
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
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        Jawaban Praktikum
      </label>

      <textarea
        className={textareaClass}
        value={q.essayAnswer || ""}
        onChange={(e) =>
          updateEssayAnswer(i, e.target.value)
        }
      />
    </>
  )}

</div>

<div className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm space-y-5">
<div className="mb-6 border-b border-slate-200 pb-4">
  <span className="text-2xl">🟡</span>
   <h3 className="text-3xl font-extrabold tracking-wide text-[#061B3A] uppercase">
    PEMBAHASAN
  </h3>
</div>

<h4 className="text-sm font-bold text-emerald-700">
  Pembahasan
</h4>

              <textarea
                className="mt-5 min-h-28 w-full rounded-2xl border border-emerald-100 bg-emerald-50 p-5 text-sm leading-7 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                placeholder="Pembahasan"
                value={q.discussion}
                onChange={(e) => updateDiscussion(i, e.target.value)}
              />

              <div className="mt-4 rounded-xl border border-dashed border-emerald-200 bg-emerald-50 p-4">
                <p className="mb-2 text-sm font-bold text-emerald-800">
                  Gambar Pembahasan
                </p>

                <input
                  type="file"
                  accept="image/*"
                  className="text-sm text-slate-500"
                  onChange={(e) => uploadDiscussionImage(i, e.target.files?.[0])}
                />

                <div className="mt-3">
  <label className="mb-1 block text-sm font-medium text-slate-700">
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
    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-[#1D5A47] focus:outline-none"
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
          </div>
        ))}

<DragOverlay>
  {activeId ? (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-xl">
      {
        questions.findIndex(
          (q) => q.id === activeId
        ) + 1
      }
    </div>
  ) : null}
</DragOverlay>
</SortableContext>
</DndContext>
    
          <button onClick={publishPackage} className={`w-full ${emeraldButton}`}>
            {id ? "Update Paket" : "Publish Paket"}
          </button>
        </div>
      </section>
    </main>
  );
}
