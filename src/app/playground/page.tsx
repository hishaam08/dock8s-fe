"use client";

import XTerm from "@/components/XTerm";
import { useToken } from "@/components/auth/TokenProvider";

export default function Page() {
  const token = useToken();
  console.log(token + "token");

  return (
    <div className="h-dvh bg-[#44444E] text-white p-1.5">
      <div className="h-full flex flex-col">
        <XTerm />
      </div>
    </div>
  );
}
