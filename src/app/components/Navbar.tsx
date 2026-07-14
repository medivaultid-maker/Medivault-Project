"use client";

import { supabase } from "../lib/supabase";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LogOut,
  UserCircle,
  Stethoscope,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";

type UserRole = "admin" | "user" | string | null;

type NavItem = {
  label: string;
  href: string;
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  
useEffect(() => {
  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
  setIsLoggedIn(true);
  setEmail(user.email || "");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  setRole(profile?.role || "user");
} else {
  setIsLoggedIn(false);
  setRole(null);
}
  };

  loadUser();

  const handleScroll = () => {
    setScrolled(window.scrollY > 18);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

  const goToLogin = () => {
    window.location.href = "/login";
  };

  const goToRegister = () => {
    window.location.href = "/register";
  };

  const logout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/";
};

  const publicLinks: NavItem[] = [
    { label: "Beranda", href: "/" },
    { label: "Fitur", href: "/#fitur" },
    { label: "Simulasi", href: "/simulasi" },
    { label: "Akses Latihan", href: "/token" },
  ];

  const adminLinks: NavItem[] = [
    { label: "Admin Panel", href: "/admin" },
    { label: "Upload Soal", href: "/admin/paket" },
    { label: "Paket Soal", href: "/admin/daftar-paket" },
  ];

  const links: NavItem[] =
  role === "admin"
    ? [{ label: "Dashboard Admin", href: "/admin" }]
    : isLoggedIn
    ? [
        { label: "Dashboard Belajar", href: "/dashboard" },
        { label: "Simulasi", href: "/simulasi" },
        { label: "Akses Latihan", href: "/token" },
      ]
    : publicLinks;

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55 }}
      className={`sticky top-0 z-[9999] w-full border-b backdrop-blur-2xl transition-all duration-300 ${
        scrolled
          ? "border-slate-200/70 bg-white/90 shadow-[0_14px_45px_rgba(6,27,58,0.08)]"
          : "border-white/60 bg-white/60"
      }`}
    >
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-5 px-6 md:px-10">
        {/* BRAND */}
        <Link
          href={role === "admin" ? "/admin" : "/"}
          className="group flex items-center gap-3 no-underline"
          onClick={() => setOpen(false)}
        >
          <img
  src="/LOGO_MEDIVAULT.png"
  alt="Medivault"
  className="h-18 w-18 object-contain transition group-hover:-translate-y-0.5"
/>

          <div className="flex flex-col leading-none">
            <span className="text-[19px] font-black tracking-[-0.04em] text-[#061B3A]">
              Medivault
            </span>
            <span className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0F766E]">
              Exam
            </span>
          </div>
        </Link>

        {/* DESKTOP MENU */}
        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-[#ECFDF5] hover:text-[#0F766E]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="hidden items-center gap-3 lg:flex">
          {!role ? (
            <>
              <button
                type="button"
                onClick={goToLogin}
                className="rounded-2xl border border-slate-200 bg-white/75 px-5 py-2.5 text-sm font-extrabold text-[#061B3A] shadow-sm backdrop-blur transition hover:border-[#0F766E]/30 hover:bg-[#ECFDF5]"
              >
                Login
              </button>

              <button
                type="button"
                onClick={goToRegister}
                className="rounded-2xl bg-gradient-to-r from-[#061B3A] to-[#0F766E] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(6,27,58,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(15,118,110,0.24)]"
              >
                Daftar
              </button>
            </>
          ) : (
            <>
              <div className="flex max-w-[210px] items-center gap-2 rounded-2xl border border-slate-200 bg-white/70 px-3 py-2 shadow-sm">
                <UserCircle size={18} className="shrink-0 text-[#0F766E]" />
                <span className="truncate text-xs font-extrabold text-slate-500">
                  {email || role}
                </span>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#061B3A] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(6,27,58,0.16)] transition hover:bg-[#0F766E]"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-[#061B3A] shadow-sm backdrop-blur transition hover:bg-[#ECFDF5] lg:hidden"
          aria-label="Toggle navigation menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* PREMIUM LINE */}
      <div
        className={`h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="border-t border-slate-100 bg-white/95 px-6 pb-6 pt-3 shadow-[0_18px_45px_rgba(6,27,58,0.08)] backdrop-blur-2xl lg:hidden"
          >
            <div className="space-y-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-4 text-sm font-extrabold text-slate-700 transition hover:bg-[#ECFDF5] hover:text-[#0F766E]"
                >
                  <span>{item.label}</span>
                  {item.label === "Dashboard" ||
                  item.label === "Admin Panel" ? (
                    <LayoutDashboard size={17} />
                  ) : (
                    <ShieldCheck size={17} />
                  )}
                </Link>
              ))}
            </div>

            <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5">
              {!role ? (
                <>
                  <button
                    type="button"
                    onClick={goToLogin}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-extrabold text-[#061B3A] shadow-sm transition hover:bg-[#ECFDF5]"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={goToRegister}
                    className="w-full rounded-2xl bg-gradient-to-r from-[#061B3A] to-[#0F766E] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_14px_28px_rgba(6,27,58,0.18)] transition hover:-translate-y-0.5"
                  >
                    Daftar
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
                    <UserCircle size={18} className="shrink-0 text-[#0F766E]" />
                    <span className="break-all text-sm font-extrabold text-slate-500">
                      {email || role}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={logout}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#061B3A] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_12px_24px_rgba(6,27,58,0.16)] transition hover:bg-[#0F766E]"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
