type ChatAvatarProps = {
  variant: "user" | "assistant";
  className?: string;
};

export function ChatAvatar({ variant, className = "" }: ChatAvatarProps) {
  if (variant === "user") {
    return (
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2d3a2a] text-xs font-semibold text-white ${className}`}
        aria-hidden
      >
        You
      </div>
    );
  }

  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2d3a2a]/25 bg-gradient-to-br from-[#e8efe8] to-white text-lg shadow-sm ${className}`}
      aria-hidden
    >
      <span role="img" aria-label="Support companion">
        🌿
      </span>
    </div>
  );
}
