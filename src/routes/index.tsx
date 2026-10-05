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
    text: "Sourcing, supplier coordination, trade planning, shipment support, and market entry help.",
    icon: Ship,
  },
  {
    title: "Software & Apps",
    text: "Websites, mobile apps, dashboards, automation, and digital product development.",
    icon: Rocket,
  },
  {
    title: "Construction",
    text: "Project coordination, vendor connections, material support, interiors, and site execution.",
    icon: Hammer,
  },
  {
    title: "Logistics",
    text: "Route planning, packaging support, movement of goods, fulfillment, and documentation.",
    icon: Truck,
  },
  {
    title: "Business Setup",
    text: "Launch planning, operational setup, vendor discovery, process design, and coordination.",
    icon: Building2,
  },
  {
    title: "Travel & Aviation",
    text: "Business travel, ticketing support, itinerary planning, and travel documentation help.",
    icon: Plane,
  },
  {
    title: "Real Estate",
    text: "Property support, leasing coordination, renovation planning, and commercial spaces.",
    icon: Home,
  },
  {
    title: "Trading & Sourcing",
    text: "Product sourcing, wholesale buying, vendor checks, procurement, and order coordination.",
    icon: ShoppingBag,
  },
  {
    title: "IT & Automation",
    text: "CRM setup, workflow automation, business tools, cloud support, and technical fixes.",
    icon: Cpu,
  },
  {
    title: "Documentation",
    text: "Company profiles, proposals, forms, project paperwork, and process records.",
    icon: ClipboardCheck,
  },
  {
    title: "Consulting",
    text: "Practical guidance for operations, partnerships, planning, growth, and market strategy.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Custom Work",
    text: "Share the requirement and we will shape the right team, process, and execution path.",
    icon: Layers3,
  },
];

const stats = [
  { label: "Service areas", value: "12+" },
  { label: "Business categories", value: "Multi" },
  { label: "Launch stage", value: "Build" },
];

const capabilities = [
  "One desk for digital, trade, field, and support work",
  "Built for individuals, startups, and growing companies",
  "Clear project intake, matching, and execution coordination",
  "Practical services for local and international business needs",
];

const footerGroups = [
  {
    title: "Company",
    links: ["About", "Launch updates", "Careers", "Partners"],
  },
  {
    title: "Services",
    links: ["Import export", "Software apps", "Construction", "Logistics"],
  },
  {
    title: "Support",
    links: ["Contact", "Project request", "Help desk", "Documentation"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Compliance", "Cookies"],
  },
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
    <div className="min-h-dvh overflow-hidden bg-[#f8faf7] text-[#17201c] antialiased">
      <div className="modern-grid fixed inset-0 -z-10 opacity-80" />
      <div className="fixed inset-x-0 top-0 -z-10 h-[52rem] bg-[radial-gradient(circle_at_12%_12%,oklch(0.82_0.1_152_/_0.28),transparent_30%),radial-gradient(circle_at_84%_4%,oklch(0.76_0.13_38_/_0.2),transparent_28%),linear-gradient(180deg,white,transparent_84%)]" />

      <header className={`${SHELL} rise flex items-center justify-between gap-5 py-5`}>
        <a href="/" className="flex min-w-0 items-center gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#13261f] text-white shadow-sm">
            <Factory className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-extrabold tracking-tight">
              Aliya Abdullah
            </span>
            <span className="block truncate text-xs font-medium text-[#5d6a63]">
              Multipurpose business services
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full border border-[#d8e0da] bg-white/75 px-3 py-2 text-xs font-bold text-[#66726b] shadow-sm backdrop-blur sm:inline-flex">
            Work in progress
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#17201c] px-4 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#26342e]"
          >
            <Mail className="size-4" aria-hidden="true" />
            Contact
          </a>
        </div>
      </header>

      <main>
        <section className={`${SHELL} grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:pb-24 lg:pt-20`}>
          <div className="max-w-3xl">
            <p className="rise inline-flex items-center gap-2 rounded-full border border-[#f4c6a0] bg-[#fff3e9] px-4 py-2 text-xs font-extrabold tracking-[0.16em] text-[#b6541b] uppercase [animation-delay:40ms]">
              <Sparkles className="size-4" aria-hidden="true" />
              Work in progress
            </p>

            <h1 className="rise mt-6 max-w-4xl text-balance font-display text-[clamp(3rem,7vw,6.7rem)] font-black leading-[0.98] tracking-[-0.045em] text-[#111815] [animation-delay:100ms]">
              A modern business desk for getting real work done.
            </h1>

            <p className="rise mt-6 max-w-2xl text-pretty text-lg leading-8 text-[#59655f] sm:text-xl [animation-delay:160ms]">
              Aliya Abdullah is being built as a multipurpose service platform
              for import export, software and apps, construction, logistics,
              business setup, consulting, documentation, and more.
            </p>

            <div className="rise mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:220ms]">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Project%20enquiry%20for%20Aliya%20Abdullah`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#ff7438] px-6 text-sm font-extrabold text-white shadow-[0_18px_38px_oklch(0.7_0.17_42_/_0.28)] transition hover:-translate-y-0.5 hover:bg-[#e95f25]"
              >
                Start an enquiry
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#services"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[#d8e0da] bg-white/80 px-6 text-sm font-extrabold text-[#17201c] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-[#aab7af] hover:bg-white"
              >
                Explore services
              </a>
            </div>

            <div className="rise mt-10 grid max-w-xl grid-cols-3 gap-3 [animation-delay:280ms]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-[#dfe7e1] bg-white/72 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-2xl font-black tracking-tight text-[#17201c]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#68756e]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rise relative [animation-delay:300ms]">
            <div className="rounded-[2rem] border border-white bg-white/74 p-3 shadow-[0_28px_90px_oklch(0.36_0.03_150_/_0.16)] backdrop-blur-xl">
              <div className="overflow-hidden rounded-[1.45rem] border border-[#dfe7e1] bg-white">
                <div className="flex items-center justify-between border-b border-[#edf1ee] px-5 py-4">
                  <div className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-[#ff7438]" />
                    <span className="size-2.5 rounded-full bg-[#f6c453]" />
                    <span className="size-2.5 rounded-full bg-[#31b88b]" />
                  </div>
                  <span className="rounded-full bg-[#edf8f3] px-3 py-1 text-xs font-extrabold text-[#257a60]">
                    Building now
                  </span>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div>
                      <p className="text-xs font-black tracking-[0.18em] text-[#7d8982] uppercase">
                        Business desk
                      </p>
                      <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                        Services in progress
                      </h2>
                    </div>
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-[#fff0e8] text-[#ff7438]">
                      <Factory className="size-7" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="mt-8 grid gap-3">
                    {capabilities.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-[#e5ebe7] bg-[#fbfcfb] px-4 py-3 text-sm font-bold leading-6 text-[#4f5d56]"
                      >
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#31b88b]" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl bg-[#17201c] p-5 text-white">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black tracking-[0.18em] text-white/50 uppercase">
                          Launch status
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white/78">
                          Preparing services, partners, and project intake.
                        </p>
                      </div>
                      <span className="text-2xl font-black">72%</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/12">
                      <div className="h-full w-[72%] rounded-full bg-[#ff7438]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-white py-16 sm:py-20">
          <div className={SHELL}>
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-black tracking-[0.18em] text-[#ff7438] uppercase">
                  What this site is for
                </p>
                <h2 className="mt-3 max-w-2xl text-balance text-3xl font-black tracking-[-0.025em] text-[#111815] sm:text-5xl">
                  Business support across digital, trade, and field work.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#65726b]">
                A single platform for people who need dependable execution
                support across different kinds of work.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="group rounded-2xl border border-[#e4ebe6] bg-[#fbfcfb] p-5 transition hover:-translate-y-1 hover:border-[#b9d8c9] hover:bg-white hover:shadow-[0_18px_50px_oklch(0.36_0.03_150_/_0.12)]"
                >
                  <div className="grid size-12 place-items-center rounded-2xl bg-[#edf8f3] text-[#257a60] transition group-hover:bg-[#17201c] group-hover:text-white">
                    <service.icon className="size-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#637069]">
                    {service.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e3eae5] bg-[#f8faf7] py-10 text-sm">
        <div className={`${SHELL} grid gap-8 lg:grid-cols-[1.2fr_2fr]`}>
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-[#17201c] text-white">
                <Factory className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-black tracking-tight">Aliya Abdullah</p>
                <p className="text-[#67736d]">Multipurpose business services</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm leading-6 text-[#67736d]">
              The website is under construction. Footer links are placeholders
              for now and will become active after launch.
            </p>
            <p className="mt-4 font-bold text-[#17201c]">{CONTACT_EMAIL}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-black text-[#17201c]">{group.title}</h3>
                <div className="mt-3 grid gap-2">
                  {group.links.map((link) => (
                    <span
                      key={link}
                      className="cursor-not-allowed text-[#748078]"
                      aria-disabled="true"
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${SHELL} mt-8 flex flex-col gap-2 border-t border-[#e3eae5] pt-5 text-xs font-medium text-[#748078] sm:flex-row sm:items-center sm:justify-between`}>
          <p>(c) 2026 aliyaabdullah.com</p>
          <p>Work in progress. Links will be active soon.</p>
        </div>
      </footer>
    </div>
  );
}
