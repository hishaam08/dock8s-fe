import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { TokenProvider } from "@/components/auth/TokenProvider";
import { redirect } from "next/navigation";
export default async function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const token = await getToken({
    req: {
      headers: Object.fromEntries(await headers()),
    },
    secret: process.env.AUTH_SECRET,
    raw: true,
    cookieName: "authjs.session-token",
  });

  return (
    <SessionProvider session={session}>
      <TokenProvider token={token}>{children}</TokenProvider>
    </SessionProvider>
  );
}
