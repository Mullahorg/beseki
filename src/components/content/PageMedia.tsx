import { useState } from "react";
import { ImageOff } from "lucide-react";
import { mediaSrcSet, mediaUrl } from "@/lib/media";
import { usePublicPage } from "@/lib/site-context";
import { cn } from "@/lib/utils";

export function PageMedia({
  slug,
  className,
  imageClassName,
  fallback,
}: {
  slug: string;
  className?: string;
  imageClassName?: string;
  fallback?: React.ReactNode;
}) {
  const page = usePublicPage(slug);
  const [failed, setFailed] = useState(false);

  if (!page?.imagePath || failed) {
    return fallback ?? (
      <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
        <ImageOff className="size-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden bg-muted", className)}>
      <img
        src={mediaUrl(page.imagePath, "large")}
        srcSet={mediaSrcSet(page.imagePath)}
        sizes="(min-width: 1024px) 44vw, 100vw"
        alt={page.imageAlt || page.title}
        onError={() => setFailed(true)}
        className={cn("size-full object-cover", imageClassName)}
      />
    </div>
  );
}