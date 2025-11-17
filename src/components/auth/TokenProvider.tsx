"use client";

import { createContext, useContext } from "react";

const TokenContext = createContext<{ token: string | null }>({ token: null });

export function TokenProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string | null;
}) {
  return (
    <TokenContext.Provider value={{ token }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("usePlaygroundToken must be used within PlaygroundProvider");
  }
  return context.token;
}