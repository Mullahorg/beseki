import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function VehicleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const touchStart = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  useEffect(() => {
    document.body.style.overflow = fullscreen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [fullscreen]);

  return (
    <div>
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted md:aspect-[16/10]"
        onTouchStart={(e) => (touchStart.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          if (touchStart.current === null) return;
          const dx = (e.changedTouches[0]?.clientX ?? touchStart.current) - touchStart.current;
          if (Math.abs(dx) > 45) go(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <img
          src={images[index]}
          alt={`${alt} — photo ${index + 1} of ${images.length}`}
          width={1280}
          height={854}
          className="size-full object-cover"
        />
        {images.length > 1 ? (
          <>
            <GalleryButton side="left" onClick={() => go(-1)} label="Previous photo" />
            <GalleryButton side="right" onClick={() => go(1)} label="Next photo" />
          </>
        ) : null}
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          aria-label="View photo fullscreen"
          className="absolute bottom-3 right-3 flex size-10 items-center justify-center rounded-md bg-background/90 text-foreground transition-colors hover:bg-background"
        >
          <Expand className="size-4" aria-hidden="true" />
        </button>
        <span className="absolute bottom-3 left-3 rounded-md bg-ink/75 px-2 py-1 text-[11px] font-medium text-ink-foreground">
          {index + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-colors md:h-20 md:w-28",
                i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img src={src} alt="" loading="lazy" className="size-full object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {fullscreen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} photo viewer`}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95"
        >
          <div className="flex justify-end p-4">
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close photo viewer"
              className="flex size-10 items-center justify-center rounded-md text-ink-foreground hover:bg-ink-foreground/10"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-8">
            <img
              src={images[index]}
              alt={`${alt} — photo ${index + 1}`}
              className="max-h-full max-w-full object-contain"
            />
            {images.length > 1 ? (
              <>
                <GalleryButton side="left" onClick={() => go(-1)} label="Previous photo" dark />
                <GalleryButton side="right" onClick={() => go(1)} label="Next photo" dark />
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GalleryButton({
  side,
  onClick,
  label,
  dark = false,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
  dark?: boolean;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-md transition-colors",
        side === "left" ? "left-3" : "right-3",
        dark
          ? "bg-ink-foreground/10 text-ink-foreground hover:bg-ink-foreground/20"
          : "bg-background/90 text-foreground hover:bg-background",
      )}
    >
      <Icon className="size-5" aria-hidden="true" />
    </button>
  );
}
