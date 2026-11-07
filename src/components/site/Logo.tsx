import { cn } from "@/lib/utils";

/** The "AA" globe logo with its dark backdrop removed, so it sits on any surface. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-12 shrink-0", className)}>
      <img
        src="/brand/logo-mark-clear.png"
        alt="Aliya Abdullah logo"
        width={512}
        height={512}
        className="size-full object-contain drop-shadow-[0_4px_14px_color-mix(in_oklab,var(--emerald)_45%,transparent)]"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

export function Wordmark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className="text-lg font-extrabold tracking-tight sm:text-xl">
        <span className={tone === "light" ? "text-silver" : "text-foreground"}>Aliya</span>{" "}
        <span className={tone === "light" ? "text-emerald-light" : "text-emerald"}>Abdullah</span>
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
