"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function SimulasiPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [token, setToken] = useState(0);
  const [weakestTopics, setWeakestTopics] = useState<any[]>([]);
const [packages, setPackages] = useState<any[]>([]);
  useEffect(() => {
  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("SIMULASI USER =", user);

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { data: profile } = await supabase
  .from("profiles")
  .select("role, token, weakest_topics")
  .eq("id", user.id)
  .single();

    if (!profile) {
      window.location.href = "/login";
      return;
    }

    if (profile.role === "admin") {
      window.location.href = "/admin";
      return;
    }

    setToken(profile.token || 0);
    setWeakestTopics(profile.weakest_topics || []);
    setCheckingAccess(false);
  };

  loadUser();
}, []);

  if (checkingAccess) {
    return (
      <main>
        <Navbar />

        <section style={styles.loadingPage}>
          <div style={styles.loadingCard}>
            <h1 style={styles.loadingTitle}>Memeriksa akses simulasi...</h1>
            <p style={styles.loadingText}>Mohon tunggu sebentar.</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <section style={styles.page}>
       <div style={styles.header}>
  <h1 style={styles.title}>
    Pilih Simulasi Latihan Soal
  </h1>

  <p style={styles.subtitle}>
   
  </p>
</div>

         <div style={styles.heroBox}>

  <div style={styles.heroLeft}>

    <div style={styles.aiBadge}>
      🤖 AI Adaptive Learning
    </div>

    <h2 style={styles.heroTitle}>
      Latihan Berdasarkan Kelemahanmu
    </h2>

    <p style={styles.heroText}>
      {weakestTopics.length > 0
        ? <>Topik yang perlu kamu kuasai selanjutnya adalah <b>{weakestTopics[0].topic}</b>.</>
        : "Kerjakan beberapa simulasi terlebih dahulu agar AI dapat menganalisis kemampuanmu."}
    </p>

    {weakestTopics.length > 0 && (
      <button
        onClick={() => {
          localStorage.setItem(
            "ai_topic",
            weakestTopics[0].topic
          );

          window.location.href = "/ujian/ai";
        }}
        style={styles.aiButton}
      >
        🚀 Mulai Latihan AI
      </button>
    )}

  </div>

  <div style={styles.heroRight}>

    <div style={styles.tokenCard}>
      <p style={styles.tokenLabel}>
        Jumlah Akses
      </p>

      <h2 style={styles.tokenValue}>
        {token}
      </h2>

      <Link
        href="/token"
        style={styles.tokenButton}
      >
        Tambah Akses
      </Link>
    </div>

  </div>

</div>

        <div style={styles.grid}>
  {/* ================= ANATOMI ================= */}
  <div style={styles.card}>
    <div style={styles.anatomyHeader}>
      <h2 style={styles.cardTitle}>Anatomi</h2>
    </div>

    <div style={styles.optionList}>
      <Link href="/paket/anatomi-teori" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>CBT Anatomi</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>

      <Link href="/paket/anatomi-praktikum" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>Praktikum Anatomi</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>
    </div>
  </div>

  {/* ================= HISTOLOGI ================= */}
  <div style={styles.card}>
    <div style={styles.histologyHeader}>
      <h2 style={styles.cardTitle}>Histologi</h2>
    </div>

    <div style={styles.optionList}>
      <Link href="/paket/histologi-teori" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>CBT Histologi</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>

      <Link href="/paket/histologi-praktikum" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>Praktikum Histologi</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>
    </div>
  </div>

  {/* ================= BIOKIMIA ================= */}
  <div style={styles.card}>
    <div style={styles.biochemistryHeader}>
      <h2 style={styles.cardTitle}>Biokimia</h2>
    </div>

    <div style={styles.optionList}>
      <Link href="/paket/biokimia-teori" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>CBT Biokimia</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>

      <Link href="/paket/biokimia-praktikum" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>Praktikum Biokimia</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>
    </div>
  </div>

  {/* ================= FISIOLOGI ================= */}
  <div style={styles.card}>
    <div style={styles.physiologyHeader}>
      <h2 style={styles.cardTitle}>Fisiologi</h2>
    </div>

    <div style={styles.optionList}>
      <Link href="/paket/fisiologi-teori" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>CBT Fisiologi</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>

      <Link href="/paket/fisiologi-praktikum" style={styles.option}>
        <div>
          <h3 style={styles.optionTitle}>Praktikum Fisiologi</h3>
        </div>
        <span style={styles.arrow}>›</span>
      </Link>
    </div>
  </div>
        {/* ================= PARASITOLOGI ================= */}
        <div style={styles.card}>
  <div style={styles.parasitologyHeader}>
    <h2 style={styles.cardTitle}>Parasitologi</h2>
  </div>

  <div style={styles.optionList}>
    <Link href="/paket/parasitologi-teori" style={styles.option}>
      <div>
        <h3 style={styles.optionTitle}>CBT Parasitologi</h3>
      </div>
      <span style={styles.arrow}>›</span>
    </Link>

    <Link href="/paket/parasitologi-praktikum" style={styles.option}>
      <div>
        <h3 style={styles.optionTitle}>Praktikum Parasitologi</h3>
      </div>
      <span style={styles.arrow}>›</span>
    </Link>
  </div>
</div>

<div style={styles.card}>
  <div style={styles.microbiologyHeader}>
    <h2 style={styles.cardTitle}>Mikrobiologi</h2>
  </div>

{/* ================= MIKROBIOLOGI ================= */}
  <div style={styles.optionList}>
    <Link href="/paket/mikrobiologi-teori" style={styles.option}>
      <div>
        <h3 style={styles.optionTitle}>CBT Mikrobiologi</h3>
      </div>
      <span style={styles.arrow}>›</span>
    </Link>

    <Link href="/paket/mikrobiologi-praktikum" style={styles.option}>
      <div>
        <h3 style={styles.optionTitle}>Praktikum Mikrobiologi</h3>
      </div>
      <span style={styles.arrow}>›</span>
    </Link>
  </div>
</div>
</div>
        {token <= 0 && (
          <div style={styles.warningBox}>
            <strong>Token belum tersedia</strong>
            <p>
              Kamu masih dapat melihat seluruh daftar paket latihan. Untuk memulai simulasi, silakan membeli token terlebih dahulu.
            </p>

            <Link href="/token" style={styles.buyButton}>
              Akses Latihan
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  loadingPage: {
    minHeight: "100vh",
    background: "#f8fbff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
  },
  loadingCard: {
    background: "white",
    border: "1px solid #e5eaf2",
    borderRadius: "24px",
    padding: "34px",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
    textAlign: "center",
  },
  loadingTitle: {
    color: "#061b3a",
    fontSize: "28px",
    marginBottom: "10px",
  },
  loadingText: {
    color: "#64748b",
  },
  page: {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left,#EEF6F3 0%,#F8FAFC 35%,#FFFFFF 100%)",
  padding: "64px 24px 90px",
},

header: {
  textAlign: "center",
  marginBottom: "32px",
},
  badge: {
  display: "inline-block",
  background: "#EEF6F3",
  color: "#234F42",
  border: "1px solid #DCE5E0",
  padding: "8px 16px",
  borderRadius: "999px",
  fontWeight: 800,
  marginBottom: "16px",
},
  title: {
    fontSize: "44px",
    color: "#061b3a",
    marginBottom: "12px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "16px",
  },
  tokenBox: {
  maxWidth: "1400px",
  margin: "0 auto 28px",
  background: "white",
  border: "1px solid #E2E8F0",
  borderRadius: "24px",
  padding: "18px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#061B3A",
  boxShadow: "0 14px 40px rgba(6,27,58,.06)",
},
  grid: {
  maxWidth: "1400px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0,1fr))",
  gap: "18px",
},
  card: {
  background: "#FFFFFF",
  borderRadius: "18px",
  border: "1px solid #E2E8F0",
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(6,27,58,.06)",
},
  anatomyHeader: {
  background:
    "linear-gradient(135deg,#061B3A 0%,#234F42 100%)",
  color: "#FFFFFF",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

histologyHeader: {
  background: "linear-gradient(135deg,#234F42 0%,#3A6B5B 100%)",
  color: "#FFFFFF",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},
  cardTitle: {
  fontSize: "22px",
  fontWeight: 800,
  margin: 0,
  color: "#fff",
  textAlign: "center",
},
  optionList: {
  padding: "14px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
},
  option: {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #E2E8F0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  background: "#fff",
},
  optionTitle: {
  color: "#061B3A",
  fontSize: "14px",
  fontWeight: 700,
  margin: 0,
},
  optionText: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  },
  arrow: {
  color: "#234F42",
  fontSize: "20px",
  fontWeight: 700,
},
  warningBox: {
  maxWidth: "1400px",
  margin: "48px auto 0",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "28px",
  padding: "32px",
  boxShadow: "0 20px 50px rgba(6,27,58,.06)",
},

warningBadge: {
  display: "inline-block",
  background: "#EEF6F3",
  color: "#234F42",
  border: "1px solid #DCE5E0",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: 700,
  marginBottom: "16px",
},

warningTitle: {
  fontSize: "28px",
  fontWeight: 800,
  color: "#061B3A",
  marginBottom: "10px",
},

warningText: {
  color: "#64748B",
  lineHeight: 1.7,
  marginBottom: "24px",
},

buyButton: {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",

  padding: "16px 30px",

  background:
    "linear-gradient(135deg,#061B3A 0%,#234F42 100%)",

  color: "#FFFFFF",
  textDecoration: "none",

  fontWeight: 800,
  fontSize: "15px",

  borderRadius: "16px",
  border: "none",

  boxShadow:
    "0 16px 40px rgba(6,27,58,.18)",

  transition: "all .25s ease",
},
biochemistryHeader: {
  background:
    "linear-gradient(135deg,#7C3AED 0%,#9333EA 100%)",
  color: "#FFFFFF",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

physiologyHeader: {
  background:
    "linear-gradient(135deg,#EA580C 0%,#F97316 100%)",
  color: "#FFFFFF",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

microbiologyHeader: {
  background:
    "linear-gradient(135deg,#0891B2 0%,#06B6D4 100%)",
  color: "#FFFFFF",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

parasitologyHeader: {
  background:
    "linear-gradient(135deg,#16A34A 0%,#22C55E 100%)",
  color: "#FFFFFF",
  padding: "16px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
},

heroBox: {
  maxWidth: "1400px",
  margin: "0 auto 40px",
  background:
    "linear-gradient(135deg,#061B3A 0%,#123D73 100%)",
  borderRadius: "28px",
  padding: "42px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "40px",
  color: "white",
  boxShadow: "0 20px 60px rgba(6,27,58,.18)",
},

heroLeft: {
  flex: 1,
},

heroRight: {
  width: "250px",
},

aiBadge: {
  display: "inline-block",
  background: "rgba(255,255,255,.15)",
  padding: "8px 16px",
  borderRadius: 999,
  fontWeight: 700,
  marginBottom: 18,
},

heroTitle: {
  fontSize: "38px",
  fontWeight: 800,
  marginBottom: "12px",
},

heroText: {
  fontSize: "17px",
  lineHeight: 1.7,
  opacity: .95,
  maxWidth: "650px",
},

aiButton: {
  marginTop: "26px",
  padding: "16px 28px",
  background: "#fff",
  color: "#061B3A",
  border: "none",
  borderRadius: "16px",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: "16px",
},

tokenCard: {
  background: "rgba(255,255,255,.12)",
  border: "1px solid rgba(255,255,255,.18)",
  borderRadius: "20px",
  padding: "24px",
  textAlign: "center",
  backdropFilter: "blur(10px)",
},

tokenLabel: {
  fontSize: "14px",
  opacity: .8,
  marginBottom: "8px",
},

tokenValue: {
  fontSize: "56px",
  fontWeight: 900,
  margin: "10px 0",
},

tokenButton: {
  display: "inline-block",
  marginTop: "12px",
  background: "#fff",
  color: "#061B3A",
  padding: "12px 22px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
},

};
