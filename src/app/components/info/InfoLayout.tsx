"use client";

import Navbar from "../Navbar";
import ReadingProgress from "./ReadingProgress";

type InfoLayoutProps = {
  children: React.ReactNode;
};

export default function InfoLayout({
  children,
}: InfoLayoutProps) {
  return (
    <>
      <ReadingProgress />

      <Navbar />

      <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#EEF6F3_0%,#F8FAFC_35%,#FFFFFF_100%)]">

        {/* Background Blur */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#234F42]/10 blur-3xl" />

        <div className="pointer-events-none absolute top-40 right-0 h-96 w-96 rounded-full bg-[#0F766E]/10 blur-3xl" />

        <div className="relative">

          {children}

        </div>

      </main>
    </>
  );
}