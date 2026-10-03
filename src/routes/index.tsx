import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { LAUNCH_DATE, getTimeLeft, pad, type TimeLeft } from "@/lib/countdown";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hoarding board reads as one poster panel: a single centred column that keeps
// its left-aligned signage grid at every width.
const SHELL = "mx-auto w-full max-w-[820px] px-6 md:px-10";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kestrel Co. — Something big is building" },
      {
        name: "description",
        content:
          "Kestrel Co. is a single home for consulting, trading and services. The site is under construction — leave your email and we'll send you the opening date.",
      },
      { property: "og:title", content: "Kestrel Co. — Something big is building" },
      {
        property: "og:description",
        content:
          "A single home for consulting, trading and services — opening soon. Leave your email for the opening date.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HoardingPage,
});

function HoardingPage() {
  const [left, setLeft] = useState<TimeLeft | null>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "invalid" | "done">("idle");

  useEffect(() => {
    const tick = () => setLeft(getTimeLeft(LAUNCH_DATE, new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus("invalid");
      return;
    }
    setStatus("done");
  }

  const tiles = [
    { label: "Days", value: left ? pad(left.days) : "––", signal: false },
    { label: "Hrs", value: left ? pad(left.hours) : "––", signal: false },
    { label: "Min", value: left ? pad(left.minutes) : "––", signal: false },
    { label: "Sec", value: left ? pad(left.seconds) : "––", signal: true },
  ];

  return (
    <div className="bg-paper text-hoarding font-body flex min-h-dvh w-full flex-col antialiased">
      {/* brand mark */}
      <header className={`rise flex items-center gap-3 pt-7 ${SHELL}`}>
        <span className="bg-hoarding grid size-7 place-items-center rounded-[6px]">
          <span className="bg-signal block size-2.5 rounded-[2px]" />
        </span>
        <span className="text-[13px] font-semibold tracking-[0.22em] uppercase">
          Kestrel&nbsp;Co.
        </span>
      </header>

      {/* caution stripe */}
      <div className="hazard rise mt-6 h-3 w-full" />

      {/* hoarding headline */}
      <main className={`pt-10 ${SHELL}`}>
        <p className="rise text-hoarding/55 text-[11px] font-medium tracking-[0.32em] uppercase [animation-delay:60ms]">
          Under construction
        </p>
        <h1 className="rise text-hoarding font-display mt-3 max-w-[20ch] text-balance text-[clamp(3.25rem,19vw,5.75rem)] leading-[0.95] [animation-delay:120ms] md:text-[clamp(4.5rem,8vw,7rem)] md:leading-[0.92]">
          Something
          <br />
          big is
          <br />
          <span className="text-signal">building</span>
        </h1>
        <p className="rise text-hoarding/70 mt-5 max-w-[42ch] text-pretty text-base leading-relaxed [animation-delay:180ms]">
          A single home for consulting, trading and services — opening soon.
        </p>
      </main>

      {/* countdown tiles */}
      <section className={`rise mt-10 [animation-delay:240ms] ${SHELL}`}>
        <p className="text-hoarding/50 mb-4 text-[10px] font-medium tracking-[0.3em] uppercase">
          {left?.open ? "Now open" : "Opens in"}
        </p>
        <div className="grid grid-cols-4 gap-2.5">
          {tiles.map((tile, index) => (
            <div
              key={tile.label}
              className={
                tile.signal
                  ? "bg-signal ring-tile-edge rounded-[10px] px-2 py-3 text-center ring-1"
                  : "bg-hoarding ring-tile-edge rounded-[10px] px-2 py-3 text-center ring-1"
              }
            >
              <span
                className={`font-display tick block text-[clamp(1.9rem,9vw,2.6rem)] leading-none md:text-[3.1rem] ${
                  tile.signal ? "text-hoarding" : "text-paper"
                }`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {tile.value}
              </span>
              <span
                className={`mt-2 block text-[9px] font-medium tracking-[0.18em] uppercase ${
                  tile.signal ? "text-hoarding/70" : "text-paper/60"
                }`}
              >
                {tile.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* email capture */}
      <section className={`rise mt-10 [animation-delay:300ms] ${SHELL}`}>
        <label
          htmlFor="notify-email"
          className="text-hoarding/55 mb-2 block text-[11px] font-medium tracking-[0.24em] uppercase"
        >
          Get the opening date
        </label>
        <form onSubmit={handleSubmit} noValidate>
          <div className="flex items-center gap-2">
            <input
              id="notify-email"
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="you@company.com"
              autoComplete="email"
              className="bg-paper text-hoarding ring-border placeholder:text-hoarding/40 focus:ring-signal h-11 min-w-0 flex-1 rounded-[10px] px-3 text-sm ring-1 transition-shadow focus:ring-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-signal text-hoarding ring-border h-11 shrink-0 rounded-[10px] px-4 text-sm font-semibold ring-1 transition-[filter,transform] active:brightness-95 active:translate-y-px"
            >
              Notify me
            </button>
          </div>
        </form>
        {status === "done" ? (
          <p className="text-hoarding/70 mt-3 inline-flex items-center gap-2 text-sm font-medium">
            <span className="bg-signal text-hoarding grid size-4 place-items-center rounded-full text-[10px] font-bold">
              ✓
            </span>
            You're on the list — we'll email you at launch.
          </p>
        ) : null}
        {status === "invalid" ? (
          <p className="text-hoarding/70 mt-3 inline-flex items-center gap-2 text-sm font-medium">
            <span className="bg-signal text-hoarding grid size-4 place-items-center rounded-full text-[10px] font-bold">
              !
            </span>
            That email doesn't look right — try again.
          </p>
        ) : null}
      </section>

      {/* footer */}
      <footer className={`rise mt-auto py-8 [animation-delay:360ms] ${SHELL}`}>
        <div className="bg-hoarding/10 mb-6 h-px w-full" />
        <div className="flex items-center justify-between gap-4">
          <a
            href="mailto:hello@kestrel.co"
            className="text-hoarding decoration-signal text-sm font-medium underline decoration-2 underline-offset-4"
          >
            hello@kestrel.co
          </a>
          <div className="flex items-center gap-4 text-[13px] font-medium">
            <a href="#" className="text-hoarding/70 hover:text-signal transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-hoarding/70 hover:text-signal transition-colors">
              Instagram
            </a>
            <a href="#" className="text-hoarding/70 hover:text-signal transition-colors">
              X
            </a>
          </div>
        </div>
        <p className="text-hoarding/45 mt-4 text-[11px]">
          © 2026 Kestrel Co. — all rights reserved.
        </p>
      </footer>
    </div>
  );
}
