"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function SimulasiPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [token, setToken] = useState(0);
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
      .select("role, token")
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
    Pilih kategori dan jenis latihan yang ingin kamu kerjakan.
  </p>
</div>

          <div style={styles.tokenBox}>
  <span>Jumlah Akses</span>
  <strong>{token}</strong>
</div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.anatomyHeader}>
              <h2 style={styles.cardTitle}>Anatomi</h2>
            </div>

            <div style={styles.optionList}>
              <Link href="/paket/anatomi-teori" style={styles.option}>
                <div>
                  <h3 style={styles.optionTitle}>CBT Anatomi</h3>
                  <p style={styles.optionText}>
                    Kerjakan simulasi CBT anatomi sesuai paket yang tersedia.
                  </p>
                </div>
                <span style={styles.arrow}>›</span>
              </Link>

              <Link href="/paket/anatomi-praktikum" style={styles.option}>
                <div>
                  <h3 style={styles.optionTitle}>Praktikum Anatomi</h3>
                  <p style={styles.optionText}>
                    Kerjakan simulasi praktikum anatomi sesuai paket yang tersedia.
                  </p>
                </div>
                <span style={styles.arrow}>›</span>
              </Link>
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.histologyHeader}>
              <h2 style={styles.cardTitle}>Histologi</h2>
            </div>

            <div style={styles.optionList}>
              <Link href="/paket/histologi-teori" style={styles.option}>
                <div>
                  <h3 style={styles.optionTitle}>CBT Histologi</h3>
                  <p style={styles.optionText}>
                    Kerjakan simulasi CBT histologi sesuai paket yang tersedia.
                  </p>
                </div>
                <span style={styles.arrow}>›</span>
              </Link>

              <Link href="/paket/histologi-praktikum" style={styles.option}>
                <div>
                  <h3 style={styles.optionTitle}>Praktikum Histologi</h3>
                  <p style={styles.optionText}>
                    Kerjakan simulasi praktikum histologi sesuai paket yang tersedia.
                  </p>
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
  maxWidth: "1100px",
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
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "28px",
  },
  card: {
  background: "#FFFFFF",
  borderRadius: "28px",
  border: "1px solid #E2E8F0",
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(6,27,58,.06)",
},
  anatomyHeader: {
  background:
    "linear-gradient(135deg,#061B3A 0%,#234F42 100%)",
  color: "#FFFFFF",
  padding: "28px",
},

histologyHeader: {
  background:
    "linear-gradient(135deg,#234F42 0%,#3A6B5B 100%)",
  color: "#FFFFFF",
  padding: "28px",
},
  cardTitle: {
  fontSize: "32px",
  fontWeight: 800,
  margin: 0,
  color: "#FFFFFF",
},
  optionList: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  option: {
  padding: "20px",
  borderRadius: "18px",
  border: "1px solid #E2E8F0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  background: "#FFFFFF",
},
  optionTitle: {
    color: "#061b3a",
    fontSize: "17px",
    marginBottom: "6px",
  },
  optionText: {
    color: "#64748b",
    fontSize: "14px",
    margin: 0,
  },
  arrow: {
  color: "#234F42",
  fontSize: "30px",
  fontWeight: 700,
},
  warningBox: {
  maxWidth: "1100px",
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
};
