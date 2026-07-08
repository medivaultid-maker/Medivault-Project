"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { supabase } from "../../lib/supabase";

export default function PaymentPage() {
  const [payments, setPayments] = useState<any[]>([]);

 useEffect(() => {
  checkAdmin();
}, []);

async function checkAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/login";
    return;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    window.location.href = "/";
    return;
  }

  loadPayments();
}
  async function loadPayments() {
  const { data } = await supabase
    .from("payment_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (data) {
    setPayments(data);
  }
}

async function approve(payment: any) {
  const { error } = await supabase.rpc("approve_payment", {
    payment_id: payment.id,
  });

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  alert("Pembayaran berhasil diverifikasi.");

  loadPayments();
}

  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />

      <div className="max-w-5xl mx-auto py-10">

        <h1 className="text-3xl font-bold mb-8">
          Verifikasi Pembayaran
        </h1>

        {payments.length === 0 ? (
          <p>Tidak ada pembayaran.</p>
        ) : (
          payments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 shadow mb-5"
            >
              <h2 className="font-bold text-xl">
                {item.package_name}
              </h2>

              <p>Nominal : Rp {item.amount.toLocaleString()}</p>

              <p>Token : {item.token}</p>

              <p>Status : {item.status}</p>

              <button
                onClick={() => {
  if (
    confirm(
      "Yakin ingin memverifikasi pembayaran ini?"
    )
  ) {
    approve(item);
  }
}}
                className="mt-5 px-5 py-3 rounded-lg bg-green-600 text-white"
              >
                Verifikasi
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}