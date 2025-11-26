"use client";

import XTerm from "@/components/XTerm";
import { useToken } from "@/components/auth/TokenProvider";
import { useEffect, useState } from "react";

const decodeJwt = (jwt: string) => {
  try {
    // Split the JWT
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format - expected 3 parts, got:", parts.length);
      return null;
    }

    let base64Payload = parts[1];
    
    // Convert URL-safe base64 to standard base64
    // Replace URL-safe characters: - becomes +, _ becomes /
    base64Payload = base64Payload.replace(/-/g, "+").replace(/_/g, "/");
    
    // Add padding if needed
    // Base64 strings should be divisible by 4
    const padding = base64Payload.length % 4;
    if (padding > 0) {
      base64Payload += "=".repeat(4 - padding);
    }
    
    // Decode and parse
    const decoded = JSON.parse(atob(base64Payload));
    console.log("Successfully decoded JWT payload:", decoded);
    return decoded;
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    console.error("Token preview:", jwt?.substring(0, 50) + "...");
    return null;
  }
};

export default function Page() {
  const token = useToken();
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!token || !isMounted) return;

    console.log("Processing token...");
    
    // Save token
    localStorage.setItem("authToken", token);

    // Decode token to get userId
    const payload = decodeJwt(token);
    
    if (!payload) {
      console.error("Failed to decode token payload");
      setIsTokenReady(true);
      return;
    }

    // Try multiple possible userId fields
    const userId = payload?.sub || 
                   payload?.userId || 
                   payload?.id || 
                   payload?.user_id ||
                   payload?.uid;

    console.log("Full payload:", payload);
    console.log("Extracted user id:", userId);
    
    if (userId) {
      console.log("User id found, saving to localStorage");
      localStorage.setItem("userId", String(userId));
      
      // Verify it was saved
      const saved = localStorage.getItem("userId");
      console.log("Verified saved userId:", saved);
    } else {
      console.error("No userId found in token payload. Available fields:", Object.keys(payload));
    }

    // Mark token as ready
    setIsTokenReady(true);
  }, [token, isMounted]);

  if (!isMounted || !token || !isTokenReady) {
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