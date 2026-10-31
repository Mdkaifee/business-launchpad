import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { submitForm } from "@/lib/submit-form";
import { fieldClass, honeypotClass, labelClass, primaryButtonClass } from "./form-styles";

const EMPTY = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const set = (key: keyof typeof EMPTY) => (e: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitForm({ form_type: "contact", ...values, website: honeypot });
      toast.success("Message sent", { description: "Thank you — we'll reply shortly." });
      setValues(EMPTY);
    } catch (err) {
      toast.error("Your message wasn't sent", {
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-4">
      <div className={honeypotClass} aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Your name *
          </label>
          <input id="contact-name" required maxLength={120} value={values.name} onChange={set("name")} placeholder="Your full name" className={fieldClass} />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email *
          </label>
          <input id="contact-email" type="email" required maxLength={200} value={values.email} onChange={set("email")} placeholder="you@company.com" className={fieldClass} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject *
        </label>
        <input id="contact-subject" required maxLength={200} value={values.subject} onChange={set("subject")} placeholder="What can we help with?" className={fieldClass} />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message *
        </label>
        <textarea id="contact-message" required rows={5} maxLength={5000} value={values.message} onChange={set("message")} placeholder="Tell us a little about your requirements…" className={fieldClass} />
      </div>
      <div className="flex justify-end pt-2">
        <button type="submit" disabled={submitting} className={primaryButtonClass}>
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 transition-transform group-hover:translate-x-0.5" />}
          <span>{submitting ? "Sending…" : "Send message"}</span>
        </button>
      </div>
    </form>
  );
}
