// Every form on the site posts to the single backend endpoint (FastAPI on Render),
// which emails the submission to the site owner's inbox.

export type FormType = "quote" | "contact";

export interface FormPayload {
  form_type: FormType;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  details?: Record<string, string>;
  /** Honeypot — real visitors never fill it. */
  website?: string;
}

const REQUEST_TIMEOUT_MS = 60_000; // Render free instances can take ~50s to wake up.

export function getSubmitUrl(): string | null {
  const base = (import.meta.env["VITE_API_URL"] as string | undefined)?.trim();
  if (!base) return null;
  return `${base.replace(/\/+$/, "")}/api/submit`;
}

export async function submitForm(payload: FormPayload): Promise<void> {
  const url = getSubmitUrl();
  if (!url) {
    throw new Error("The form service isn't connected yet. Please email us directly.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, page: typeof window !== "undefined" ? window.location.href : undefined }),
      signal: controller.signal,
    });
  } catch {
    throw new Error("We couldn't reach our server. Check your connection and try again.");
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let detail: unknown;
    try {
      detail = ((await response.json()) as { detail?: unknown }).detail;
    } catch {
      detail = undefined;
    }
    if (response.status === 422) throw new Error("Please check your details — one of the fields looks invalid.");
    if (response.status === 429) throw new Error("Too many messages in a short time. Please try again in a few minutes.");
    throw new Error(typeof detail === "string" ? detail : "We couldn't send your message. Please try again.");
  }
}
