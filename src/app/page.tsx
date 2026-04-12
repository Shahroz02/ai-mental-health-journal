import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#9cb09d]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
        <p className="mb-4 w-full pl-[20px] text-center text-sm font-medium uppercase tracking-[0.2em] text-[#2d3a2a]/80">
          SereneMind
        </p>
        <div className="mb-6 flex items-center justify-center gap-2 text-center">
          <span className="text-2xl" aria-hidden>
            🌿
          </span>
          <h1 className="font-serif text-3xl font-normal leading-tight text-[#1e2a1c] md:text-4xl">
            Start Your AI
            <br />
            Support Journey
          </h1>
        </div>
        <p className="mb-10 max-w-lg self-center text-center text-[#1e2a1c]/85">
          An AI-powered space for empathetic conversations, journaling, and
          emotional wellbeing. 
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-[#1a2218] px-8 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-black/90"
          >
            Start Chat Session
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-[#1e2a1c]/30 bg-white/40 px-6 py-3 text-sm font-medium text-[#1e2a1c] backdrop-blur-sm hover:bg-white/60"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
