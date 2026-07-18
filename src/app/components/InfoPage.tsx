"use client";

import Navbar from "./Navbar";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function InfoPage({ title, children }: Props) {
  return (
    <>
      <Navbar />

      <main
        style={{
          background: "#f8fafc",
          minHeight: "100vh",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            background: "#fff",
            borderRadius: 20,
            padding: 40,
            boxShadow: "0 10px 30px rgba(0,0,0,.06)",
          }}
        >
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 30,
            }}
          >
            {title}
          </h1>

          <div
            style={{
              fontSize: 18,
              color: "#475569",
              lineHeight: 1.9,
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </>
  );
}