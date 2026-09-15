import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const REVEAL_SELECTOR = ["main > section", "main > header", "main section article", "main section figure"].join(",");

/** Adds progressive motion to existing public sections without changing their layout. */
export function PublicMotion() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return;
    let observer: IntersectionObserver | undefined;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      // Wait until the complete route tree has hydrated before decorating its DOM.
      secondFrame = window.requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));

        elements.forEach((element, index) => {
          element.classList.add("section-reveal");
          element.style.setProperty("--reveal-delay", `${(index % 4) * 55}ms`);
        });

        if (reduceMotion) {
          elements.forEach((element) => element.classList.add("is-revealed"));
          return;
        }

        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              (entry.target as HTMLElement).classList.add("is-revealed");
              observer?.unobserve(entry.target);
            });
          },
          { rootMargin: "0px 0px -8%", threshold: 0.08 },
        );

        elements.forEach((element) => observer?.observe(element));
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}