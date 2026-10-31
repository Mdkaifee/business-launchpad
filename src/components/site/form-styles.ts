export const fieldClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition duration-200 focus:border-emerald focus:ring-4 focus:ring-emerald/15 focus:outline-none";

export const labelClass = "block text-[11px] font-bold tracking-[0.14em] text-foreground uppercase";

export const primaryButtonClass =
  "group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald px-7 text-sm font-semibold text-accent-foreground shadow-glow transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-deep disabled:pointer-events-none disabled:opacity-60";

/** Off-screen honeypot field; bots fill it, people never see it. */
export const honeypotClass = "absolute -left-[9999px] h-px w-px overflow-hidden";
