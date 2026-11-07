import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Cpu,
  HardHat,
  Mail,
  MapPin,
  Menu,
  Phone,
  Ship,
  X,
} from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { ContactForm } from "../components/site/ContactForm";
import { Counter } from "../components/site/Counter";
import {
  CASE_STUDIES,
  CONTACT_COUNTRY,
  CONTACT_EMAIL,
  CONTACT_LOCATIONS_LINE,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  SERVICE_VERTICALS,
  COMPANY_NAME_AR,
  SITE_NAME,
  SITE_TAGLINE,
  WHY_CHOOSE_US_POINTS,
  type ServiceCardData,
} from "../components/site/data";
import { primaryButtonClass } from "../components/site/form-styles";
import { LogoMark, Wordmark } from "../components/site/Logo";
import { EMPTY_QUOTE, QuoteForm, type QuoteFormValues } from "../components/site/QuoteForm";
import { useReveal } from "../hooks/use-reveal";
import { cn } from "../lib/utils";

const SHELL = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const PAGE_TITLE = "aliyaabdullah.com | Trading, Contracting & IT Services";
const PAGE_DESCRIPTION =
  "aliyaabdullah.com — one accountable operator for global trading, general contracting, and enterprise IT & AI services.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CorporateLandingPage,
});

type Filter = "all" | "trading" | "contracting" | "it";

const SERVICE_TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All (14)" },
  { id: "trading", label: "Trading (4)" },
  { id: "contracting", label: "Contracting (4)" },
  { id: "it", label: "IT & AI (6)" },
];

const PROJECT_TABS: { id: Filter; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "trading", label: "Trading" },
  { id: "contracting", label: "Contracting" },
  { id: "it", label: "IT & AI" },
];

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#why-choose-us", label: "Why us" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

const HERO_PILLARS = [
  { icon: Ship, title: "Trading", text: "Sourcing, import & export, distribution" },
  { icon: HardHat, title: "Contracting", text: "Construction, project support, maintenance" },
  { icon: Cpu, title: "IT & AI", text: "Web, mobile apps, software & automation" },
];

const ALL_SUB_SERVICES = SERVICE_VERTICALS.flatMap((v) => v.subServices.map((s) => s.name));

const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as CSSProperties;

/* -------------------------------------------------------------------------- */

function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => undefined);
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full scale-105 object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/videos/hero-poster.jpg"
      aria-hidden="true"
    >
      <source src="/videos/hero.mp4" type="video/mp4" />
    </video>
  );
}

function SectionLabel({ children, tone = "dark" }: { children: string; tone?: "dark" | "light" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.3em] uppercase",
        tone === "light" ? "text-emerald-light" : "text-emerald",
      )}
    >
      <span className="h-px w-8 bg-current" />
      {children}
    </span>
  );
}

function FilterTabs({
  tabs,
  active,
  onChange,
  tone = "dark",
}: {
  tabs: { id: Filter; label: string }[];
  active: Filter;
  onChange: (id: Filter) => void;
  tone?: "dark" | "light";
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex flex-wrap gap-1.5 rounded-full border p-1.5",
        tone === "light" ? "border-ink-border bg-ink-soft" : "border-border bg-card",
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-semibold transition duration-300",
            active === tab.id
              ? "bg-emerald text-accent-foreground shadow-glow"
              : tone === "light"
                ? "text-ink-muted hover:text-ink-foreground"
                : "text-muted-foreground hover:text-foreground",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function CorporateLandingPage() {
  useReveal();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceCardData | null>(null);
  const [projectFilter, setProjectFilter] = useState<Filter>("all");
  const [servicesTab, setServicesTab] = useState<Filter>("all");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState<QuoteFormValues>(EMPTY_QUOTE);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openQuote = (patch?: Partial<QuoteFormValues>) => {
    if (patch) setQuoteForm((prev) => ({ ...prev, ...patch }));
    setQuoteModalOpen(true);
  };

  const filteredProjects =
    projectFilter === "all" ? CASE_STUDIES : CASE_STUDIES.filter((p) => p.category === projectFilter);

  const solidHeader = scrolled || mobileMenuOpen;

  return (
    <div className="min-h-screen overflow-x-clip bg-background font-sans text-foreground antialiased">
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          solidHeader
            ? "border-b border-ink-border bg-ink/90 shadow-elegant backdrop-blur-xl"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className={cn(SHELL, "flex items-center justify-between transition-all duration-500", solidHeader ? "h-18" : "h-24")}>
          <a href="#top" className="group flex items-center gap-3">
            <LogoMark className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]" />
            <Wordmark tone="light" />
          </a>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-sm font-medium text-ink-foreground/85 transition-colors hover:text-ink-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-emerald-light transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <button
              onClick={() => openQuote()}
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-emerald px-5 text-xs font-semibold tracking-wide text-accent-foreground shadow-glow transition duration-300 hover:bg-emerald-deep"
            >
              Get a quote
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex size-11 items-center justify-center rounded-xl border border-ink-border bg-ink-soft/70 text-ink-foreground backdrop-blur lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 border-t border-ink-border bg-ink px-6 pb-8 pt-4 duration-300 lg:hidden">
            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-b border-ink-border py-4 font-serif text-2xl text-ink-foreground"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQuote();
                }}
                className={cn(primaryButtonClass, "mt-6 w-full")}
              >
                Get a quote
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* HERO WITH VIDEO                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-ink-foreground">
        <HeroVideo />
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="ink-grid absolute inset-0 opacity-40" />
        <div className="animate-float pointer-events-none absolute -left-32 top-1/4 size-[28rem] rounded-full bg-emerald/25 blur-[120px]" />
        <div className="animate-float-slow pointer-events-none absolute -right-24 bottom-10 size-[24rem] rounded-full bg-silver/10 blur-[110px]" />

        <div className={cn(SHELL, "relative flex flex-1 flex-col justify-center pb-12 pt-36 sm:pt-40")}>
          <div
            className="rise inline-flex w-fit items-center gap-2.5 rounded-full border border-ink-border bg-ink/40 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-ink-foreground/90 uppercase backdrop-blur-md"
            style={{ animationDelay: "50ms" }}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-light opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-light" />
            </span>
            {SITE_TAGLINE}
          </div>

          <p
            lang="ar"
            dir="rtl"
            className="rise mt-6 w-fit font-arabic text-[1.05rem] font-bold leading-snug text-ink-foreground sm:text-2xl"
            style={{ animationDelay: "120ms" }}
          >
            {COMPANY_NAME_AR}
          </p>

          <h1 className="mt-6 max-w-5xl font-serif text-[clamp(3rem,8vw,7.25rem)] font-medium leading-[0.98] tracking-tight">
            <span className="rise block" style={{ animationDelay: "200ms" }}>
              One operator.
            </span>
            <span className="rise block pb-3 font-light italic text-brand-shimmer" style={{ animationDelay: "420ms" }}>
              Every leg of the corporate journey.
            </span>
          </h1>

          <p
            className="rise mt-6 max-w-2xl text-base leading-relaxed text-ink-foreground/80 sm:text-lg"
            style={{ animationDelay: "620ms" }}
          >
            Global trading, large-scale contracting and advanced IT &amp; AI services — run under one accountable
            team. No handoff delays, no vendor disputes, just precise delivery.
          </p>

          <div className="rise mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "800ms" }}>
            <button onClick={() => openQuote()} className={primaryButtonClass}>
              Request a quote
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href="#services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink-foreground/25 bg-ink-foreground/5 px-7 text-sm font-semibold text-ink-foreground backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-ink-foreground/50 hover:bg-ink-foreground/10"
            >
              Explore services
            </a>
          </div>

          <div className="mt-16 grid gap-3 sm:grid-cols-3">
            {HERO_PILLARS.map((pillar, i) => (
              <a
                key={pillar.title}
                href="#services"
                className="rise group flex items-center gap-4 rounded-2xl border border-ink-border/80 bg-ink/45 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-emerald/60 hover:bg-ink/60"
                style={{ animationDelay: `${1000 + i * 120}ms` }}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald/15 text-emerald-light ring-1 ring-emerald/30 transition group-hover:bg-emerald group-hover:text-accent-foreground">
                  <pillar.icon className="size-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-ink-foreground">{pillar.title}</span>
                  <span className="block text-xs text-ink-muted">{pillar.text}</span>
                </span>
                <ArrowUpRight className="ml-auto size-4 text-ink-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-light" />
              </a>
            ))}
          </div>
        </div>

        <a
          href="#stats"
          aria-label="Scroll down"
          className="relative mx-auto mb-6 hidden h-11 w-7 justify-center rounded-full border border-ink-foreground/30 pt-2 sm:flex"
        >
          <span className="animate-scroll-cue block h-2.5 w-1 rounded-full bg-emerald-light" />
        </a>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* MARQUEE                                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative overflow-hidden border-y border-ink-border bg-ink py-5" aria-hidden="true">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...ALL_SUB_SERVICES, ...ALL_SUB_SERVICES].map((name, i) => (
            <span key={`${name}-${i}`} className="flex items-center gap-10 font-serif text-2xl italic text-ink-foreground/85">
              {name}
              <span className="text-base not-italic text-emerald-light">✦</span>
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* STATS                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section id="stats" className="relative overflow-hidden py-20 lg:py-24">
        <div className="luxury-grid absolute inset-0 -z-10 opacity-60" />
        <div className={cn(SHELL, "grid grid-cols-2 gap-y-12 lg:grid-cols-4")}>
          {[
            { value: 350, suffix: "+", label: "Major projects delivered" },
            { value: 480, prefix: "$", suffix: "M+", label: "Traded & built volume" },
            { value: 18, suffix: "+", label: "Trade ports & hubs" },
            { value: 99, suffix: "%", label: "On-time milestones" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              data-reveal
              style={delay(i * 120)}
              className={cn("px-4 sm:px-8", i % 2 === 1 && "border-l border-border", i >= 1 && "lg:border-l lg:border-border")}
            >
              <p className="font-serif text-5xl font-medium text-foreground sm:text-6xl">
                <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SERVICE PILLARS                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section id="services" className="relative bg-secondary py-24 lg:py-32">
        <div className={SHELL}>
          <div className="max-w-2xl" data-reveal>
            <SectionLabel>Core verticals</SectionLabel>
            <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] sm:text-6xl">
              Three pillars of capability.{" "}
              <span className="italic font-light text-brand-gradient">One unified team.</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Each discipline is run by seasoned specialists with deep domain authority. Explore what each one covers.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_VERTICALS.map((vertical, i) => {
              const Icon = vertical.icon;
              return (
                <article
                  key={vertical.id}
                  data-reveal
                  style={delay(i * 140)}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-500 hover:-translate-y-2 hover:border-emerald/40 hover:shadow-elegant"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                    <img
                      src={vertical.image}
                      alt={vertical.title}
                      loading="lazy"
                      className="size-full object-cover transition duration-[1.2s] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                    <span className="absolute left-5 top-5 rounded-full bg-ink/60 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-ink-foreground uppercase backdrop-blur-md">
                      {vertical.badge}
                    </span>
                    <span className="absolute bottom-5 left-5 font-serif text-6xl font-light text-ink-foreground/30">
                      0{i + 1}
                    </span>
                    <span className="absolute bottom-5 right-5 flex size-12 items-center justify-center rounded-2xl bg-emerald text-accent-foreground shadow-glow transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
                      <Icon className="size-6" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="font-serif text-3xl font-semibold">{vertical.title}</h3>
                    <p className="mt-1 text-[11px] font-bold tracking-[0.16em] text-emerald uppercase">{vertical.headline}</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{vertical.shortDesc}</p>
                    <ul className="mt-6 space-y-2.5 border-t border-border pt-5 text-sm">
                      {vertical.subServices.map((sub) => (
                        <li key={sub.name} className="flex items-center gap-2.5">
                          <CheckCircle2 className="size-4 shrink-0 text-emerald" />
                          {sub.name}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-7">
                      <button
                        onClick={() => setActiveServiceModal(vertical)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase transition hover:text-emerald"
                      >
                        Full scope
                        <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </button>
                      <button
                        onClick={() => openQuote({ vertical: vertical.id })}
                        className="rounded-full border border-border px-4 py-2 text-xs font-semibold transition duration-300 hover:border-emerald hover:bg-emerald hover:text-accent-foreground"
                      >
                        Get quote
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* DETAILED SCOPE                                                     */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-24 lg:py-32">
        <div className={SHELL}>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end" data-reveal>
            <div>
              <SectionLabel>Detailed scope</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl font-medium sm:text-6xl">Every service, accounted for.</h2>
            </div>
            <FilterTabs tabs={SERVICE_TABS} active={servicesTab} onChange={setServicesTab} />
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_VERTICALS.filter((v) => servicesTab === "all" || v.id === servicesTab)
              .flatMap((v) => v.subServices.map((sub) => ({ ...sub, parentTitle: v.title, parentVertical: v.id })))
              .map((service, i) => {
                const SubIcon = service.icon;
                return (
                  <div
                    key={`${servicesTab}-${service.name}`}
                    data-reveal
                    style={delay((i % 3) * 100)}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-7 transition duration-500 hover:-translate-y-1 hover:border-emerald/40 hover:shadow-elegant"
                  >
                    <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-emerald/0 blur-2xl transition duration-700 group-hover:bg-emerald/15" />
                    <div className="flex items-center justify-between">
                      <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-foreground transition duration-500 group-hover:bg-emerald group-hover:text-accent-foreground">
                        <SubIcon className="size-5" />
                      </span>
                      <span className="text-[10px] font-bold tracking-[0.16em] text-muted-foreground uppercase">
                        {service.parentTitle}
                      </span>
                    </div>
                    <h3 className="mt-6 font-serif text-2xl font-semibold">{service.name}</h3>
                    <p className="mt-1 text-xs font-medium text-emerald">{service.tagline}</p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.description}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-border pt-5 mt-6">
                      <span className="text-xs text-muted-foreground">{service.highlights[0]}</span>
                      <button
                        onClick={() =>
                          openQuote({
                            vertical: service.parentVertical,
                            message: `Inquiring specifically about: ${service.name}. `,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold transition hover:text-emerald"
                      >
                        Inquire <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* HOW WE WORK + INDUSTRIES */}
      <section className="relative overflow-hidden bg-ink py-24 text-ink-foreground lg:py-32">
        <div className={SHELL}>
          <div data-reveal>
            <SectionLabel>How we work</SectionLabel>
            <h2 className="mt-4 font-serif text-4xl font-medium sm:text-6xl">
              Four steps, <span className="text-brand-shimmer">one accountable team.</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["01", "Listen", "We meet you, understand the goal, budget and timeline, and visit the site if needed."],
              ["02", "Plan", "You receive a clear scope, schedule and written quotation before any work begins."],
              ["03", "Deliver", "Our team sources, builds or develops, with regular progress updates along the way."],
              ["04", "Support", "After handover we stay available for maintenance, re-orders and future phases."],
            ].map(([n, t, d], i) => (
              <div key={n} data-reveal style={delay(i * 100)} className="rounded-2xl border border-ink-border bg-ink-soft p-7 transition duration-500 hover:-translate-y-1 hover:border-emerald/50">
                <span className="font-serif text-5xl text-emerald-light">{n}</span>
                <h3 className="mt-4 text-xl font-bold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{d}</p>
              </div>
            ))}
          </div>

          <div className="mt-24" data-reveal>
            <SectionLabel>Industries we serve</SectionLabel>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Construction & real estate", "Retail & wholesale", "Hospitality", "Healthcare", "Education", "Government suppliers", "Logistics", "Manufacturing", "Startups & SMEs", "Oil & gas services"].map((x) => (
                <span key={x} className="rounded-full border border-ink-border bg-ink-soft px-5 py-2.5 text-sm font-medium transition hover:border-emerald hover:text-emerald-light">
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 lg:py-32">
        <div className={cn(SHELL, "grid gap-12 lg:grid-cols-[1fr_1.5fr]")}>
          <div data-reveal>
            <SectionLabel>Questions</SectionLabel>
            <h2 className="mt-4 font-serif text-4xl font-medium sm:text-6xl">Frequently asked.</h2>
          </div>
          <div className="divide-y divide-border rounded-2xl border border-border bg-card" data-reveal>
            {[
              ["Which cities do you work in?", "We are based in Makkah, Jeddah and Al Baha and serve clients across Saudi Arabia."],
              ["Can one company handle trading, building and IT for me?", "Yes. That is our purpose: one contact and one contract for supplies, contracting work and technology."],
              ["How do I get a price?", "Send a quote request below. We reply with questions or a written quotation."],
              ["Do you work with small businesses?", "Yes. We work with individuals, small businesses and large companies alike."],
            ].map(([q, a]) => (
              <details key={q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {q}
                  <span className="text-xl text-emerald transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* ABOUT                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section id="about" className="relative overflow-hidden bg-secondary py-24 lg:py-32">
        <div className={cn(SHELL, "grid items-center gap-16 lg:grid-cols-2")}>
          <div className="relative" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-elegant sm:w-4/5">
              <img src="/images/project-build.jpg" alt="Commercial headquarters delivered by our contracting team" loading="lazy" className="size-full object-cover" />
            </div>
            <div className="absolute -bottom-10 right-0 hidden aspect-square w-1/2 overflow-hidden rounded-[2rem] border-8 border-secondary shadow-elegant sm:block">
              <img src="/images/project-tech.jpg" alt="Operations control room run by our IT team" loading="lazy" className="size-full object-cover" />
            </div>
            <div className="animate-float absolute -left-3 top-10 rounded-2xl border border-ink-border bg-ink/90 p-5 text-ink-foreground shadow-elegant backdrop-blur sm:-left-8">
              <p className="font-serif text-4xl font-semibold text-brand-gradient">1</p>
              <p className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-ink-muted uppercase">Point of accountability</p>
            </div>
          </div>

          <div>
            <div data-reveal>
              <SectionLabel>Our philosophy</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] sm:text-6xl">
                We own the outcome.{" "}
                <span className="italic font-light text-brand-gradient">From start to finish.</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Traditional models force clients to juggle freight brokers, contractors and software agencies — and
                delays turn into finger-pointing. <strong className="font-semibold text-foreground">{SITE_NAME}</strong>{" "}
                unites global sourcing, physical construction and software intelligence under one roof.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              {[
                {
                  title: "One master agreement",
                  text: "A single contract covering procurement, construction and digital systems, with unified invoicing and guarantees.",
                },
                {
                  title: "Seamless coordination",
                  text: "Our trading arm sources materials for our builds, while our IT team deploys monitoring and automation into them.",
                },
                {
                  title: "A dedicated director",
                  text: "One senior lead oversees clearances, site teams and engineering — with round-the-clock accountability.",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  data-reveal
                  style={delay(i * 120)}
                  className="group flex gap-4 rounded-2xl border border-border bg-card p-5 transition duration-500 hover:border-emerald/40 hover:shadow-elegant"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-emerald/10 font-serif text-lg font-semibold text-emerald transition group-hover:bg-emerald group-hover:text-accent-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-4" data-reveal>
              <button onClick={() => openQuote()} className={primaryButtonClass}>
                Book a consultation <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#contact"
                className="inline-flex h-12 items-center rounded-full border border-border bg-card px-7 text-sm font-semibold transition hover:border-emerald hover:text-emerald"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* WHY CHOOSE US (DARK)                                               */}
      {/* ------------------------------------------------------------------ */}
      <section id="why-choose-us" className="relative isolate overflow-hidden bg-ink py-24 text-ink-foreground lg:py-32">
        <div className="ink-grid absolute inset-0 -z-10 opacity-50" />
        <div className="animate-float pointer-events-none absolute -right-40 top-0 -z-10 size-[32rem] rounded-full bg-emerald/20 blur-[140px]" />
        <div className={SHELL}>
          <div className="mx-auto max-w-2xl text-center" data-reveal>
            <SectionLabel tone="light">Proven standards</SectionLabel>
            <h2 className="mt-4 font-serif text-4xl font-medium sm:text-6xl">
              Why leading enterprises <span className="italic font-light text-brand-shimmer">partner with us</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Built for organisations that can't afford compromised quality, delayed timelines or legal exposure.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US_POINTS.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.number}
                  data-reveal
                  style={delay(i * 120)}
                  className="group relative overflow-hidden rounded-3xl border border-ink-border bg-ink-soft/70 p-7 transition duration-500 hover:-translate-y-2 hover:border-emerald/60"
                >
                  <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand-gradient transition-transform duration-700 group-hover:scale-x-100" />
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-5xl font-light text-brand-gradient">{point.number}</span>
                    <span className="flex size-11 items-center justify-center rounded-xl bg-emerald/15 text-emerald-light ring-1 ring-emerald/30 transition group-hover:bg-emerald group-hover:text-accent-foreground">
                      <Icon className="size-5" />
                    </span>
                  </div>
                  <h3 className="mt-8 font-serif text-xl font-semibold">{point.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{point.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* PROJECTS                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section id="projects" className="py-24 lg:py-32">
        <div className={SHELL}>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end" data-reveal>
            <div>
              <SectionLabel>Track record</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl font-medium sm:text-6xl">Featured case studies</h2>
            </div>
            <FilterTabs tabs={PROJECT_TABS} active={projectFilter} onChange={setProjectFilter} />
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project, i) => (
              <article
                key={`${projectFilter}-${project.title}`}
                data-reveal
                style={delay(i * 120)}
                className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition duration-500 hover:-translate-y-2 hover:shadow-elegant"
              >
                <div className="relative aspect-[16/11] overflow-hidden bg-ink">
                  <img src={project.image} alt={project.title} loading="lazy" className="size-full object-cover transition duration-[1.2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
                  <span className="absolute left-5 top-5 rounded-full bg-ink/70 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-ink-foreground uppercase backdrop-blur-md">
                    {project.tag}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> {project.timeline}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl font-semibold leading-tight">{project.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.desc}</p>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {project.metrics.map((m) => (
                      <div key={m.label} className="rounded-xl bg-secondary p-3 text-center">
                        <p className="text-sm font-bold">{m.val}</p>
                        <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      openQuote({
                        vertical: project.category,
                        message: `Inquiring about a similar delivery model to: ${project.title}. `,
                      })
                    }
                    className="mt-auto inline-flex items-center gap-1.5 self-start pt-6 text-xs font-bold tracking-[0.14em] uppercase transition hover:text-emerald"
                  >
                    Request case brief <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* QUOTE                                                              */}
      {/* ------------------------------------------------------------------ */}
      <section id="quote" className="bg-secondary py-24 lg:py-32">
        <div className={SHELL}>
          <div className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-elegant lg:grid-cols-12" data-reveal>
            <div className="relative isolate overflow-hidden bg-ink p-8 text-ink-foreground sm:p-12 lg:col-span-5">
              <div className="animate-float-slow pointer-events-none absolute -bottom-24 -left-24 -z-10 size-80 rounded-full bg-emerald/30 blur-[100px]" />
              <SectionLabel tone="light">Project intake</SectionLabel>
              <h2 className="mt-4 font-serif text-4xl font-medium leading-[1.05] sm:text-5xl">
                Request a <span className="italic font-light text-brand-shimmer">tailored proposal.</span>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                Whether it's an international trade consignment, a construction project or custom AI software, we
                come back with clear schedules and pricing within 24 hours.
              </p>
              <ul className="mt-8 space-y-4 text-sm">
                {[
                  "Fixed-price bids & transparent milestone billing",
                  "NDA and IP protection on every submission",
                  "Cross-border tax & customs analysis",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-light" /> {line}
                  </li>
                ))}
              </ul>
              <img src="/brand/logo-full.webp" alt="aliyaabdullah logo" loading="lazy" className="mt-10 w-48 opacity-90" />
            </div>
            <div className="p-8 sm:p-12 lg:col-span-7">
              <h3 className="font-serif text-2xl font-semibold">Tell us about your project</h3>
              <p className="mt-1 text-sm text-muted-foreground">Fields marked * are required.</p>
              <div className="mt-8">
                <QuoteForm idPrefix="section-quote" values={quoteForm} onChange={setQuoteForm} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CONTACT                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section id="contact" className="py-24 lg:py-32">
        <div className={cn(SHELL, "grid gap-14 lg:grid-cols-12")}>
          <div className="lg:col-span-5" data-reveal>
            <SectionLabel>Get in touch</SectionLabel>
            <h2 className="mt-4 font-serif text-4xl font-medium sm:text-6xl">Let's talk.</h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
              Our team coordinates shipments, construction sites and engineering sprints across time zones. Send us a
              message and the right person will reply.
            </p>
            <div className="mt-10 space-y-4">
              {[
                {
                  icon: MapPin,
                  title: "Offices",
                  lines: [{ text: CONTACT_LOCATIONS_LINE }, { text: CONTACT_COUNTRY }],
                },
                { icon: Phone, title: "Phone", lines: [{ text: CONTACT_PHONE, href: CONTACT_PHONE_HREF }] },
                { icon: Mail, title: "Email", lines: [{ text: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` }] },
              ].map((item) => (
                <div key={item.title} className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:border-emerald/40">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink text-emerald-light transition group-hover:bg-emerald group-hover:text-accent-foreground">
                    <item.icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-[11px] font-bold tracking-[0.18em] uppercase">{item.title}</h3>
                    {item.lines.map((line: { text: string; href?: string }) => (
                      <p key={line.text} className="mt-1 text-sm text-muted-foreground">
                        {line.href ? (
                          <a href={line.href} className="transition hover:text-emerald" dir="ltr">
                            {line.text}
                          </a>
                        ) : (
                          line.text
                        )}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7" data-reveal style={delay(150)}>
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-elegant sm:p-10">
              <h3 className="font-serif text-2xl font-semibold">Send a message</h3>
              <p className="mt-1 text-sm text-muted-foreground">We usually reply within one business day.</p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                             */}
      {/* ------------------------------------------------------------------ */}
      <footer className="relative isolate overflow-hidden bg-ink pt-20 text-ink-foreground">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-px w-2/3 -translate-x-1/2 bg-brand-gradient opacity-60" />
        <div className={SHELL}>
          <div className="grid gap-14 border-b border-ink-border pb-16 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <img src="/brand/logo-full.webp" alt="aliyaabdullah logo" loading="lazy" className="w-56" />
              <p lang="ar" dir="rtl" className="mt-6 w-fit font-arabic text-base font-bold leading-snug text-ink-foreground sm:text-lg">
                {COMPANY_NAME_AR}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-muted">
                One accountable team for international trading, general contracting and bespoke software engineering.
              </p>
              <div className="mt-6 space-y-1 text-sm text-ink-muted">
                <p>{CONTACT_LOCATIONS_LINE}, {CONTACT_COUNTRY}</p>
                <p>
                  <a href={CONTACT_PHONE_HREF} className="transition hover:text-ink-foreground">
                    {CONTACT_PHONE}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="transition hover:text-ink-foreground">
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
              {SERVICE_VERTICALS.map((v) => (
                <div key={v.id}>
                  <h4 className="text-[11px] font-bold tracking-[0.2em] text-emerald-light uppercase">{v.title}</h4>
                  <ul className="mt-5 space-y-3 text-sm text-ink-foreground/70">
                    {v.subServices.map((s) => (
                      <li key={s.name}>
                        <a href="#services" className="transition hover:text-ink-foreground">
                          {s.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <h4 className="text-[11px] font-bold tracking-[0.2em] text-emerald-light uppercase">Company</h4>
                <ul className="mt-5 space-y-3 text-sm text-ink-foreground/70">
                  {NAV_LINKS.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="transition hover:text-ink-foreground">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 py-8 text-xs text-ink-muted sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
            </p>
            <a href="#top" className="inline-flex items-center gap-1.5 transition hover:text-ink-foreground">
              Back to top <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* SERVICE DETAIL MODAL                                               */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={!!activeServiceModal} onOpenChange={(open) => !open && setActiveServiceModal(null)}>
        {activeServiceModal && (
          <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl border-border bg-background">
            <DialogHeader>
              <span className="text-[10px] font-bold tracking-[0.2em] text-emerald uppercase">{activeServiceModal.badge}</span>
              <DialogTitle className="font-serif text-3xl font-semibold">{activeServiceModal.title}</DialogTitle>
              <DialogDescription className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {activeServiceModal.headline}
              </DialogDescription>
            </DialogHeader>
            <div className="relative mt-2 aspect-[16/7] overflow-hidden rounded-2xl">
              <img src={activeServiceModal.image} alt={activeServiceModal.title} className="size-full object-cover" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{activeServiceModal.fullDesc}</p>
            <div className="grid grid-cols-3 gap-2">
              {activeServiceModal.metrics.map((m) => (
                <div key={m.label} className="rounded-xl bg-secondary p-3 text-center">
                  <p className="font-serif text-xl font-semibold">{m.value}</p>
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {activeServiceModal.subServices.map((sub) => (
                <div key={sub.name} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <sub.icon className="size-4 text-emerald" /> {sub.name}
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{sub.description}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <button onClick={() => setActiveServiceModal(null)} className="text-sm font-semibold text-muted-foreground hover:text-foreground">
                Close
              </button>
              <button
                onClick={() => {
                  const id = activeServiceModal.id;
                  setActiveServiceModal(null);
                  openQuote({ vertical: id });
                }}
                className={primaryButtonClass}
              >
                Request a quote <ArrowRight className="size-4" />
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* ------------------------------------------------------------------ */}
      {/* QUOTE MODAL                                                        */}
      {/* ------------------------------------------------------------------ */}
      <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto rounded-3xl border-border bg-background">
          <DialogHeader>
            <DialogTitle className="font-serif text-3xl font-semibold">Request a proposal</DialogTitle>
            <DialogDescription>Share your requirements and we'll prepare a detailed estimate.</DialogDescription>
          </DialogHeader>
          <QuoteForm idPrefix="modal-quote" values={quoteForm} onChange={setQuoteForm} onSent={() => setQuoteModalOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
