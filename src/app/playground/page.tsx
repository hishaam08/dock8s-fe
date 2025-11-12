"use client";

import XTerm from "@/components/XTerm";

export default function Page() {
  return (
    <div className="h-screen bg-[#44444E] text-white p-1.5">
      <div className="h-full flex flex-col">
        <XTerm />
      </div>
    </div>
  );
}


