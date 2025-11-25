"use client";

import XTerm from "@/components/XTerm";
import { useToken } from "@/components/auth/TokenProvider";
import { useEffect, useState } from "react"; 

const decodeJwt = (jwt: string) => {
  try {
    const base64Payload = jwt.split(".")[1];
    const decoded = JSON.parse(atob(base64Payload));
    return decoded;
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
};

export default function Page() {
  const token = useToken();
  const [isTokenReady, setIsTokenReady] = useState(false);

  useEffect(() => {
    if (!token) return;

    // Save token
    localStorage.setItem("authToken", token);

    // Decode token to get userId
    const payload = decodeJwt(token);
    const userId = payload?.sub || payload?.userId || payload?.id;

    if (userId) {
      localStorage.setItem("userId", userId);
    }

    // Mark token as ready
    setIsTokenReady(true);
  }, [token]);

  if (!token || !isTokenReady) {
    return (
      <div className="h-dvh bg-[#202324] text-white flex items-center justify-center">
        <div className="text-center">
          {/* <p className="text-gray-400">Initializing session...</p> */}
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-[#202324] text-white p-1.5">
      <div className="h-full flex flex-col">
        <XTerm />
      </div>
    </div>
  );
}