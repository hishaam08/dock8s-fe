import { auth } from "@/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to Dock8s.
          </h1>

          {session ? (
            <div className="flex flex-col gap-4">
              <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
                Hello, {session.user?.name || session.user?.email}!
              </p>
              <p className="max-w-md text-base leading-7 text-zinc-500 dark:text-zinc-500">
                You are currently signed in.
              </p>
            </div>
          ) : (
            <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Sign in to access your account and get started.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          {session ? (
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="/playground"
            >
              Playground
            </a>
          ) : (
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
              href="/api/auth/signin"
            >
              Sign In
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
