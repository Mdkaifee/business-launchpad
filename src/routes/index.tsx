import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Bot,
  Building2,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  FileText,
  Globe,
  HardHat,
  Laptop,
  Mail,
  MapPin,
  Menu,
  Phone,
  Send,
  ShieldCheck,
  Ship,
  Smartphone,
  Sparkles,
  TrendingUp,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";

const SHELL = "mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12";
const COMPANY_NAME = "AL-MADAAR HOLDINGS";
const COMPANY_TAGLINE = "Global Trading · General Contracting · IT & AI Services";
const CONTACT_EMAIL = "inquiries@almadaar-holdings.com";
const CONTACT_PHONE = "+1 (800) 492-8820";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AL-MADAAR HOLDINGS | Trading, Contracting & IT Services" },
      {
        name: "description",
        content:
          "Elite corporate execution across Global Trading, General Contracting, and Enterprise IT & AI Solutions. United under one accountable group.",
      },
    ],
  }),
  component: CorporateLandingPage,
});

/* -------------------------------------------------------------------------- */
/*                               DATA DEFINITIONS                             */
/* -------------------------------------------------------------------------- */

type ServiceVertical = "trading" | "contracting" | "it";

interface SubService {
  name: string;
  tagline: string;
  description: string;
  icon: typeof Ship;
  highlights: string[];
}

interface ServiceCardData {
  id: ServiceVertical;
  badge: string;
  title: string;
  headline: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  icon: typeof Ship;
  subServices: SubService[];
  metrics: { label: string; value: string }[];
}

const SERVICE_VERTICALS: ServiceCardData[] = [
  {
    id: "trading",
    badge: "VERTICAL 01 / COMMERCE",
    title: "Trading Services",
    headline: "Global Trade Flow & Strategic Supply Sourcing",
    shortDesc:
      "End-to-end commercial trading, international import & export governance, bulk raw materials, and precision logistics distribution across global trade lanes.",
    fullDesc:
      "Our trading division provides multinational corporations and regional enterprises with high-efficiency procurement, audited supplier discovery, border customs compliance, and multi-modal freight coordination. We own the outcome from point of origin to final port delivery.",
    image: "/images/service-trading.jpg",
    icon: Ship,
    metrics: [
      { label: "Active Trade Hubs", value: "18+" },
      { label: "SLA Fulfillment", value: "99.6%" },
      { label: "Cleared Tonnage/Yr", value: "120K MT" },
    ],
    subServices: [
      {
        name: "General Trading",
        tagline: "Commercial wholesale & international commodities",
        description:
          "Structured procurement of high-demand industrial supplies, specialized equipment, consumer goods, and institutional bulk commodities.",
        icon: TrendingUp,
        highlights: ["Vetted supplier audits", "Contractual price hedging", "Quality assurance labs"],
      },
      {
        name: "Import & Export",
        tagline: "Cross-border maritime, air, and freight logistics",
        description:
          "Complete customs clearance brokerage, HS classification, tariffs advisory, bonded storage, and certified international shipping manifests.",
        icon: Ship,
        highlights: ["In-house licensed brokerage", "Port-to-door tracking", "Quarantine compliance"],
      },
      {
        name: "Product Sourcing",
        tagline: "Direct factory sourcing & vendor negotiation",
        description:
          "On-the-ground manufacturing inspections, sample vetting, price discovery, and intellectual property protection across Asia, Europe, and GCC.",
        icon: Globe,
        highlights: ["Factory floor audits", "Direct OEM procurement", "Standardized QC protocols"],
      },
      {
        name: "Supply & Distribution",
        tagline: "3PL warehousing, inventory, & last-mile logistics",
        description:
          "Modern climate-controlled warehousing hubs, real-time EDI inventory synchronization, regional route dispatch, and multi-depot distribution.",
        icon: Workflow,
        highlights: ["Automated buffer stock", "Cold-chain available", "Barcoded pallet tracking"],
      },
    ],
  },
  {
    id: "contracting",
    badge: "VERTICAL 02 / INFRASTRUCTURE",
    title: "Contracting Services",
    headline: "Civil, Commercial & Structural Contracting",
    shortDesc:
      "Turnkey general contracting, commercial facility construction, civil engineering support, and comprehensive structural asset maintenance.",
    fullDesc:
      "With rigorous safety records and certified project engineering superintendents, our contracting division constructs commercial pavilions, industrial campuses, and high-performance corporate infrastructure on budget and on schedule.",
    image: "/images/service-contracting.jpg",
    icon: HardHat,
    metrics: [
      { label: "Square Footage Built", value: "2.4M sqft" },
      { label: "Safety Lost-Time Incidents", value: "Zero" },
      { label: "Avg. Early Delivery", value: "14 Days" },
    ],
    subServices: [
      {
        name: "General Contracting",
        tagline: "Prime contractor leadership & site management",
        description:
          "Full site authority, subcontractor coordination, schedule milestone enforcement, municipal approvals, and complete project accountability.",
        icon: Building2,
        highlights: ["Single-source accountability", "ISO 9001 certified", "Guaranteed completion dates"],
      },
      {
        name: "Construction Services",
        tagline: "Commercial builds, structural steel, and concrete",
        description:
          "Ground-up architectural development, steel framing, curtain wall glazing, advanced MEP installation, and modern interior fit-outs.",
        icon: HardHat,
        highlights: ["Engineered load testing", "Sustainable materials", "Turnkey key handover"],
      },
      {
        name: "Project Support",
        tagline: "Technical engineering, BIM, & procurement support",
        description:
          "Site surveying, structural feasibility analysis, 3D BIM coordination, heavy machinery staging, and site safety management.",
        icon: Award,
        highlights: ["BIM clash detection", "Heavy plant staging", "Civil permit compliance"],
      },
      {
        name: "Maintenance Services",
        tagline: "Lifecycle structural, HVAC, and facilities care",
        description:
          "Preventative structural assessments, electrical and HVAC maintenance, facade remediation, and emergency facilities repair teams.",
        icon: ShieldCheck,
        highlights: ["24/7 emergency dispatch", "Predictive maintenance", "Facilities asset logs"],
      },
    ],
  },
  {
    id: "it",
    badge: "VERTICAL 03 / TECHNOLOGY",
    title: "IT Services",
    headline: "Custom Software, Mobile Apps & Enterprise AI",
    shortDesc:
      "High-velocity digital engineering, cross-platform iOS & Android mobile apps, state-of-the-art UI/UX, bespoke software, and autonomous AI automation.",
    fullDesc:
      "From high-throughput cloud architectures to proprietary machine learning pipelines, our engineering teams build software that drives market dominance. We modernize legacy workflows and build digital products that scale smoothly.",
    image: "/images/service-it.jpg",
    icon: Cpu,
    metrics: [
      { label: "Deployed Systems", value: "140+" },
      { label: "User Engagement Lift", value: "+340%" },
      { label: "Cloud Uptime SLA", value: "99.99%" },
    ],
    subServices: [
      {
        name: "Website Development",
        tagline: "High-performance corporate portals & web platforms",
        description:
          "Ultra-fast React, Next.js, and TanStack web apps engineered with modern responsive frameworks, bulletproof SEO, and high security.",
        icon: Laptop,
        highlights: ["Sub-second page speeds", "WCAG accessible", "Enterprise CMS setup"],
      },
      {
        name: "Mobile App Development",
        tagline: "Native & cross-platform Android & iOS apps",
        description:
          "Fluid consumer and enterprise mobile applications built in React Native, Flutter, and native Swift/Kotlin with offline-first synchronisation.",
        icon: Smartphone,
        highlights: ["App Store & Play Store ready", "Biometric security", "Real-time push engines"],
      },
      {
        name: "UI/UX Design",
        tagline: "Editorial aesthetics, user research, & design systems",
        description:
          "Bespoke wireframes, interactive high-fidelity prototypes, user journey mapping, design tokens, and luxury brand interfaces that wow users.",
        icon: Sparkles,
        highlights: ["Interactive prototypes", "Design token libraries", "Conversion-focused flows"],
      },
      {
        name: "Artificial Intelligence (AI)",
        tagline: "LLM agents, predictive models, & neural automation",
        description:
          "Autonomous agentic workflows, custom fine-tuned model APIs, document intelligence, intelligent data mining, and smart anomaly detection.",
        icon: Bot,
        highlights: ["Proprietary LLM agents", "Private data isolation", "Predictive forecasting"],
      },
      {
        name: "Custom Software Development",
        tagline: "Bespoke SaaS architectures, ERPs, and secure APIs",
        description:
          "Scalable microservices, database architectures, legacy modernizations, and specialized enterprise tooling built to proprietary specifications.",
        icon: Code2,
        highlights: ["Zero technical debt", "REST & GraphQL APIs", "SOC 2 compliant code"],
      },
      {
        name: "Business Automation",
        tagline: "Robotic process automation & unified workflow integration",
        description:
          "Eliminating manual data entry through end-to-end webhook bridges, CRM-ERP synchronization, automated billing, and compliance alerts.",
        icon: Zap,
        highlights: ["Zero human bottlenecks", "Cross-system webhook sync", "Audit trail tracking"],
      },
    ],
  },
];

const CASE_STUDIES = [
  {
    category: "trading",
    tag: "International Trade & Logistics",
    title: "Cross-Border Industrial & Heavy Electronics Sourcing Corridor",
    desc: "Orchestrated the procurement, customs clearance, and multi-modal freight transport of 42,000 MT of industrial electronics and raw copper conduits across 4 continents.",
    image: "/images/project-trading.jpg",
    metrics: [
      { label: "Turnaround Time", val: "22 Days" },
      { label: "Duty Cost Savings", val: "18.4%" },
      { label: "Inspection Pass", val: "100%" },
    ],
    timeline: "2025 – Ongoing",
  },
  {
    category: "contracting",
    tag: "Commercial EPC & Build",
    title: "Crestview Commercial Headquarters & Executive Pavilion",
    desc: "Complete architectural general contracting for an 180,000 sq ft glass and bronze curtain-wall commercial corporate campus with integrated subterranean parking and rooftop terraces.",
    image: "/images/project-build.jpg",
    metrics: [
      { label: "Build Area", val: "180,000 sqft" },
      { label: "Delivery", val: "21 Days Early" },
      { label: "Safety Incident Rate", val: "0.00" },
    ],
    timeline: "2024 – 2025",
  },
  {
    category: "it",
    tag: "Enterprise AI & Cloud Platforms",
    title: "Autonomous Fleet Telemetry & Predictive Cargo AI Platform",
    desc: "Architected a real-time web portal, native iOS/Android dispatch apps, and an AI neural model predicting port congestion and optimal delivery routes with zero downtime.",
    image: "/images/project-tech.jpg",
    metrics: [
      { label: "Fleet Monitored", val: "1,200+ Units" },
      { label: "Route Fuel Saved", val: "24.6%" },
      { label: "API Latency", val: "18ms" },
    ],
    timeline: "2025",
  },
];

const WHY_CHOOSE_US_POINTS = [
  {
    number: "01",
    title: "Single-Point Corporate Accountability",
    desc: "Unlike fragmented subcontractors who point fingers when friction occurs, Al-Madaar owns the entire lifecycle—procuring materials, constructing facilities, and automating software.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Global Compliance & Borderless Sourcing",
    desc: "Direct relationships with certified international mills, licensed customs brokers, and maritime operators ensuring tariff optimization and uninterrupted supply chains.",
    icon: Globe,
  },
  {
    number: "03",
    title: "Licensed Engineering & Safety Rigor",
    desc: "Full adherence to international construction standards, strict OSHA/ISO protocols, BIM coordination, and on-time structural delivery guarantees.",
    icon: HardHat,
  },
  {
    number: "04",
    title: "Next-Gen AI & Modern Software Stacks",
    desc: "We don't just deliver physical assets; our in-house engineering team integrates state-of-the-art AI, IoT sensors, and cloud software to automate operational scale.",
    icon: Cpu,
  },
];

/* -------------------------------------------------------------------------- */
/*                               MAIN COMPONENT                               */
/* -------------------------------------------------------------------------- */

function CorporateLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeServiceModal, setActiveServiceModal] = useState<ServiceCardData | null>(null);
  const [activeProjectFilter, setActiveProjectFilter] = useState<"all" | "trading" | "contracting" | "it">("all");
  const [activeServicesTab, setActiveServicesTab] = useState<"all" | "trading" | "contracting" | "it">("all");
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    vertical: "trading",
    timeline: "1-3 months",
    budget: "$100k - $500k",
    message: "",
  });
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);

  // Direct Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitting(true);
    setTimeout(() => {
      setQuoteSubmitting(false);
      setQuoteModalOpen(false);
      toast.success("Quote Request Transmitted", {
        description: `Thank you, ${quoteForm.name}. A senior commercial officer has been assigned to your proposal.`,
      });
      setQuoteForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        vertical: "trading",
        timeline: "1-3 months",
        budget: "$100k - $500k",
        message: "",
      });
    }, 1000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setTimeout(() => {
      setContactSubmitting(false);
      toast.success("Message Successfully Received", {
        description: "Our corporate executive team will reply within 4 business hours.",
      });
      setContactForm({ name: "", email: "", subject: "", message: "" });
    }, 900);
  };

  const filteredProjects =
    activeProjectFilter === "all"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((p) => p.category === activeProjectFilter);

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#2B211B] font-body selection:bg-[#D8C6B2] selection:text-[#2B211B] antialiased">
      {/* -------------------------------------------------------------------- */}
      {/* 1. TOP ANNOUNCEMENT & CONTACT BAR                                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="border-b border-[#E5DCD1] bg-[#F1E9DD] py-2 text-xs font-medium text-[#8B7766]">
        <div className={`${SHELL} flex flex-col justify-between gap-2 sm:flex-row sm:items-center`}>
          <div className="flex items-center gap-3">
            <span className="inline-block size-2 rounded-full bg-[#2B211B]" />
            <span className="tracking-wide">
              One Unified Operator: <strong className="font-semibold text-[#2B211B]">Trading · Contracting · IT Services</strong>
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <a
              href={`tel:${CONTACT_PHONE}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-[#2B211B]"
            >
              <Phone className="size-3.5 text-[#2B211B]" />
              <span>{CONTACT_PHONE}</span>
            </a>
            <span className="hidden text-[#D8C6B2] sm:inline">|</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="hidden items-center gap-1.5 transition-colors hover:text-[#2B211B] sm:inline-flex"
            >
              <Mail className="size-3.5 text-[#2B211B]" />
              <span>{CONTACT_EMAIL}</span>
            </a>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. CORPORATE HEADER & NAVIGATION                                      */}
      {/* -------------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 border-b border-[#E5DCD1] bg-[#F8F6F2]/95 backdrop-blur-md">
        <div className={`${SHELL} flex h-20 items-center justify-between`}>
          {/* Brand Identity */}
          <a href="/" className="group flex items-center gap-3.5 text-left">
            <div className="flex size-11 items-center justify-center rounded-lg bg-[#2B211B] text-[#F8F6F2] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <span className="font-serif text-xl font-bold tracking-wider">M</span>
            </div>
            <div>
              <span className="block font-serif text-lg font-bold tracking-tight text-[#2B211B] sm:text-xl">
                {COMPANY_NAME}
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-[#8B7766] uppercase">
                Enterprise Solutions
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#about"
              className="text-sm font-medium text-[#2B211B] transition-colors hover:text-[#8B7766]"
            >
              About Us
            </a>
            <a
              href="#services"
              className="text-sm font-medium text-[#2B211B] transition-colors hover:text-[#8B7766]"
            >
              Our Services
            </a>
            <a
              href="#why-choose-us"
              className="text-sm font-medium text-[#2B211B] transition-colors hover:text-[#8B7766]"
            >
              Why Choose Us
            </a>
            <a
              href="#projects"
              className="text-sm font-medium text-[#2B211B] transition-colors hover:text-[#8B7766]"
            >
              Projects
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-[#2B211B] transition-colors hover:text-[#8B7766]"
            >
              Contact Us
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="#services"
              className="inline-flex h-10 items-center justify-center rounded-full border border-[#E5DCD1] bg-[#F1E9DD] px-4 text-xs font-semibold tracking-wide text-[#2B211B] transition hover:border-[#D8C6B2] hover:bg-[#EAE1D3]"
            >
              Explore Services
            </a>
            <button
              onClick={() => setQuoteModalOpen(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-[#2B211B] px-5 text-xs font-semibold tracking-wide text-[#F8F6F2] shadow-sm transition hover:bg-[#3D2F27] hover:shadow"
            >
              <span>Get a Quote</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-lg border border-[#E5DCD1] bg-[#F1E9DD] text-[#2B211B] lg:hidden"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-[#E5DCD1] bg-[#F8F6F2] px-6 py-6 lg:hidden">
            <nav className="flex flex-col gap-4">
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-medium text-[#2B211B]"
              >
                About Us
              </a>
              <a
                href="#services"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-medium text-[#2B211B]"
              >
                Our Services
              </a>
              <a
                href="#why-choose-us"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-medium text-[#2B211B]"
              >
                Why Choose Us
              </a>
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-medium text-[#2B211B]"
              >
                Projects
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-base font-medium text-[#2B211B]"
              >
                Contact Us
              </a>
              <div className="mt-4 flex flex-col gap-2.5 pt-4 border-t border-[#E5DCD1]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setQuoteModalOpen(true);
                  }}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full bg-[#2B211B] text-sm font-semibold text-[#F8F6F2]"
                >
                  Get a Quote
                </button>
                <a
                  href="#services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-11 w-full items-center justify-center rounded-full border border-[#E5DCD1] bg-[#F1E9DD] text-sm font-semibold text-[#2B211B]"
                >
                  Explore Services
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* 3. HERO SECTION (United Carriers Structure + MD Attire Palette)      */}
      {/* -------------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-[#E5DCD1] pb-16 pt-12 lg:pb-24 lg:pt-16">
        <div className="luxury-grid absolute inset-0 -z-10 opacity-70" />

        <div className={SHELL}>
          {/* Top Pill / Badge */}
          <div className="rise inline-flex items-center gap-2 rounded-full border border-[#D8C6B2] bg-[#F1E9DD] px-4 py-1.5 text-xs font-semibold tracking-wider text-[#2B211B] uppercase">
            <span className="size-2 rounded-full bg-[#2B211B]" />
            Volume 01 — Unified Enterprise Execution
          </div>

          {/* Main Headline */}
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <h1 className="rise font-serif text-[clamp(2.5rem,5.5vw,4.8rem)] font-normal leading-[1.04] tracking-tight text-[#2B211B]">
                One operator. <br />
                <span className="italic font-light text-[#8B7766]">
                  Every leg of the corporate journey.
                </span>
              </h1>
              <p className="rise mt-6 max-w-2xl text-base leading-relaxed text-[#8B7766] sm:text-lg">
                We combine global <strong className="font-semibold text-[#2B211B]">Trading Services</strong>,
                large-scale <strong className="font-semibold text-[#2B211B]">Contracting Services</strong>,
                and advanced <strong className="font-semibold text-[#2B211B]">IT & AI Services</strong> under one
                accountable leadership group. No handoff delays, zero vendor disputes, and uncompromising precision.
              </p>

              {/* Action Buttons */}
              <div className="rise mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#2B211B] px-7 text-sm font-semibold tracking-wide text-[#F8F6F2] shadow-md transition hover:-translate-y-0.5 hover:bg-[#3D2F27]"
                >
                  <span>Request a Corporate Quote</span>
                  <ArrowRight className="size-4" />
                </button>
                <a
                  href="#services"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-[#E5DCD1] bg-[#F1E9DD] px-7 text-sm font-semibold tracking-wide text-[#2B211B] transition hover:-translate-y-0.5 hover:border-[#D8C6B2] hover:bg-[#EAE1D3]"
                >
                  Explore 3 Services
                </a>
                <a
                  href="#contact"
                  className="inline-flex h-12 items-center justify-center px-4 text-sm font-medium text-[#8B7766] underline underline-offset-4 transition hover:text-[#2B211B]"
                >
                  Speak With Leadership
                </a>
              </div>
            </div>

            {/* Right Side Quick Stat Card */}
            <div className="rise lg:col-span-4 lg:pt-4">
              <div className="rounded-2xl border border-[#E5DCD1] bg-[#F1E9DD]/80 p-6 backdrop-blur-sm">
                <div className="border-b border-[#E5DCD1] pb-4">
                  <span className="text-[11px] font-bold tracking-widest text-[#8B7766] uppercase">
                    Execution Snapshot
                  </span>
                  <p className="mt-1 font-serif text-2xl font-bold text-[#2B211B]">
                    Single Accountability
                  </p>
                </div>
                <div className="mt-4 space-y-3.5 text-xs text-[#8B7766]">
                  <div className="flex items-center justify-between">
                    <span>Active Corporate Corridors:</span>
                    <strong className="text-sm font-semibold text-[#2B211B]">18 Global Lanes</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>On-Time Milestone SLA:</span>
                    <strong className="text-sm font-semibold text-[#2B211B]">99.4% Verified</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Contracting Safety Incident Rate:</span>
                    <strong className="text-sm font-semibold text-[#2B211B]">0.00 LTI</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Deployment Uptime:</span>
                    <strong className="text-sm font-semibold text-[#2B211B]">99.99% Cloud SLA</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Featured Image & Badges */}
          <div className="rise mt-12 overflow-hidden rounded-2xl border border-[#E5DCD1] bg-[#F1E9DD] p-2 sm:p-3">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[#2B211B]">
              <img
                src="/images/hero-corporate.jpg"
                alt="Al-Madaar Holdings global business operations showing architectural pavilion, maritime trade vessels, and tech excellence"
                className="size-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2B211B]/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                  <div className="max-w-xl text-white">
                    <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-widest uppercase backdrop-blur-md">
                      Integrated Corporate Command
                    </span>
                    <h2 className="mt-2 font-serif text-xl font-normal sm:text-3xl text-[#F8F6F2]">
                      Sourcing global commodities. Constructing enduring spaces. Engineering modern intelligence.
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setQuoteModalOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#F8F6F2] px-5 py-2.5 text-xs font-bold text-[#2B211B] shadow transition hover:bg-[#F1E9DD]"
                    >
                      <span>Inquire Now</span>
                      <ArrowUpRight className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-[#E5DCD1] pt-10 sm:grid-cols-4">
            <div className="border-r border-[#E5DCD1] pr-4">
              <p className="font-serif text-3xl font-bold text-[#2B211B] sm:text-4xl">350+</p>
              <p className="mt-1 text-xs font-medium text-[#8B7766]">Delivered Major Projects</p>
            </div>
            <div className="border-r-0 border-[#E5DCD1] sm:border-r pr-4">
              <p className="font-serif text-3xl font-bold text-[#2B211B] sm:text-4xl">$480M+</p>
              <p className="mt-1 text-xs font-medium text-[#8B7766]">Traded & Built Volume</p>
            </div>
            <div className="border-r border-[#E5DCD1] pr-4">
              <p className="font-serif text-3xl font-bold text-[#2B211B] sm:text-4xl">18+</p>
              <p className="mt-1 text-xs font-medium text-[#8B7766]">Global Trade Ports & Hubs</p>
            </div>
            <div>
              <p className="font-serif text-3xl font-bold text-[#2B211B] sm:text-4xl">3</p>
              <p className="mt-1 text-xs font-medium text-[#8B7766]">Core Synchronized Verticals</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 4. THREE PROMINENT SERVICE PILLAR CARDS (CRITICAL REQUIREMENT #5)     */}
      {/* -------------------------------------------------------------------- */}
      <section id="services" className="border-b border-[#E5DCD1] bg-[#F1E9DD] py-20 lg:py-28">
        <div className={SHELL}>
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#8B7766] uppercase">
              Core Verticals
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal text-[#2B211B] sm:text-5xl">
              Three pillars of capability. <br />
              <span className="italic font-light text-[#8B7766]">One unified enterprise.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#8B7766] sm:text-base">
              Each discipline is operated with deep domain authority, seasoned specialists, and institutional rigor.
              Explore our core service lines below.
            </p>
          </div>

          {/* 3 Prominent Service Cards Grid */}
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SERVICE_VERTICALS.map((vertical) => {
              const IconComponent = vertical.icon;
              return (
                <div
                  key={vertical.id}
                  className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DCD1] bg-[#F8F6F2] transition duration-300 hover:-translate-y-1 hover:border-[#D8C6B2] hover:shadow-xl"
                >
                  <div>
                    {/* Visual Image Header */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2B211B]">
                      <img
                        src={vertical.image}
                        alt={vertical.title}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#2B211B]/60 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4">
                        <span className="rounded-full bg-[#F8F6F2]/90 px-3 py-1 text-[10px] font-bold tracking-widest text-[#2B211B] uppercase backdrop-blur-sm">
                          {vertical.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-xl bg-[#2B211B] text-[#F8F6F2] shadow-md">
                        <IconComponent className="size-6" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-7">
                      <h3 className="font-serif text-2xl font-bold text-[#2B211B]">
                        {vertical.title}
                      </h3>
                      <p className="mt-1 text-xs font-semibold tracking-wider text-[#8B7766] uppercase">
                        {vertical.headline}
                      </p>
                      <p className="mt-4 text-sm leading-relaxed text-[#8B7766]">
                        {vertical.shortDesc}
                      </p>

                      {/* Sub-services Pills */}
                      <div className="mt-6 border-t border-[#E5DCD1] pt-5">
                        <span className="text-[11px] font-bold tracking-wider text-[#8B7766] uppercase">
                          Key Capabilities:
                        </span>
                        <ul className="mt-3 grid grid-cols-1 gap-2 text-xs font-medium text-[#2B211B]">
                          {vertical.subServices.map((sub) => (
                            <li key={sub.name} className="flex items-center gap-2">
                              <CheckCircle2 className="size-3.5 text-[#2B211B]" />
                              <span>{sub.name}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="border-t border-[#E5DCD1] bg-[#F1E9DD]/60 p-6 pt-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setActiveServiceModal(vertical)}
                        className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-[#2B211B] uppercase transition hover:text-[#8B7766]"
                      >
                        <span>Explore Full Scope</span>
                        <ArrowUpRight className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          setQuoteForm((prev) => ({ ...prev, vertical: vertical.id }));
                          setQuoteModalOpen(true);
                        }}
                        className="rounded-full border border-[#D8C6B2] bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#2B211B] transition hover:bg-[#2B211B] hover:text-[#F8F6F2]"
                      >
                        Get Quote
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 5. ALL 14 SERVICES COMPREHENSIVE DEEP DIVE (TABBED EXPLORER)          */}
      {/* -------------------------------------------------------------------- */}
      <section className="border-b border-[#E5DCD1] bg-[#F8F6F2] py-20 lg:py-28">
        <div className={SHELL}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#8B7766] uppercase">
                Detailed Scope
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#2B211B] sm:text-5xl">
                Every service, accounted for.
              </h2>
            </div>
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 rounded-full border border-[#E5DCD1] bg-[#F1E9DD] p-1.5">
              <button
                onClick={() => setActiveServicesTab("all")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeServicesTab === "all"
                    ? "bg-[#2B211B] text-[#F8F6F2] shadow-sm"
                    : "text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                All (14)
              </button>
              <button
                onClick={() => setActiveServicesTab("trading")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeServicesTab === "trading"
                    ? "bg-[#2B211B] text-[#F8F6F2] shadow-sm"
                    : "text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                Trading (4)
              </button>
              <button
                onClick={() => setActiveServicesTab("contracting")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeServicesTab === "contracting"
                    ? "bg-[#2B211B] text-[#F8F6F2] shadow-sm"
                    : "text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                Contracting (4)
              </button>
              <button
                onClick={() => setActiveServicesTab("it")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeServicesTab === "it"
                    ? "bg-[#2B211B] text-[#F8F6F2] shadow-sm"
                    : "text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                IT & AI (6)
              </button>
            </div>
          </div>

          {/* Sub-services Grid */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICE_VERTICALS.filter((v) =>
              activeServicesTab === "all" ? true : v.id === activeServicesTab
            )
              .flatMap((v) =>
                v.subServices.map((sub) => ({
                  ...sub,
                  parentTitle: v.title,
                  parentVertical: v.id,
                }))
              )
              .map((service) => {
                const SubIcon = service.icon;
                return (
                  <div
                    key={service.name}
                    className="flex flex-col justify-between rounded-xl border border-[#E5DCD1] bg-[#F1E9DD]/60 p-6 transition duration-200 hover:border-[#D8C6B2] hover:bg-[#F1E9DD]"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-[#2B211B] text-[#F8F6F2]">
                          <SubIcon className="size-5" />
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-[#8B7766] uppercase">
                          {service.parentTitle}
                        </span>
                      </div>
                      <h3 className="mt-4 font-serif text-xl font-bold text-[#2B211B]">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#8B7766]">
                        {service.tagline}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-[#2B211B]/80">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[#E5DCD1] pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#8B7766]">
                          {service.highlights[0]}
                        </span>
                        <button
                          onClick={() => {
                            setQuoteForm((prev) => ({
                              ...prev,
                              vertical: service.parentVertical,
                              message: `Inquiring specifically about: ${service.name}. `,
                            }));
                            setQuoteModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2B211B] underline underline-offset-4 hover:text-[#8B7766]"
                        >
                          <span>Inquire</span>
                          <ArrowRight className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 6. ABOUT US & SINGLE-POINT ACCOUNTABILITY (UNITED CARRIERS STYLE)   */}
      {/* -------------------------------------------------------------------- */}
      <section id="about" className="border-b border-[#E5DCD1] bg-[#F1E9DD] py-20 lg:py-28">
        <div className={SHELL}>
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-widest text-[#8B7766] uppercase">
                The Group Philosophy
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#2B211B] sm:text-5xl">
                We own the outcome. <br />
                <span className="italic font-light text-[#8B7766]">From start to finish.</span>
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-[#8B7766] sm:text-base">
                In multi-faceted commercial operations, traditional models force clients to coordinate between
                disjointed freight brokers, physical contractors, and software agencies. Delays turn into finger-pointing.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#8B7766] sm:text-base">
                <strong className="font-semibold text-[#2B211B]">{COMPANY_NAME}</strong> was structured to solve this.
                By uniting global sourcing, physical construction, and software intelligence under one roof, we eliminate
                handoff friction and deliver certainty.
              </p>

              <div className="mt-8 flex gap-4">
                <button
                  onClick={() => setQuoteModalOpen(true)}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#2B211B] px-6 text-xs font-semibold text-[#F8F6F2] transition hover:bg-[#3D2F27]"
                >
                  Request Corporate Consultation
                </button>
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#E5DCD1] bg-[#F8F6F2] px-6 text-xs font-semibold text-[#2B211B] transition hover:border-[#D8C6B2]"
                >
                  Direct Contacts
                </a>
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#E5DCD1] bg-[#F8F6F2] p-8 shadow-sm">
                <h3 className="font-serif text-2xl font-bold text-[#2B211B]">
                  The Unified Advantage
                </h3>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-xl border border-[#E5DCD1] bg-[#F1E9DD]/60 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#2B211B]" />
                      <div>
                        <h4 className="text-sm font-bold text-[#2B211B]">
                          Single Master Service Agreement (MSA)
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#8B7766]">
                          One commercial agreement covering procurement, structural contracting, and digital systems.
                          Streamlined invoicing, tax compliance, and unified guarantees.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E5DCD1] bg-[#F1E9DD]/60 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#2B211B]" />
                      <div>
                        <h4 className="text-sm font-bold text-[#2B211B]">
                          Seamless Inter-Vertical Coordination
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#8B7766]">
                          Our trading arm directly sources materials for our contracting projects, while our IT team
                          deploys AI monitoring and sensor automation directly into the built environment.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E5DCD1] bg-[#F1E9DD]/60 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#2B211B]" />
                      <div>
                        <h4 className="text-sm font-bold text-[#2B211B]">
                          Continuous Executive Governance
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-[#8B7766]">
                          You are assigned a dedicated Senior Commercial Director who supervises trade clearances, site
                          superintendents, and software engineering leads with 24/7 accountability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 7. WHY CHOOSE US (UNITED CARRIERS STATELY CARDS)                     */}
      {/* -------------------------------------------------------------------- */}
      <section id="why-choose-us" className="border-b border-[#E5DCD1] bg-[#F8F6F2] py-20 lg:py-28">
        <div className={SHELL}>
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold tracking-widest text-[#8B7766] uppercase">
              Proven Standards
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal text-[#2B211B] sm:text-5xl">
              Why leading enterprises partner with us
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#8B7766]">
              Engineered for institutions that cannot afford compromised quality, delayed timelines, or legal exposure.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE_US_POINTS.map((point) => {
              const PointIcon = point.icon;
              return (
                <div
                  key={point.number}
                  className="rounded-2xl border border-[#E5DCD1] bg-[#F1E9DD] p-7 transition duration-300 hover:-translate-y-1 hover:border-[#D8C6B2] hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-[#8B7766]">
                      {point.number}
                    </span>
                    <div className="flex size-10 items-center justify-center rounded-lg bg-[#2B211B] text-[#F8F6F2]">
                      <PointIcon className="size-5" />
                    </div>
                  </div>
                  <h3 className="mt-6 font-serif text-lg font-bold text-[#2B211B]">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#8B7766]">
                    {point.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 8. FEATURED PROJECTS & TRACK RECORD SHOWCASE                         */}
      {/* -------------------------------------------------------------------- */}
      <section id="projects" className="border-b border-[#E5DCD1] bg-[#F1E9DD] py-20 lg:py-28">
        <div className={SHELL}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#8B7766] uppercase">
                Track Record
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#2B211B] sm:text-5xl">
                Featured Case Studies
              </h2>
            </div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveProjectFilter("all")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeProjectFilter === "all"
                    ? "bg-[#2B211B] text-[#F8F6F2]"
                    : "border border-[#E5DCD1] bg-[#F8F6F2] text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                All Works
              </button>
              <button
                onClick={() => setActiveProjectFilter("trading")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeProjectFilter === "trading"
                    ? "bg-[#2B211B] text-[#F8F6F2]"
                    : "border border-[#E5DCD1] bg-[#F8F6F2] text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                Trading & Sourcing
              </button>
              <button
                onClick={() => setActiveProjectFilter("contracting")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeProjectFilter === "contracting"
                    ? "bg-[#2B211B] text-[#F8F6F2]"
                    : "border border-[#E5DCD1] bg-[#F8F6F2] text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                Contracting & EPC
              </button>
              <button
                onClick={() => setActiveProjectFilter("it")}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  activeProjectFilter === "it"
                    ? "bg-[#2B211B] text-[#F8F6F2]"
                    : "border border-[#E5DCD1] bg-[#F8F6F2] text-[#8B7766] hover:text-[#2B211B]"
                }`}
              >
                IT & AI Platforms
              </button>
            </div>
          </div>

          {/* Project Cards List */}
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {filteredProjects.map((project) => (
              <div
                key={project.title}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E5DCD1] bg-[#F8F6F2] transition duration-300 hover:border-[#D8C6B2] hover:shadow-xl"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#2B211B]">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-[#2B211B]/90 px-3 py-1 text-[10px] font-bold tracking-widest text-[#F8F6F2] uppercase backdrop-blur-sm">
                        {project.tag}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-[11px] font-medium text-[#8B7766]">
                      {project.timeline}
                    </span>
                    <h3 className="mt-2 font-serif text-xl font-bold text-[#2B211B]">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-[#8B7766]">
                      {project.desc}
                    </p>

                    {/* Metrics Grid */}
                    <div className="mt-6 grid grid-cols-3 gap-2 border-t border-[#E5DCD1] pt-4 text-center">
                      {project.metrics.map((m) => (
                        <div key={m.label} className="rounded-lg bg-[#F1E9DD] p-2">
                          <p className="text-xs font-bold text-[#2B211B]">{m.val}</p>
                          <p className="mt-0.5 text-[9px] text-[#8B7766]">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#E5DCD1] bg-[#F1E9DD]/60 p-4 text-right">
                  <button
                    onClick={() => {
                      setQuoteForm((prev) => ({
                        ...prev,
                        vertical: project.category,
                        message: `Inquiring about similar delivery model as: ${project.title}. `,
                      }));
                      setQuoteModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2B211B] transition hover:text-[#8B7766]"
                  >
                    <span>Request Case Brief</span>
                    <ArrowRight className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 9. INTERACTIVE QUOTE & PROJECT ESTIMATOR SECTION                      */}
      {/* -------------------------------------------------------------------- */}
      <section className="border-b border-[#E5DCD1] bg-[#F8F6F2] py-20 lg:py-28">
        <div className={SHELL}>
          <div className="rounded-3xl border border-[#E5DCD1] bg-[#F1E9DD] p-8 sm:p-12 lg:p-16">
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="text-xs font-bold tracking-widest text-[#8B7766] uppercase">
                  Project Intake
                </span>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[#2B211B] sm:text-5xl">
                  Request an executive proposal.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#8B7766]">
                  Whether you require a multi-million-dollar international trade consignment, civil general contracting,
                  or custom AI software architecture, our commercial estimators provide accurate schedules and fixed-cost
                  proposals within 24 hours.
                </p>

                <div className="mt-8 space-y-4 border-t border-[#E5DCD1] pt-6 text-xs text-[#2B211B]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-[#2B211B]" />
                    <span>Fixed-price bids & transparent milestone billing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-[#2B211B]" />
                    <span>Direct NDA and IP protection on all submissions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-4 text-[#2B211B]" />
                    <span>Cross-border tax & customs compliance analysis</span>
                  </div>
                </div>
              </div>

              {/* Functional Interactive Quote Form */}
              <div className="lg:col-span-7">
                <form
                  onSubmit={handleQuoteSubmit}
                  className="rounded-2xl border border-[#E5DCD1] bg-[#F8F6F2] p-6 sm:p-8 shadow-sm"
                >
                  <h3 className="font-serif text-xl font-bold text-[#2B211B]">
                    Project Estimator Form
                  </h3>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold text-[#2B211B] uppercase">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={quoteForm.name}
                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                        placeholder="e.g. Marcus Vance"
                        className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2B211B] uppercase">
                        Organization / Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={quoteForm.company}
                        onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                        placeholder="e.g. Apex Industrial Corp"
                        className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2B211B] uppercase">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        placeholder="m.vance@apex-industrial.com"
                        className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2B211B] uppercase">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        placeholder="+1 (555) 019-2831"
                        className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold text-[#2B211B] uppercase">
                        Primary Vertical
                      </label>
                      <select
                        value={quoteForm.vertical}
                        onChange={(e) => setQuoteForm({ ...quoteForm, vertical: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-xs font-semibold text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                      >
                        <option value="trading">Trading Services</option>
                        <option value="contracting">Contracting Services</option>
                        <option value="it">IT & AI Services</option>
                        <option value="multi">Multi-Vertical Turnkey</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2B211B] uppercase">
                        Expected Timeline
                      </label>
                      <select
                        value={quoteForm.timeline}
                        onChange={(e) => setQuoteForm({ ...quoteForm, timeline: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-xs font-semibold text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                      >
                        <option value="immediate">Immediate (&lt; 30 Days)</option>
                        <option value="1-3 months">1 – 3 Months</option>
                        <option value="3-6 months">3 – 6 Months</option>
                        <option value="planning">Long-Term Planning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#2B211B] uppercase">
                        Estimated Budget
                      </label>
                      <select
                        value={quoteForm.budget}
                        onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-xs font-semibold text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                      >
                        <option value="$25k - $100k">$25,000 – $100,000</option>
                        <option value="$100k - $500k">$100,000 – $500,000</option>
                        <option value="$500k - $2M">$500,000 – $2,000,000</option>
                        <option value="$2M+">$2,000,000+</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-xs font-bold text-[#2B211B] uppercase">
                      Project Specification / Brief *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={quoteForm.message}
                      onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                      placeholder="Outline your volume requirements, delivery destination, architectural blueprints, or software scope..."
                      className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                    />
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[11px] text-[#8B7766]">
                      Guaranteed 24h executive turnaround.
                    </span>
                    <button
                      type="submit"
                      disabled={quoteSubmitting}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2B211B] px-6 text-xs font-semibold text-[#F8F6F2] shadow transition hover:bg-[#3D2F27] disabled:opacity-60"
                    >
                      <span>{quoteSubmitting ? "Transmitting..." : "Submit Quote Request"}</span>
                      <Send className="size-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 10. DIRECT CONTACT US SECTION                                         */}
      {/* -------------------------------------------------------------------- */}
      <section id="contact" className="border-b border-[#E5DCD1] bg-[#F1E9DD] py-20 lg:py-28">
        <div className={SHELL}>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold tracking-widest text-[#8B7766] uppercase">
                Direct Contact
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal text-[#2B211B] sm:text-5xl">
                Global Headquarters & Desks
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#8B7766]">
                Our executive offices coordinate global shipments, construction sites, and software engineering sprints
                across multiple time zones.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2B211B] text-[#F8F6F2]">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B211B] uppercase">Headquarters</h4>
                    <p className="mt-1 text-sm text-[#8B7766]">
                      Tower 4, Level 38, International Financial Centre, Dubai, UAE
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2B211B] text-[#F8F6F2]">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B211B] uppercase">Phone Lines</h4>
                    <p className="mt-1 text-sm text-[#8B7766]">{CONTACT_PHONE}</p>
                    <p className="text-xs text-[#8B7766]">Mon – Sat: 08:00 – 20:00 (GST)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2B211B] text-[#F8F6F2]">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#2B211B] uppercase">Commercial Inquiries</h4>
                    <p className="mt-1 text-sm text-[#8B7766]">{CONTACT_EMAIL}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="lg:col-span-7">
              <form
                onSubmit={handleContactSubmit}
                className="rounded-2xl border border-[#E5DCD1] bg-[#F8F6F2] p-6 sm:p-8"
              >
                <h3 className="font-serif text-xl font-bold text-[#2B211B]">
                  Send a Direct Message
                </h3>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-[#2B211B] uppercase">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2B211B] uppercase">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="jane@company.com"
                      className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-[#2B211B] uppercase">
                    Subject / Area of Interest *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="e.g. Bulk Commodity Procurement Inquiry"
                    className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-[#2B211B] uppercase">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe how our corporate services can support your requirements..."
                    className="mt-1.5 w-full rounded-lg border border-[#E5DCD1] bg-[#F8F6F2] px-3.5 py-2.5 text-sm text-[#2B211B] placeholder:text-[#8B7766]/60 focus:border-[#2B211B] focus:outline-none"
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#2B211B] px-7 text-xs font-semibold text-[#F8F6F2] shadow transition hover:bg-[#3D2F27] disabled:opacity-60"
                  >
                    <span>{contactSubmitting ? "Sending..." : "Send Message"}</span>
                    <Send className="size-3.5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* 11. LUXURY EDITORIAL FOOTER (MD ATTIRE AESTHETICS)                   */}
      {/* -------------------------------------------------------------------- */}
      <footer className="bg-[#2B211B] text-[#F8F6F2] py-16 lg:py-20">
        <div className={SHELL}>
          <div className="grid gap-12 lg:grid-cols-12 border-b border-[#3D2F27] pb-16">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-[#F8F6F2] text-[#2B211B]">
                  <span className="font-serif text-lg font-bold">M</span>
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-[#F8F6F2]">{COMPANY_NAME}</p>
                  <p className="text-xs text-[#D8C6B2]">{COMPANY_TAGLINE}</p>
                </div>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-[#D8C6B2]/80 max-w-sm">
                A unified multi-service corporate group offering authoritative execution across international trading,
                prime civil contracting, and bespoke software engineering.
              </p>
              <div className="mt-6 text-xs text-[#D8C6B2]">
                <p>Corporate Desk: {CONTACT_PHONE}</p>
                <p className="mt-1">Inquiries: {CONTACT_EMAIL}</p>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <h4 className="text-xs font-bold tracking-widest text-[#D8C6B2] uppercase">
                  1. Trading
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs text-[#F8F6F2]/75">
                  <li>General Trading</li>
                  <li>Import & Export</li>
                  <li>Product Sourcing</li>
                  <li>Supply & Distribution</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-widest text-[#D8C6B2] uppercase">
                  2. Contracting
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs text-[#F8F6F2]/75">
                  <li>General Contracting</li>
                  <li>Construction Services</li>
                  <li>Project Support</li>
                  <li>Maintenance Services</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-widest text-[#D8C6B2] uppercase">
                  3. IT Services
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs text-[#F8F6F2]/75">
                  <li>Website Development</li>
                  <li>Mobile App (iOS/Android)</li>
                  <li>UI/UX Design</li>
                  <li>AI Projects</li>
                  <li>Custom Software</li>
                  <li>Business Automation</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-widest text-[#D8C6B2] uppercase">
                  Governance
                </h4>
                <ul className="mt-4 space-y-2.5 text-xs text-[#F8F6F2]/75">
                  <li>About Us</li>
                  <li>Why Choose Us</li>
                  <li>Project Portfolio</li>
                  <li>ISO Compliance</li>
                  <li>Contact Us</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 flex flex-col justify-between gap-4 text-xs text-[#D8C6B2]/70 sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} {COMPANY_NAME}. All international rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer">Terms of Engagement</span>
              <span className="hover:text-white cursor-pointer">Compliance Statements</span>
            </div>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------------------------------- */}
      {/* 12. SERVICE DETAIL INTERACTIVE MODAL                                  */}
      {/* -------------------------------------------------------------------- */}
      {activeServiceModal && (
        <Dialog open={!!activeServiceModal} onOpenChange={() => setActiveServiceModal(null)}>
          <DialogContent className="max-w-3xl bg-[#F8F6F2] text-[#2B211B] border-[#E5DCD1]">
            <DialogHeader>
              <span className="text-[10px] font-bold tracking-widest text-[#8B7766] uppercase">
                {activeServiceModal.badge}
              </span>
              <DialogTitle className="font-serif text-3xl font-bold text-[#2B211B]">
                {activeServiceModal.title}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-[#8B7766] uppercase">
                {activeServiceModal.headline}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4">
              <div className="relative aspect-[16/7] w-full overflow-hidden rounded-xl border border-[#E5DCD1]">
                <img
                  src={activeServiceModal.image}
                  alt={activeServiceModal.title}
                  className="size-full object-cover"
                />
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#8B7766]">
                {activeServiceModal.fullDesc}
              </p>

              {/* Sub-services breakdown */}
              <div className="mt-6 border-t border-[#E5DCD1] pt-4">
                <h4 className="text-xs font-bold text-[#2B211B] uppercase tracking-wider">
                  Detailed Service Modules:
                </h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {activeServiceModal.subServices.map((sub) => {
                    const SubIcon = sub.icon;
                    return (
                      <div
                        key={sub.name}
                        className="rounded-lg border border-[#E5DCD1] bg-[#F1E9DD] p-3 text-xs"
                      >
                        <div className="flex items-center gap-2 font-bold text-[#2B211B]">
                          <SubIcon className="size-4" />
                          <span>{sub.name}</span>
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-[#8B7766]">
                          {sub.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Action */}
              <div className="mt-6 flex items-center justify-between border-t border-[#E5DCD1] pt-4">
                <button
                  onClick={() => setActiveServiceModal(null)}
                  className="text-xs font-semibold text-[#8B7766] hover:text-[#2B211B]"
                >
                  Close Window
                </button>
                <button
                  onClick={() => {
                    setQuoteForm((prev) => ({ ...prev, vertical: activeServiceModal.id }));
                    setActiveServiceModal(null);
                    setQuoteModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2B211B] px-5 py-2 text-xs font-semibold text-[#F8F6F2] hover:bg-[#3D2F27]"
                >
                  <span>Request Quote for {activeServiceModal.title}</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* 13. FLOATING GET A QUOTE MODAL (TRIGGERED BY ANY QUOTE BUTTON)       */}
      {/* -------------------------------------------------------------------- */}
      {quoteModalOpen && (
        <Dialog open={quoteModalOpen} onOpenChange={setQuoteModalOpen}>
          <DialogContent className="max-w-2xl bg-[#F8F6F2] text-[#2B211B] border-[#E5DCD1]">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl font-bold text-[#2B211B]">
                Request Commercial Proposal
              </DialogTitle>
              <DialogDescription className="text-xs text-[#8B7766]">
                Provide your requirements below and our commercial directors will compile a detailed estimate.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleQuoteSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-[#2B211B] uppercase">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="Marcus Vance"
                    className="mt-1 w-full rounded-lg border border-[#E5DCD1] bg-white px-3 py-2 text-xs text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2B211B] uppercase">Company / Entity *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.company}
                    onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                    placeholder="Vance Logistics Int."
                    className="mt-1 w-full rounded-lg border border-[#E5DCD1] bg-white px-3 py-2 text-xs text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2B211B] uppercase">Email *</label>
                  <input
                    type="email"
                    required
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    placeholder="m.vance@vance.com"
                    className="mt-1 w-full rounded-lg border border-[#E5DCD1] bg-white px-3 py-2 text-xs text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#2B211B] uppercase">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="+1 (555) 019-2831"
                    className="mt-1 w-full rounded-lg border border-[#E5DCD1] bg-white px-3 py-2 text-xs text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-bold text-[#2B211B] uppercase">Vertical *</label>
                  <select
                    value={quoteForm.vertical}
                    onChange={(e) => setQuoteForm({ ...quoteForm, vertical: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#E5DCD1] bg-white px-3 py-2 text-xs font-semibold text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                  >
                    <option value="trading">Trading Services</option>
                    <option value="contracting">Contracting Services</option>
                    <option value="it">IT & AI Services</option>
                    <option value="multi">Multi-Vertical Turnkey</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#2B211B] uppercase">Budget Range</label>
                  <select
                    value={quoteForm.budget}
                    onChange={(e) => setQuoteForm({ ...quoteForm, budget: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-[#E5DCD1] bg-white px-3 py-2 text-xs font-semibold text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                  >
                    <option value="$25k - $100k">$25,000 – $100,000</option>
                    <option value="$100k - $500k">$100,000 – $500,000</option>
                    <option value="$500k - $2M">$500,000 – $2,000,000</option>
                    <option value="$2M+">$2,000,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#2B211B] uppercase">Project Description *</label>
                <textarea
                  required
                  rows={3}
                  value={quoteForm.message}
                  onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                  placeholder="Provide scope, volume, timelines, or specifications..."
                  className="mt-1 w-full rounded-lg border border-[#E5DCD1] bg-white px-3 py-2 text-xs text-[#2B211B] focus:border-[#2B211B] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="text-xs font-semibold text-[#8B7766] hover:text-[#2B211B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quoteSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2B211B] px-6 py-2.5 text-xs font-semibold text-[#F8F6F2] hover:bg-[#3D2F27] disabled:opacity-50"
                >
                  <span>{quoteSubmitting ? "Submitting..." : "Send Request"}</span>
                  <Send className="size-3" />
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
