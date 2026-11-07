import { useEffect, useState } from "react";
import { ArrowUp, Languages } from "lucide-react";

/** Floating button bottom-right that appears near the bottom of the page. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-20 right-5 z-50 flex size-12 items-center justify-center rounded-full bg-emerald text-accent-foreground shadow-glow transition duration-300 hover:bg-emerald-deep ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <ArrowUp className="size-5" />
    </button>
  );
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

function currentLang(): "en" | "ar" {
  return /googtrans=\/en\/ar/.test(document.cookie) ? "ar" : "en";
}

/** English / Arabic switch using Google's page translation; flips layout right-to-left for Arabic. */
export function LanguageSwitcher() {
  const [lang, setLang] = useState<"en" | "ar">("en");

  useEffect(() => {
    const l = currentLang();
    setLang(l);
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = l;
    if (l === "ar" && !document.getElementById("gt-script")) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({ pageLanguage: "en", includedLanguages: "ar,en", autoDisplay: false }, "gt-el");
      };
      const s = document.createElement("script");
      s.id = "gt-script";
      s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    }
  }, []);

  const change = (next: "en" | "ar") => {
    const host = window.location.hostname;
    const val = next === "ar" ? "/en/ar" : "";
    const exp = next === "ar" ? "" : "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = `googtrans=${val}; path=/${exp}`;
    document.cookie = `googtrans=${val}; path=/; domain=.${host}${exp}`;
    window.location.reload();
  };

  return (
    <label className="notranslate relative flex h-11 items-center gap-1.5 rounded-xl border border-ink-border bg-ink-soft/70 pl-3 pr-2 text-ink-foreground backdrop-blur">
      <Languages className="size-4 text-emerald-light" />
      <select
        aria-label="Language"
        value={lang}
        onChange={(e) => change(e.target.value as "en" | "ar")}
        className="cursor-pointer appearance-none bg-transparent pr-1 text-xs font-semibold outline-none"
      >
        <option value="en" className="bg-ink">EN</option>
        <option value="ar" className="bg-ink">العربية</option>
      </select>
      <div id="gt-el" className="hidden" />
    </label>
  );
}
