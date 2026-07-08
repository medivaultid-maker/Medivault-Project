export default function Dashboard() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] flex">

      {/* Sidebar */}
      <aside className="w-72 bg-[#0F172A] text-white p-8">

        <h1 className="text-3xl font-bold text-emerald-400 mb-12">
          Medivault
        </h1>

        <nav className="flex flex-col gap-5 text-lg">

          <button className="text-left hover:text-emerald-400 transition">
            Dashboard
          </button>

          <button className="text-left hover:text-emerald-400 transition">
            Exam Center
          </button>

          <button className="text-left hover:text-emerald-400 transition">
            Result & Review
          </button>

          <button className="text-left hover:text-emerald-400 transition">
            Token Center
          </button>

          <button className="text-left hover:text-red-400 transition mt-10">
            Logout
          </button>

        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-10">

        <h2 className="text-4xl font-bold mb-8">
          Dashboard
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              Jumlah Akses
            </h3>

            <p className="text-5xl font-bold text-emerald-500">
              5
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              CBT Selesai
            </h3>

            <p className="text-5xl font-bold text-navy-900">
              12
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-semibold mb-2">
              Nilai Tertinggi
            </h3>

            <p className="text-5xl font-bold text-emerald-500">
              89
            </p>
          </div>

        </div>

        {/* Recent Exams */}
        <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm">

          <h3 className="text-2xl font-semibold mb-5">
            Riwayat CBT
          </h3>

          <div className="flex justify-between border-b py-4">
            <p>CBT Anatomi Teori</p>
            <p className="font-semibold">82</p>
          </div>

          <div className="flex justify-between border-b py-4">
            <p>CBT Histologi Praktikum</p>
            <p className="font-semibold">78</p>
          </div>

        </div>

      </section>

    </main>
  );
}