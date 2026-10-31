import { cn } from "@/lib/utils";

/** The "AA" globe logo, cropped from the brand artwork, shown on its own dark tile. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex size-11 shrink-0 overflow-hidden rounded-xl bg-ink ring-1 ring-ink-border",
        className,
      )}
    >
      <img
        src="/brand/logo-mark.png"
        alt="aliyaabdullah.com logo"
        width={512}
        height={512}
        className="size-full object-cover"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

export function Wordmark({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "text-lg font-semibold tracking-tight sm:text-xl",
          tone === "light" ? "text-ink-foreground" : "text-foreground",
        )}
      >
        aliya<span className="text-emerald">abdullah</span>
        <span className={tone === "light" ? "text-ink-muted" : "text-muted-foreground"}>.com</span>
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
