"use client";

import Link from "next/link";

export default function DeactivatedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100 dark:border-gray-800 dark:bg-gray-900 text-center">
        {/* Warning Icon Badge */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Account Deactivated
        </h1>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          Your account is currently inactive or awaiting administrator approval. You cannot access the Ledgerly dashboard at this time.
        </p>

        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-4 border border-amber-200 dark:border-amber-900/50 mb-6 text-left">
          <h2 className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
            Need Help?
          </h2>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Please contact your system administrator or team owner to reactivate your access.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
