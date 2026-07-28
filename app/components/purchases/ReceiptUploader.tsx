"use client";

import { useRef, useState } from "react";

interface ReceiptUploaderProps {
  value?: File | null;
  onChange: (file: File | null) => void;
}

export default function ReceiptUploader({
  value,
  onChange,
}: ReceiptUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    onChange(file);

    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    onChange(null);
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold">
        Receipt
      </label>

      <div
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-500"
      >
        <p className="text-sm text-gray-600">
          Click to upload receipt
        </p>

        <p className="mt-1 text-xs text-gray-400">
          JPG, PNG or PDF
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        hidden
        onChange={handleFileChange}
      />

      {value && (
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{value.name}</p>

              <p className="text-sm text-gray-500">
                {(value.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              type="button"
              onClick={removeFile}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Remove
            </button>
          </div>

          {preview && (
            <img
              src={preview}
              alt="Receipt Preview"
              className="mt-4 max-h-64 rounded border object-contain"
            />
          )}
        </div>
      )}
    </div>
  );
}