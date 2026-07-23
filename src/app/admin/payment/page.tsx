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
  const { data, error } = await supabase
    .from("payment_requests")
    .select("*")
    .order("created_at", { ascending: false });


  console.log("PAYMENT:", data);
  console.log("ERROR:", error);


  if (error) {
    alert(error.message);
    return;
  }


  if (!data) return;


  const userIds = data.map((item) => item.user_id);


  const { data: profiles, error: profileError } = await supabase
  .from("profiles")
  .select("*")
  .in("id", userIds);

console.log("CEK PROFILE:", profiles);
console.log("PROFILE ERROR:", profileError);


  const merged = data.map((payment) => ({
    ...payment,
    profiles: profiles?.find(
      (profile) => profile.id === payment.user_id
    ),
  }));


  console.log("FINAL DATA:", JSON.stringify(merged, null, 2));


  setPayments(merged);
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

      <div className="mx-auto max-w-7xl px-6 py-10">

        <h1 className="mb-8 font-poppins text-4xl font-extrabold text-[#061B3A]">
  Verifikasi Pembayaran
</h1>

<p className="mb-8 text-slate-500">
  Kelola seluruh permintaan pembelian token dari pengguna.
</p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-100">
  <tr>
    <th className="px-4 py-3 text-left">No</th>
    <th className="px-4 py-3 text-left">Tanggal Pembayaran</th>
    <th className="px-4 py-3 text-left">Nama User</th>
    <th className="px-4 py-3 text-left">Paket</th>
    <th className="px-4 py-3 text-left">Nominal</th>
    <th className="px-4 py-3 text-center">Token</th>
    <th className="px-4 py-3 text-center">Status</th>
    <th className="px-4 py-3 text-center">Aksi</th>
  </tr>
</thead>

      <tbody>
        {payments.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="py-10 text-center text-slate-500"
            >
              Belum ada permintaan pembayaran.
            </td>
          </tr>
        ) : (
          payments.map((item, index) => (
            <tr
              key={item.id}
              className="border-t border-slate-200 hover:bg-slate-50 transition"
            >
              <td className="px-4 py-3">
  {index + 1}
</td>

<td className="px-4 py-3">
  {new Date(item.created_at).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>

              <td className="px-5 py-4 font-semibold text-[#061B3A]">
  {item.profiles?.full_name || "-"}
</td>

<td className="px-5 py-4">
  {item.package_name}
</td>
              <td className="px-5 py-4">
                Rp {item.amount.toLocaleString("id-ID")}
              </td>

              <td className="px-5 py-4 text-center font-semibold">
                {item.token}
              </td>

              <td className="px-5 py-4 text-center">
                {item.status === "pending" ? (
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                    Pending
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Verified
                  </span>
                )}
              </td>

              <td className="px-5 py-4 text-center">
                {item.status === "pending" ? (
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
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700"
                  >
                    Verifikasi
                  </button>
                ) : (
                  <span className="text-slate-400">
                    —
                  </span>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </main>
  );
}