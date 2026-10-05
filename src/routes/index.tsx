import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Cpu,
  Factory,
  Hammer,
  Handshake,
  HardHat,
  Headphones,
  Home,
  Layers3,
  Mail,
  Plane,
  Rocket,
  ShoppingBag,
  Ship,
  Sparkles,
  Truck,
} from "lucide-react";

const SHELL = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10";
const TITLE = "Aliya Abdullah | Multipurpose Business Services Coming Soon";
const DESC =
  "Aliya Abdullah is a multipurpose business platform under construction for import export, software and app development, construction, logistics, consulting, and more.";
const CONTACT_EMAIL = "aamir@aaliyaabdullah.com";

const services = [
  {
    title: "Import & Export",
    text: "Trade support, sourcing, supplier coordination, shipment planning, and market entry guidance.",
    icon: Ship,
  },
  {
    title: "Software & Apps",
    text: "Websites, mobile apps, business automation, dashboards, and digital product builds.",
    icon: Rocket,
  },
  {
    title: "Construction",
    text: "Project coordination, material support, vendor connections, interiors, and site execution help.",
    icon: Hammer,
  },
  {
    title: "Logistics",
    text: "Moving goods, planning routes, packaging support, fulfillment workflows, and documentation.",
    icon: Truck,
  },
  {
    title: "Business Setup",
    text: "New venture support, operational planning, vendor discovery, and launch coordination.",
    icon: Building2,
  },
  {
    title: "Travel & Aviation",
    text: "Business travel coordination, ticketing support, itinerary planning, and travel documentation help.",
    icon: Plane,
  },
  {
    title: "Real Estate",
    text: "Property support, leasing coordination, renovation planning, and commercial space assistance.",
    icon: Home,
  },
  {
    title: "Trading & Sourcing",
    text: "Product sourcing, wholesale buying, vendor checks, order coordination, and procurement support.",
    icon: ShoppingBag,
  },
  {
    title: "IT & Automation",
    text: "Business tools, workflow automation, CRM setup, cloud support, and technical problem solving.",
    icon: Cpu,
  },
  {
    title: "Documentation",
    text: "Forms, proposals, project paperwork, company profiles, compliance support, and process records.",
    icon: ClipboardCheck,
  },
  {
    title: "Consulting",
    text: "Practical advice for operations, partnerships, project planning, growth, and market strategy.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Contracting",
    text: "Civil work, maintenance, supplier management, labor coordination, and execution supervision.",
    icon: HardHat,
  },
  {
    title: "Partnerships",
    text: "Connections with vendors, agencies, service providers, manufacturers, and skilled teams.",
    icon: Handshake,
  },
  {
    title: "Customer Support",
    text: "Front desk support, follow-ups, service coordination, and customer communication workflows.",
    icon: Headphones,
  },
  {
    title: "Custom Work",
    text: "Tell us what you need done. We connect the right people, process, and execution path.",
    icon: Layers3,
  },
];

const capabilities = [
  "One place for multiple business needs",
  "Practical project coordination",
  "Digital, trade, and field-work support",
  "Built for individuals, startups, and companies",
];

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
    <div className="min-h-dvh overflow-hidden bg-paper text-hoarding antialiased">
      <div className="site-grid fixed inset-0 -z-10 opacity-55" />
      <div className="fixed inset-x-0 top-0 -z-10 h-[48rem] bg-[radial-gradient(circle_at_18%_18%,oklch(0.75_0.16_38_/_0.18),transparent_32%),radial-gradient(circle_at_78%_8%,oklch(0.68_0.1_184_/_0.16),transparent_30%),linear-gradient(180deg,white,transparent_82%)]" />

      <header className={`${SHELL} rise flex items-center justify-between gap-5 py-5`}>
        <a href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-hoarding text-paper shadow-[0_12px_30px_oklch(0.21_0.004_107_/_0.18)]">
            <Factory className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold tracking-[0.18em] uppercase">
              Aliya Abdullah
            </span>
            <span className="block truncate text-xs font-medium text-hoarding/58">
              Multipurpose business services
            </span>
          </span>
        </a>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-hoarding/10 bg-white/80 px-3 text-sm font-semibold shadow-sm backdrop-blur transition hover:border-signal/60 hover:bg-white"
        >
          <Mail className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Contact</span>
        </a>
      </header>

      <main>
        <section className={`${SHELL} grid items-center gap-10 pb-14 pt-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-20 lg:pt-16`}>
          <div className="max-w-3xl">
            <p className="rise inline-flex items-center gap-2 rounded-full border border-signal/35 bg-signal/12 px-4 py-2 text-xs font-bold tracking-[0.18em] text-hoarding uppercase [animation-delay:60ms]">
              <Sparkles className="size-4 text-signal" aria-hidden="true" />
              Under construction
            </p>

            <h1 className="rise mt-6 max-w-4xl text-balance font-display text-[clamp(3.4rem,12vw,8.6rem)] leading-[0.9] [animation-delay:120ms]">
              Get your work done in one place.
            </h1>

            <p className="rise mt-6 max-w-2xl text-pretty text-lg leading-8 text-hoarding/72 sm:text-xl [animation-delay:180ms]">
              Aliya Abdullah is being built as a multipurpose business hub for
              import export, software and app development, construction,
              logistics, business setup, consulting, and custom project support.
            </p>

            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:240ms]">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Project%20enquiry%20for%20Aliya%20Abdullah`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-signal px-5 text-sm font-bold text-hoarding shadow-[0_18px_40px_oklch(0.68_0.211_38_/_0.22)] transition hover:-translate-y-0.5 hover:bg-signal/90"
              >
                Start an enquiry
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#services"
                className="inline-flex h-12 items-center justify-center rounded-md border border-hoarding/15 bg-white/60 px-5 text-sm font-bold text-hoarding shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-signal/70 hover:bg-white"
              >
                View services
              </a>
            </div>
          </div>

          <div className="rise relative [animation-delay:280ms]">
            <div className="rounded-[2rem] border border-hoarding/10 bg-white/82 p-4 shadow-[0_30px_80px_oklch(0.21_0.004_107_/_0.12)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.35rem] border border-hoarding/10 bg-white text-hoarding">
                <div className="h-4 bg-[linear-gradient(90deg,var(--color-signal),oklch(0.69_0.11_184),oklch(0.78_0.12_92))]" />
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold tracking-[0.22em] text-hoarding/50 uppercase">
                        Now building
                      </p>
                      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
                        Business desk
                      </h2>
                    </div>
                    <span className="grid size-14 place-items-center rounded-lg bg-signal/18 text-hoarding">
                      <Factory className="size-7" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-8 grid gap-3">
                    {capabilities.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-lg border border-hoarding/10 bg-paper/70 px-4 py-3 text-sm font-semibold text-hoarding/78"
                      >
                        <CheckCircle2 className="size-5 shrink-0 text-signal" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-lg border border-hoarding/10 bg-[linear-gradient(135deg,oklch(0.98_0.006_84),oklch(0.95_0.03_92))] p-5 text-hoarding">
                    <p className="text-xs font-bold tracking-[0.2em] text-hoarding/55 uppercase">
                      Launch status
                    </p>
                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-hoarding/10">
                      <div className="h-full w-[72%] rounded-full bg-signal" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-hoarding/70">
                      Preparing services, partners, and project intake.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="border-y border-hoarding/10 bg-white/72 py-14 backdrop-blur-sm sm:py-18">
          <div className={SHELL}>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold tracking-[0.22em] text-signal uppercase">
                  What this site is for
                </p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-5xl">
                  A business launchpad for everyday work and serious projects.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-hoarding/65">
                Whether the job is digital, physical, local, or international,
                the platform is being shaped to help people find execution
                support from one reliable place.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group rounded-lg border border-hoarding/10 bg-white/86 p-5 shadow-sm transition hover:-translate-y-1 hover:border-signal/45 hover:bg-white hover:shadow-[0_18px_45px_oklch(0.21_0.004_107_/_0.12)]"
                >
                  <div className="grid size-12 place-items-center rounded-md bg-hoarding text-paper transition group-hover:bg-signal group-hover:text-hoarding">
                    <service.icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-hoarding/67">
                    {service.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className={`${SHELL} flex flex-col gap-3 py-8 text-sm text-hoarding/58 sm:flex-row sm:items-center sm:justify-between`}>
        <p>© 2026 aliyaabdullah.com</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-hoarding/70 hover:text-hoarding">
          {CONTACT_EMAIL}
        </a>
      </footer>
    </div>
  );
}
