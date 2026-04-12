import Link from "next/link";
import { LoginForm } from "@/components/login/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#1e2a1c] text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between rounded-b-3xl bg-[#2d3a2a] px-6 py-4 shadow-lg">
        <Link href="/" className="font-serif text-xl tracking-tight text-white">
          <span className="relative inline-block">
            <span
              className="absolute -left-1 -top-2 text-[10px] opacity-80"
              aria-hidden
            >
              ☁
            </span>
            serenemind
          </span>
        </Link>
        <nav className="hidden gap-6 text-sm text-white/90 md:flex">
          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <span className="cursor-default opacity-60">Support</span>
          <span className="cursor-default opacity-60">Journaling</span>
        </nav>
        <Link
          href="/signup"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#1a2218]"
        >
          Get Support Now
        </Link>
      </header>

      <main className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl flex-col gap-10 px-6 py-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="relative z-10 flex-1 lg:max-w-md">
          <p className="mb-2 text-sm text-white/70">
            Welcome back. Sign in to continue your SereneMind journey.
          </p>
          <h1 className="mb-6 font-serif text-3xl font-normal text-white md:text-4xl">
            Sign in
          </h1>
          <LoginForm />
        </div>

        <div className="relative hidden flex-1 lg:block">
          <div
            className="relative min-h-[420px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#3d4a38] to-[#1e2a1c] shadow-2xl"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2240%22%20height=%2240%22%20viewBox=%220%200%2040%2040%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.04%22%3E%3Cpath%20d=%22M0%2038h2v2H0zm38%200h2v2h-2zM0%200h2v2H0zm38%200h2v2h-2z%22/%3E%3C/g%3E%3C/svg%3E')]" />
            <div className="relative flex h-full flex-col justify-end p-8">
              <p className="mb-2 text-xs uppercase tracking-widest text-white/50">
                SereneMind
              </p>
              <p className="max-w-sm text-lg leading-relaxed text-white/90">
                Your data stays protected with secure sign-in and encrypted
                sessions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
