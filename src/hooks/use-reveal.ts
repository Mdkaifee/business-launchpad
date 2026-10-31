import { useEffect } from "react";

/**
 * Fades/slides in every element marked `data-reveal` as it scrolls into view.
 * Elements added later (tab or filter changes) are picked up automatically.
 */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    const observeAll = (scope: ParentNode) => {
      scope.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((el) => observer.observe(el));
    };

    observeAll(document);
    root.classList.add("reveal-ready");

    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.matches("[data-reveal]")) observer.observe(node);
          observeAll(node);
        });
      }
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
      root.classList.remove("reveal-ready");
    };
  }, []);
}
