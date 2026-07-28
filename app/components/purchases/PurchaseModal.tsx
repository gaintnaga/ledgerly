"use client";

import { ReactNode } from "react";

interface PurchaseModelProps {
    open : boolean;
    title : string;
    onClose : () => void ;
    children : ReactNode;
}

export default function PurchaseModal ({
    open,
    title,
    onClose,
    children
}: PurchaseModelProps){
    if(!open) return null;

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-5xl rounded-xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-5">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="text-2xl"
          >
            ×
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}