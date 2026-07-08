"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [batch, setBatch] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [valid, setValid] = useState({
    name: false,
    email: false,
    university: false,
    batch: false,
    password: false,
    confirm: false,
  });

  useEffect(() => {
    setValid({
      name: name.trim().length > 2,
      email: /\S+@\S+\.\S+/.test(email),
      university: university.trim().length > 2,
      batch: batch.trim().length > 0,
      password: password.length >= 6,
      confirm: password === confirmPassword && password !== "",
    });
  }, [name, email, university, batch, password, confirmPassword]);

  const registerUser = async () => {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();
  const cleanUniversity = university.trim();
  const cleanBatch = batch.trim();

  if (
    !cleanName ||
    !cleanEmail ||
    !cleanUniversity ||
    !cleanBatch ||
    !password ||
    !confirmPassword
  ) {
    alert("Semua data wajib diisi.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Konfirmasi password tidak sama.");
    return;
  }

  setLoading(true);

  const { data, error } = await supabase.auth.signUp({
  email: cleanEmail,
  password,
  options: {
    data: {
      full_name: cleanName,
      university: cleanUniversity,
      batch: cleanBatch,
    },
  },
});

console.log("DATA:", data);
console.log("ERROR:", error);

if (error) {
  alert(error.message);
  return;
}

const user = data.user;

if (user) {
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      full_name: cleanName,
      university: cleanUniversity,
      batch: cleanBatch,
    });

  if (profileError) {
  console.error(profileError);
  alert(
    JSON.stringify(
      {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      },
      null,
      2
    )
  );
  return;
}
}

setSuccess(true);

setTimeout(() => {
  window.location.href = "/login";
}, 1500);
};

  return (
    <main>
      <Navbar />

      <section className="min-h-screen flex items-center justify-center px-6 py-16 bg-[radial-gradient(circle_at_top_left,#EEF6F3_0%,#F8FAFC_35%,#FFFFFF_100%)]">

  <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_rgba(6,27,58,0.08)] animate-[fadeUp_0.6s_ease] relative overflow-hidden">
    <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#234F42]/5 blur-3xl" />

<div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#0A1733]/5 blur-3xl" />

          {/* SUCCESS OVERLAY */}
          {success && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[28px]">
              <div className="bg-white px-8 py-6 rounded-2xl shadow-xl text-center animate-[pop_0.4s_ease]">
                <h2 className="text-2xl font-extrabold text-[#234F42]">🎉 Berhasil!</h2>
                <p className="text-slate-500 mt-2">Akun kamu sudah dibuat</p>
              </div>
            </div>
          )}

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 rounded-full bg-[#EEF6F3] text-[#234F42] border border-[#DCE5E0] font-bold text-sm mb-4">
              Daftar
            </div>

            <h1 className="text-3xl font-extrabold text-[#061B3A]">
              Daftar Akun Baru
            </h1>

            <p className="text-slate-500 mt-2 text-sm">
              Buat akun untuk mulai latihan dan pantau progres kamu.
            </p>
          </div>

          {/* FORM */}
          <div className="flex flex-col gap-4">

            <Input label="Nama Lengkap" value={name} setValue={setName} valid={valid.name} />
            <Input label="Email" value={email} setValue={setEmail} type="email" valid={valid.email} />
            <Input label="Universitas" value={university} setValue={setUniversity} valid={valid.university} />
            <Input label="Angkatan" value={batch} setValue={setBatch} valid={valid.batch} />
            <Input label="Password" value={password} setValue={setPassword} type="password" valid={valid.password} />
            <Input label="Konfirmasi Password" value={confirmPassword} setValue={setConfirmPassword} type="password" valid={valid.confirm} />

            <button
              onClick={registerUser}
              className="mt-4 py-4 rounded-2xl bg-gradient-to-r from-[#0A1733] to-[#234F42] text-white font-extrabold shadow-[0_18px_40px_rgba(6,27,58,0.18)] hover:scale-[1.02] transition flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </button>

            <button
              onClick={() => alert("Google belum tersedia")}
              className="py-4 rounded-2xl border font-bold hover:bg-slate-50 transition"
            >
              Daftar dengan Google
            </button>

          </div>

          {/* FOOTER */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-[#234F42] font-bold">
              Login
            </Link>
          </p>

        </div>
      </section>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pop {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

    </main>
  );
}

/* INPUT COMPONENT */
function Input({
  label,
  value,
  setValue,
  type = "text",
  valid = false,
}: any) {
  return (
    <div className="flex flex-col gap-1 relative">
      <label className="font-bold text-sm text-[#061B3A]">{label}</label>

      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={label}
        className="px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#234F42]/20 focus:border-[#234F42] transition pr-10"
      />

      {valid && (
        <span className="absolute right-3 top-[38px] text-[#234F42] font-bold">
          ✔
        </span>
      )}
    </div>
  );
}
