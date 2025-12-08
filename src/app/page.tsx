import { auth } from "@/auth";
import InteractiveGridScript from "@/components/InteractiveGridScript";
import LenisProvider from "@/components/LenisProvider";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <LenisProvider>
      <InteractiveGridScript />
      <div className="interactive-grid"></div>

      <div className="relative min-h-screen w-full overflow-x-hidden text-zinc-800 font-sans">
        <main className="relative flex flex-col min-h-screen">
          <section className="relative flex flex-col justify-between md:max-h-screen px-6 mt-8 md:mt-0 md:px-12 md:pt-10">
            <div className="max-w-8xl w-full mx-auto">
              <div className="pointer-events-none absolute inset-x-0 top-10 flex justify-center -z-10">
                <div className="h-72 w-72 md:h-96 md:w-96 rounded-full bg-gradient-to-br from-blue-200/50 via-blue-100/20 to-transparent blur-3xl opacity-70" />
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/70 backdrop-blur-2xl px-6 py-12 shadow-[0_18px_60px_rgba(0,0,0,0.08)] md:px-10 md:py-14">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-zinc-300/60 to-transparent" />

                <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-4 sm:hidden">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Dock8s
                  </span>
                </h2>

                {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs text-zinc-600">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Isolated Docker environments in seconds</span>
                </div> */}

                <div className="sm:ml-5 mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs text-zinc-600">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-red-600" />
                  <span>
                    <b>Kubernetes playground coming soon</b>
                  </span>
                </div>

                <div className="grid gap-10 md:grid-cols-[1.6fr_1fr] md:items-center">
                  <div className="flex flex-col gap-6">
                    <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900">
                      Build, deploy & test{" "}
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                        containers instantly.
                      </span>
                    </h1>

                    <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
                      Dock8s gives every user an isolated Docker playground with
                      real containers, public URLs, secure networking, and zero
                      local setup. Run anything. Destroy anytime.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      {session ? (
                        <>
                          <Link
                            href="/playground"
                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-blue-700 transition"
                          >
                            Launch Playground
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/api/auth/signin"
                            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-blue-700 transition"
                          >
                            Get started
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Mini Stats */}
                    <div className="mt-3 flex flex-wrap gap-6 text-xs text-zinc-500">
                      <span>
                        <strong className="text-zinc-800">&lt;15s</strong>{" "}
                        environment creation
                      </span>
                      <span>
                        <strong className="text-zinc-800">Public URLs</strong>{" "}
                        for any port
                      </span>
                      <span>
                        <strong className="text-zinc-800">
                          Fully isolated
                        </strong>{" "}
                        sandboxes
                      </span>
                    </div>
                  </div>

                  <div className="relative flex flex-col">
                    {/* TOP LOGO */}
                    <h2 className="text-5xl font-bold tracking-tight text-zinc-900 mb-6 sm:block hidden">
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Dock8s
                      </span>
                    </h2>
                    <div className="relative">
                      <div className="absolute -inset-6 -z-10 bg-blue-200/40 blur-2xl opacity-70" />
                      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-lg backdrop-blur-xl">
                        {/* Bar */}
                        <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2 text-[11px] text-zinc-600">
                          <span className="flex gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
                          </span>
                          <span className="truncate">
                            dock8s-session-
                            {session
                              ? session.user?.email?.split("@")[0]
                              : "demo"}
                          </span>
                        </div>

                        <div className="px-4 py-3 text-xs font-mono leading-relaxed text-zinc-700">
                          <p className="text-zinc-400">
                            # your isolated Docker playground
                          </p>

                          <p className="mt-2">
                            $ <span className="text-blue-600">hostname</span>
                          </p>
                          <p className="text-emerald-600">
                            ✔ environment ready
                          </p>

                          <p className="mt-2">
                            $ <span className="text-blue-600">docker run</span>{" "}
                            -p 8080:8080 ghcr.io/you/api:latest
                          </p>

                          <p className="mt-2">
                            ${" "}
                            <span className="text-blue-600">
                              map your port to:
                            </span>{" "}
                            8080
                          </p>
                          <p className="text-emerald-600">
                            ✔ public URL: https://p8080.{`{user}`}.dock8s.in
                          </p>

                          <p className="mt-3 text-zinc-400">
                            # test, and tear down anytime
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex flex-col items-center gap-2 text-zinc-400 mb-10 mt-10">
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <div className="h-8 w-4 border border-zinc-300 rounded-full flex items-center justify-center">
                <div className="h-2 w-1 bg-zinc-400 rounded-full animate-bounce" />
              </div>
            </div>
          </section>

          <section
            id="how-it-works"
            className="relative flex items-center flex-col gap-5"
          >
            <div className="hidden md:flex max-w-[85%] relative w-full min-h-[75vh] md:min-h-screen items-center justify-center">
              <Image
                src="/terminal-communication.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>

            <div className="flex md:hidden w-[90%] relative min-h-full items-center justify-center">
              <Image
                src="/terminal-communication-mobile.svg"
                alt=""
                width={900}
                height={900}
                className="w-[90%] h-auto object-contain"
              />
            </div>

            <div className="hidden md:flex max-w-[85%] relative w-full min-h-[75vh] md:min-h-screen items-center justify-center">
              <Image
                src="/networking-flow.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>

            <div className="flex md:hidden pt-20 w-[90%] relative min-h-full items-center justify-center">
              <Image
                src="/networking-flow-mobile.svg"
                alt=""
                width={900}
                height={900}
                className="w-[90%] h-auto object-contain"
              />
            </div>

            <div
              id="architecture"
              className="hidden md:flex max-w-[55%] relative w-full min-h-[75vh] max-h-screen md:min-h-screen items-center justify-center"
            >
              <Image
                src="/container-management.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>

            <div className="flex md:hidden pt-20 w-[90%] pb-10 h-full relative min-h-full items-center justify-center">
              <Image
                src="/container-management-mobile.svg"
                alt=""
                width={900}
                height={900}
                className="w-[90%] h-auto object-contain"
              />
            </div>
          </section>
        </main>
      </div>
    </LenisProvider>
  );
}
