import {
  Award,
  Bot,
  Building2,
  Code2,
  Cpu,
  Globe,
  HardHat,
  Fan,
  Laptop,
  ShieldCheck,
  Ship,
  Smartphone,
  Sparkles,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";

export const SITE_NAME = "aliyaabdullah.com";
/** Official registered company name — keep this exact spelling. */
export const COMPANY_NAME_AR = "مؤسسة علياء عبدالله بسيس الغامدي للتجارة";
export const SITE_TAGLINE = "Trading · Contracting · HVAC · IT & AI Services";
export const CONTACT_EMAIL = "info@aliyaabdullah.com";
export const CONTACT_PHONE = "+966 54 105 4608";
export const CONTACT_PHONE_HREF = "tel:+966541054608";
export const CONTACT_LOCATIONS = ["Makkah Al-Mukarramah", "Jeddah", "Al Baha"];
// Keeps each city on one line when the list wraps.
export const CONTACT_LOCATIONS_LINE = CONTACT_LOCATIONS.map((city) => city.replace(/ /g, "\u00A0")).join(" · ");
export const CONTACT_COUNTRY = "Saudi Arabia";

export const VERTICAL_LABELS: Record<string, string> = {
  trading: "Trading Services",
  contracting: "Contracting Services",
  it: "IT & AI Services",
  multi: "Multi-Vertical Turnkey",
  hvac: "HVAC Services",
};

export type ServiceVertical = "trading" | "contracting" | "hvac" | "it";

export interface SubService {
  name: string;
  tagline: string;
  description: string;
  icon: typeof Ship;
  highlights: string[];
}

export interface ServiceCardData {
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

export const SERVICE_VERTICALS: ServiceCardData[] = [
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
      "Turnkey general contracting, commercial construction, and civil engineering support for projects delivered with clear scope and site coordination.",
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
    id: "hvac",
    badge: "VERTICAL 03 / HVAC",
    title: "HVAC Services",
    headline: "Air-conditioning installation, repair & maintenance",
    shortDesc:
      "New air-conditioning installations and complete service for existing systems, including repairs, fault diagnosis and preventive HVAC maintenance across residential, commercial and industrial properties.",
    fullDesc:
      "Our HVAC department supports new and existing air-conditioning systems of all types, from installation and commissioning to diagnosis, repair, regular servicing and preventive maintenance.",
    image: "/images/service-contracting.jpg",
    icon: Fan,
    metrics: [
      { label: "AC System Types", value: "All types" },
      { label: "New Installations", value: "Available" },
      { label: "Maintenance", value: "Preventive" },
    ],
    subServices: [
      {
        name: "AC Installation & HVAC Maintenance",
        tagline: "New systems, repairs and ongoing care",
        description:
          "Installation, servicing, fault diagnosis, repairs and preventive HVAC maintenance for new and existing air-conditioning systems across residential, commercial and industrial properties.",
        icon: Fan,
        highlights: ["All AC system types", "New installations & repairs", "Preventive maintenance"],
      },
    ],
  },
  {
    id: "it",
    badge: "VERTICAL 04 / TECHNOLOGY",
    title: "IT & AI Services",
    headline: "Custom Software, Mobile Apps & Enterprise AI",
    shortDesc:
      "Websites, mobile apps, ERP platforms and custom software built around the way your business works, including live hospitality systems.",
    fullDesc:
      "We design and build websites, mobile apps, ERP platforms and custom software. Our hospitality work includes a dynamic QR menu system that lets teams update table menus centrally and publish changes to guests in real time.",
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

export const CASE_STUDIES = [
  {
    category: "it",
    tag: "Hospitality Technology · Dynamic QR",
    title: "Live QR Menu & Hospitality Management System",
    desc: "A full-stack platform for creating and assigning live menus to restaurant tables. Guests scan a permanent table QR code to browse an interactive menu with search, allergen filters and dietary badges. Staff can update dishes, prices or menus in the admin workspace, with changes appearing to guests without reprinting QR codes or refreshing their screens.",
    image: "/images/service-it.jpg",
    metrics: [
      { label: "QR Codes", val: "Permanent" },
      { label: "Menu Updates", val: "Live" },
      { label: "Guest Access", val: "Mobile" },
    ],
    timeline: "Live demo",
    demoUrl: "https://qr-menu-demo-9vhn.onrender.com/",
    adminDemoUrl: "https://qr-menu-demo-9vhn.onrender.com/?demo=admin",
  },
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

export const WHY_CHOOSE_US_POINTS = [
  {
    number: "01",
    title: "Single-Point Corporate Accountability",
    desc: "Unlike fragmented subcontractors who point fingers when friction occurs, we own the entire lifecycle—procuring materials, constructing facilities, and automating software.",
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
