import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { submitForm } from "@/lib/submit-form";
import { VERTICAL_LABELS } from "./data";
import { fieldClass, honeypotClass, labelClass, primaryButtonClass } from "./form-styles";

export interface QuoteFormValues {
  name: string;
  company: string;
  email: string;
  phone: string;
  vertical: string;
  timeline: string;
  budget: string;
  message: string;
}

export const EMPTY_QUOTE: QuoteFormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  vertical: "trading",
  timeline: "1-3 months",
  budget: "$100k - $500k",
  message: "",
};

const TIMELINES: Record<string, string> = {
  immediate: "Immediate (< 30 days)",
  "1-3 months": "1 – 3 months",
  "3-6 months": "3 – 6 months",
  planning: "Long-term planning",
};

const BUDGETS: Record<string, string> = {
  "$25k - $100k": "$25,000 – $100,000",
  "$100k - $500k": "$100,000 – $500,000",
  "$500k - $2M": "$500,000 – $2,000,000",
  "$2M+": "$2,000,000+",
};

interface QuoteFormProps {
  values: QuoteFormValues;
  onChange: (values: QuoteFormValues) => void;
  idPrefix: string;
  onSent?: () => void;
}

export function QuoteForm({ values, onChange, idPrefix, onSent }: QuoteFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const set = (key: keyof QuoteFormValues) => (e: { target: { value: string } }) =>
    onChange({ ...values, [key]: e.target.value });
  const id = (name: string) => `${idPrefix}-${name}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitForm({
        form_type: "quote",
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        subject: `Quote request — ${VERTICAL_LABELS[values.vertical] ?? values.vertical}`,
        message: values.message,
        details: {
          Service: VERTICAL_LABELS[values.vertical] ?? values.vertical,
          Timeline: TIMELINES[values.timeline] ?? values.timeline,
          Budget: BUDGETS[values.budget] ?? values.budget,
        },
        website: honeypot,
      });
      toast.success("Quote request sent", {
        description: `Thank you, ${values.name}. We'll get back to you within 24 hours.`,
      });
      onChange(EMPTY_QUOTE);
      onSent?.();
    } catch (err) {
      toast.error("Your request wasn't sent", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4">
      <div className={honeypotClass} aria-hidden="true">
        <label htmlFor={id("website")}>Website</label>
        <input
          id={id("website")}
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={labelClass}>
            Full name *
          </label>
          <input id={id("name")} required maxLength={120} value={values.name} onChange={set("name")} placeholder="Your full name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={id("company")} className={labelClass}>
            Company *
          </label>
          <input id={id("company")} required maxLength={160} value={values.company} onChange={set("company")} placeholder="Company name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={id("email")} className={labelClass}>
            Email *
          </label>
          <input id={id("email")} type="email" required maxLength={200} value={values.email} onChange={set("email")} placeholder="you@company.com" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={id("phone")} className={labelClass}>
            Phone *
          </label>
          <input id={id("phone")} type="tel" required maxLength={40} value={values.phone} onChange={set("phone")} placeholder="+966 5X XXX XXXX" className={fieldClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={id("vertical")} className={labelClass}>
            Service
          </label>
          <select id={id("vertical")} value={values.vertical} onChange={set("vertical")} className={fieldClass}>
            {Object.entries(VERTICAL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("timeline")} className={labelClass}>
            Timeline
          </label>
          <select id={id("timeline")} value={values.timeline} onChange={set("timeline")} className={fieldClass}>
            {Object.entries(TIMELINES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={id("budget")} className={labelClass}>
            Budget
          </label>
          <select id={id("budget")} value={values.budget} onChange={set("budget")} className={fieldClass}>
            {Object.entries(BUDGETS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={id("message")} className={labelClass}>
          Project brief *
        </label>
        <textarea
          id={id("message")}
          required
          rows={4}
          maxLength={5000}
          value={values.message}
          onChange={set("message")}
          placeholder="Volumes, delivery destination, drawings, or software scope…"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col-reverse items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs text-muted-foreground">We reply within 24 hours. Your details stay private.</span>
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 transition-transform group-hover:translate-x-0.5" />}
          <span>{submitting ? "Sending…" : "Send quote request"}</span>
        </button>
      </div>
    </form>
  );
}
