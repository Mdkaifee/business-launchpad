import { createFileRoute } from "@tanstack/react-router";

const SHELL = "mx-auto w-full max-w-[820px] px-6 md:px-10";
const TITLE = "Aliya Abdullah — Welcome, site under construction";
const DESC = "Welcome to aliyaabdullah.com. The site is under construction — check back soon.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WelcomePage,
});

function WelcomePage() {
  return (
    <div className="bg-paper text-hoarding font-body flex min-h-dvh w-full flex-col antialiased">
      <header className={`rise flex items-center gap-3 pt-7 ${SHELL}`}>
        <span className="bg-hoarding grid size-7 place-items-center rounded-[6px]">
          <span className="bg-signal block size-2.5 rounded-[2px]" />
        </span>
        <span className="text-[13px] font-semibold tracking-[0.22em] uppercase">
          aliyaabdullah.com
        </span>
      </header>

      <div className="hazard rise mt-6 h-3 w-full" />

      <main className={`my-auto py-16 ${SHELL}`}>
        <p className="rise text-hoarding/60 text-[11px] font-medium tracking-[0.32em] uppercase [animation-delay:60ms]">
          Under construction
        </p>
        <h1 className="rise font-display mt-3 text-[clamp(3.5rem,19vw,7rem)] leading-[1.1] [animation-delay:120ms]">
          <span className="text-signal">Welcome</span>
        </h1>
        <p className="rise text-hoarding/70 mt-5 max-w-[42ch] text-pretty text-base leading-relaxed [animation-delay:180ms]">
          This site is under construction. Please check back soon.
        </p>
      </main>

      <footer className={`rise py-8 [animation-delay:240ms] ${SHELL}`}>
        <div className="bg-hoarding/10 mb-4 h-px w-full" />
        <p className="text-hoarding/60 text-[11px]">© 2026 aliyaabdullah.com</p>
      </footer>
    </div>
  );
}
