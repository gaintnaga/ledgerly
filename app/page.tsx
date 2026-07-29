import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-900 text-slate-100 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 font-bold text-white shadow-lg shadow-indigo-500/30 text-xl">
              L
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-200 bg-clip-text text-transparent">
              Ledgerly
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all hover:scale-105"
            >
              Go to Dashboard &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-28">
        <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-[120px]"></div>
        <div className="absolute top-1/3 left-1/3 -z-10 h-[400px] w-[400px] rounded-full bg-purple-600/20 blur-[100px]"></div>

        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md mb-6">
            ✨ Smart Financial & Inventory Management
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent leading-tight">
            Streamline Expenses, Split Bills & Manage Inventory Effortlessly
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed sm:text-xl">
            Ledgerly empowers teams and businesses to log purchases, track itemized receipts, split costs among members, and analyze financial reports in real-time.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-xl shadow-indigo-500/25 hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all"
            >
              Launch Dashboard
            </Link>
            <Link
              href="/login"
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-8 py-3.5 text-base font-semibold text-slate-200 hover:bg-slate-800 hover:text-white backdrop-blur-md transition-all"
            >
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="border-t border-slate-800/80 bg-slate-950/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Everything you need for bookkeeping</h2>
            <p className="mt-4 text-slate-400">Designed for modern workflows with powerful expense and stock tools.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 text-2xl">
                🛒
              </div>
              <h3 className="text-xl font-semibold text-white">Purchase Tracking</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Log itemized store purchases, attach digital receipts, and automatically aggregate expense categories.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 text-2xl">
                📦
              </div>
              <h3 className="text-xl font-semibold text-white">Inventory & Stock</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Keep stock counts up to date, monitor low inventory alerts, and organize items by customized categories.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-2xl">
                📈
              </div>
              <h3 className="text-xl font-semibold text-white">Financial Analytics</h3>
              <p className="mt-3 text-slate-400 text-sm leading-relaxed">
                Generate real-time analytics, participant expense shares, and export breakdown reports effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Ledgerly Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
