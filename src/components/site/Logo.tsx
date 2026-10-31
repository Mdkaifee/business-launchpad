import { useId } from "react";

import { cn } from "@/lib/utils";

/** Interlocking "AA" monogram for aliyaabdullah.com, gold strokes on an ink tile. */
export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  const gradientId = useId();
  const strokeClass = animated ? "logo-draw" : undefined;
  return (
    <svg viewBox="0 0 64 64" className={cn("size-11", className)} role="img" aria-label="aliyaabdullah.com">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--gold-light)" }} />
          <stop offset="55%" style={{ stopColor: "var(--gold)" }} />
          <stop offset="100%" style={{ stopColor: "var(--gold-deep)" }} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" className="fill-ink" />
      <rect
        x="1"
        y="1"
        width="62"
        height="62"
        rx="15"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      <path
        d="M13 47 L24.5 16 L36 47"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={strokeClass}
      />
      <path
        d="M28 47 L39.5 16 L51 47"
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={strokeClass}
        style={animated ? { animationDelay: "0.25s" } : undefined}
      />
      <path d="M18.5 37 H45.5" stroke={`url(#${gradientId})`} strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-serif text-xl font-semibold tracking-tight sm:text-2xl",
          tone === "light" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        aliyaabdullah<span className="text-gold-gradient">.com</span>
      </span>
      <span
        className={cn(
          "mt-1 text-[10px] font-semibold tracking-[0.28em] uppercase",
          tone === "light" ? "text-ink-muted" : "text-muted-foreground",
        )}
      >
        Trading · Contracting · IT
      </span>
    </span>
  );
}
