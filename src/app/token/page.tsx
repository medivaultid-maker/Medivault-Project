"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

const packages = [
  {
    name: "Paket Starter",
    token: 1,
    price: "Rp5.000",
    description: "Cocok untuk mencoba sistem latihan soal Medivault.",
  },
  {
    name: "Paket Reguler",
    token: 3,
    price: "Rp12.000",
    description: "Cocok untuk latihan beberapa topik dan evaluasi pemahaman.",
  },
  {
    name: "Paket Intensif",
    token: 10,
    price: "Rp45.000",
    description: "Cocok untuk persiapan ujian dan latihan rutin.",
  },
];

export default function TokenPage() {
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(packages[1]);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [currentToken, setCurrentToken] = useState(0);

  useEffect(() => {
  checkUser();
}, []);
    const checkUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const { data: profile } = await supabase
  .from("profiles")
  .select("role, token")
  .eq("id", user.id)
  .single();

  if (profile?.role === "admin") {
    window.location.href = "/admin";
    return;
  }

  if (profile?.role !== "user") {
    window.location.href = "/login";
    return;
  }
  setCurrentToken(profile?.token ?? 0);
  const { data: payment } = await supabase
  .from("payment_requests")
  .select("status")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

setPaymentStatus(payment?.status ?? null);
setCheckingAccess(false);
};

  const confirmPayment = async () => {
    if (paymentStatus === "pending") return;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
.from("payment_requests")
.insert({
    user_id: user.id,
    package_name: selectedPackage.name,
    token: selectedPackage.token,
    amount: Number(
        selectedPackage.price.replace(/[^\d]/g, "")
    ),
    status: "pending",
});

if (error) {
    console.error(error);
    alert("Gagal mengirim permintaan pembayaran.");
    return;
}

setPaymentStatus("pending");
  };

  if (checkingAccess) {
    return (
      <main>
        <Navbar />

        <section style={styles.loadingPage}>
          <div style={styles.loadingCard}>
            <h1 style={styles.loadingTitle}>Memeriksa akses akun...</h1>
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

          <h1 style={styles.title}>Aktifkan Akses Latihan Soal</h1>

          <p style={styles.subtitle}>
            Pilih paket akses sesuai kebutuhan belajar dan mulai berlatih soal Medivault Exam.
          </p>
        </div>

        <div style={styles.tokenStatus}>
  <span>Jumlah Akses</span>

  <strong
    style={{
      fontSize: "28px",
      color: "#234F42",
      fontWeight: 900,
    }}
  >
    {currentToken}
  </strong>
</div>

        <div style={styles.layout}>
          <div style={styles.packageSection}>
            <h2 style={styles.sectionTitle}>Pilih Paket</h2>

            <div style={styles.packageList}>
              {packages.map((item) => {
                const active = selectedPackage.name === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
  setSelectedPackage(item);
  setPaymentStatus(null);
}}
                    style={{
                      ...styles.packageCard,
                      ...(active ? styles.packageCardActive : {}),
                    }}
                  >
                    <div>
                      <h3 style={styles.packageName}>{item.name}</h3>
                      <p style={styles.packageDesc}>{item.description}</p>
                    </div>

                    <div style={styles.packageRight}>
                      <strong style={styles.packagePrice}>{item.price}</strong>
                      <span style={styles.packageToken}>{item.token} Token</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

<div style={styles.paymentCard}>
          <h2 style={styles.sectionTitle}>Pembayaran QRIS</h2>

<div style={styles.qrisBox}>
  <img
    src="/qris/qris_medivault.png"
    alt="QRIS Pembayaran"
    style={styles.qrisImage}
  />

  <h2 style={styles.totalPrice}>
    {selectedPackage.price}
  </h2>

  <p style={styles.qrisText}>
    Scan QRIS sesuai nominal pembayaran
  </p>

  <div style={styles.receiverBox}>
    <span style={styles.receiverLabel}>Pembayaran ke</span>

    <strong style={styles.receiverName}>
      Medivault Exam
    </strong>

    <span style={styles.receiverOwner}>
      a.n. Heartspace
    </span>
  </div>
</div>

<p style={styles.instruction}>
Silakan lakukan pembayaran melalui QRIS sesuai nominal yang tertera. Setelah pembayaran berhasil, klik tombol "Saya Sudah Bayar" untuk mengirim permintaan verifikasi.
</p>

<div style={styles.invoiceBox}>
  <div style={styles.invoiceRow}>
    <span>Paket</span>
    <strong>{selectedPackage.name}</strong>
  </div>

  <div style={styles.invoiceRow}>
    <span>Token</span>
    <strong>{selectedPackage.token}</strong>
  </div>

  <hr style={styles.divider} />

  <div style={styles.totalRow}>
    <span>TOTAL</span>
    <strong>{selectedPackage.price}</strong>
  </div>
</div>

{paymentStatus !== "pending" ? (
  <button onClick={confirmPayment} style={styles.payButton}>
    Saya Sudah Bayar
  </button>
) : (
  <div style={styles.successBox}>
    <strong>Menunggu Verifikasi</strong>
    <p>

Pembayaran kamu sedang diproses. Silakan tunggu verifikasi dari admin.

Estimasi 5–30 menit.</p>

    <button
      onClick={() => (window.location.href = "/dashboard")}
      style={styles.dashboardButton}
    >
      Lihat Dashboard
    </button>
  </div>
)}
          </div>
        </div>
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
  padding: "50px 40px 90px",
},
  header: {
    maxWidth: "760px",
    margin: "0 auto 28px",
    textAlign: "center",
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
    lineHeight: 1.7,
  },
  tokenStatus: {
  maxWidth: "1100px",
  margin: "0 auto 24px",
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: "24px",
  padding: "20px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#061B3A",
  boxShadow: "0 14px 40px rgba(6,27,58,.06)",
},
  layout: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "28px",
  },
  packageSection: {
    background: "white",
    border: "1px solid #e5eaf2",
    borderRadius: "26px",
    padding: "28px",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
  },
  sectionTitle: {
    color: "#061b3a",
    fontSize: "24px",
    marginBottom: "20px",
  },
  packageList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  packageCard: {
    width: "100%",
    padding: "22px",
    borderRadius: "20px",
    border: "1px solid #e5eaf2",
    background: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    textAlign: "left",
  },
  packageCardActive: {
  border: "2px solid #234F42",
  background: "#EEF6F3",
},
  packageName: {
    color: "#061b3a",
    fontSize: "19px",
    marginBottom: "6px",
  },
  packageDesc: {
    color: "#64748b",
    margin: 0,
  },
  packageRight: {
    textAlign: "right",
  },
  packagePrice: {
    display: "block",
    color: "#061b3a",
    fontSize: "20px",
    marginBottom: "6px",
  },
  packageToken: {
  color: "#234F42",
  fontWeight: 800,
},
  paymentCard: {
    background: "white",
    border: "1px solid #e5eaf2",
    borderRadius: "26px",
    padding: "28px",
    boxShadow: "0 18px 45px rgba(15, 23, 42, 0.06)",
    height: "fit-content",
  },
  qrisBox: {
    border: "1px dashed #cbd5e1",
    borderRadius: "22px",
    padding: "24px",
    textAlign: "center",
    background: "#f8fafc",
  },
  qrisImage: {
  width: "220px",
  height: "220px",
  objectFit: "contain",
  display: "block",
  margin: "0 auto",
},
totalPrice: {
  marginTop: "18px",
  marginBottom: "8px",
  fontSize: "34px",
  fontWeight: 900,
  color: "#061B3A",
},
receiverBox: {
  marginTop: "18px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
},
receiverLabel: {
  color: "#64748B",
  fontSize: "14px",
},
receiverName: {
  fontSize: "18px",
  color: "#061B3A",
},
receiverOwner: {
  color: "#64748B",
  fontSize: "14px",
},
instruction: {
  marginTop: "14px",
  color: "#64748B",
  fontSize: "13px",
  lineHeight: 1.6,
},
divider: {
  border: "none",
  borderTop: "1px solid #E2E8F0",
  margin: "8px 0",
},
totalRow: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 0",
  borderTop: "2px solid #E2E8F0",
  fontSize: "24px",
  fontWeight: 900,
  color: "#061B3A",
},
  qrisText: {
    color: "#64748b",
    fontWeight: 800,
    marginTop: "14px",
  },
  invoiceBox: {
    marginTop: "24px",
    borderTop: "1px solid #e5eaf2",
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  invoiceRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#334155",
  },
  payButton: {
  width: "100%",
  marginTop: "24px",
  padding: "16px 20px",
  borderRadius: "16px",
  border: "none",
  background:
    "linear-gradient(135deg,#061B3A 0%,#234F42 100%)",
  color: "#FFFFFF",
  fontWeight: 900,
  cursor: "pointer",
  boxShadow: "0 16px 40px rgba(6,27,58,.18)",
},
  successBox: {
  marginTop: "24px",
  padding: "20px",
  borderRadius: "18px",
  background: "#EEF6F3",
  border: "1px solid #DCE5E0",
  color: "#234F42",
},
  dashboardButton: {
  width: "100%",
  marginTop: "16px",
  padding: "14px 18px",
  borderRadius: "14px",
  border: "none",
  background:
    "linear-gradient(135deg,#061B3A 0%,#234F42 100%)",
  color: "#FFFFFF",
  fontWeight: 900,
  cursor: "pointer",
},
};
