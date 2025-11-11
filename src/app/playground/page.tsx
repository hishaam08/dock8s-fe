"use client";

import XTerm from "@/components/terminal";

export default function Page() {
  return (
    <div className="h-screen bg-linear-to-r from-slate-900 to-slate-700 text-white p-3">
      <div className="h-full flex flex-col">
        <XTerm />
      </div>
    </div>
  );
}
