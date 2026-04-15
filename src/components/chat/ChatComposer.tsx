"use client";

type ChatComposerProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  sending?: boolean;
};

export function ChatComposer({
  value,
  onChange,
  onSubmit,
  disabled,
  sending,
}: ChatComposerProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && !sending && value.trim()) onSubmit();
    }
  }

  return (
    <div className="border-t border-[#1e2a1c]/10 bg-[#fdfcfa]/95 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-3xl gap-3">
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <textarea
          id="chat-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          disabled={disabled || sending}
          className="max-h-40 min-h-[44px] flex-1 resize-y rounded-2xl border border-[#1e2a1c]/20 bg-white px-4 py-3 text-sm text-[#1e2a1c] shadow-inner outline-none placeholder:text-[#1e2a1c]/40 focus:border-[#2d3a2a] disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || sending || !value.trim()}
          className="shrink-0 rounded-full bg-[#2d3a2a] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1e2a1c] disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-[#1e2a1c]/45">
        This is a supportive companion, not a substitute for professional care.
      </p>
    </div>
  );
}
