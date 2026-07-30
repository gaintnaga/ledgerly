"use client";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export default function LoadingSpinner({
  label = "Loading data...",
  size = "md",
  fullPage = false,
}: LoadingSpinnerProps) {
  const spinnerSizes =
    size === "sm"
      ? "h-5 w-5 border-2"
      : size === "lg"
      ? "h-12 w-12 border-4"
      : "h-8 w-8 border-3";

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <div
        className={`${spinnerSizes} animate-spin rounded-full border-indigo-600 border-t-transparent dark:border-indigo-400 dark:border-t-transparent`}
      />
      {label && (
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 animate-pulse">
      <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-800" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div
              key={j}
              className="h-8 flex-1 rounded-md bg-gray-100 dark:bg-gray-800/60"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
