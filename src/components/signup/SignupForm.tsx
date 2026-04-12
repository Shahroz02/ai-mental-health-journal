"use client";

import { useState } from "react";
import Link from "next/link";

const MIN_PASSWORD = 8;

function validateEmail(value: string): boolean {
  return /^\S+@\S+\.\S+$/.test(value.trim());
}

type FieldErrors = Partial<Record<"name" | "email" | "password", string>>;

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  function validateClient(): boolean {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else if (!validateEmail(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < MIN_PASSWORD) {
      next.password = `Password must be at least ${MIN_PASSWORD} characters.`;
    }
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    if (!validateClient()) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        message?: string;
        fieldErrors?: Record<string, string[] | undefined>;
      };

      if (!res.ok) {
        setStatus("error");
        if (data.fieldErrors) {
          const fe: FieldErrors = {};
          if (data.fieldErrors.name?.[0]) fe.name = data.fieldErrors.name[0];
          if (data.fieldErrors.email?.[0]) fe.email = data.fieldErrors.email[0];
          if (data.fieldErrors.password?.[0])
            fe.password = data.fieldErrors.password[0];
          setFieldErrors(fe);
        }
        setMessage(data.error ?? "Registration failed. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Registration successful.");
      setName("");
      setEmail("");
      setPassword("");
      setFieldErrors({});
    } catch {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5"
      noValidate
    >
      {message && (
        <div
          role="alert"
          className={`rounded-2xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-700/40 bg-emerald-50 text-emerald-900"
              : "border-red-700/30 bg-red-50 text-red-900"
          }`}
        >
          {message}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-white/95"
        >
          Name<span className="text-red-200">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-white placeholder:text-white/50 outline-none ring-0 transition focus:border-white/40 focus:bg-white/20"
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && (
          <p id="name-error" className="mt-1 text-xs text-red-200">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-white/95"
        >
          Email<span className="text-red-200">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-white/20 bg-white/15 px-4 py-2.5 text-white placeholder:text-white/50 outline-none focus:border-white/40 focus:bg-white/20"
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email && (
          <p id="email-error" className="mt-1 text-xs text-red-200">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-sm font-medium text-white/95"
        >
          Password<span className="text-red-200">*</span>
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-white/20 bg-white/15 py-2.5 pl-4 pr-12 text-white placeholder:text-white/50 outline-none focus:border-white/40 focus:bg-white/20"
            aria-invalid={fieldErrors.password ? true : undefined}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p id="password-error" className="mt-1 text-xs text-red-200">
            {fieldErrors.password}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-xl bg-[#4a4a45] py-3 text-center text-sm font-medium text-white/95 transition hover:bg-[#5c5c56] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-white/80">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-white underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.274M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}
