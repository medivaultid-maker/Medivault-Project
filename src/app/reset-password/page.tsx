"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const savePassword = async () => {
    if (password.length < 6) {
      alert("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password berhasil diperbarui.");

    router.push("/login");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          width: 420,
          background: "white",
          padding: 30,
          borderRadius: 20,
          boxShadow: "0 15px 40px rgba(0,0,0,.08)",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="Password Baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 15,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />

        <input
          type="password"
          placeholder="Konfirmasi Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={savePassword}
          disabled={loading}
          style={{
            width: "100%",
            padding: 15,
            border: "none",
            borderRadius: 12,
            background: "#234F42",
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading ? "Menyimpan..." : "Simpan Password Baru"}
        </button>
      </div>
    </main>
  );
}