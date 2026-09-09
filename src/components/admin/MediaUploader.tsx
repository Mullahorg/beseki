import { useRef, useState } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { uploadMedia, type MediaCategory, type MediaRecord } from "@/lib/media";
import { cn } from "@/lib/utils";

/** Multi-file upload with drag & drop and real per-file progress. */
export function MediaUploader({
  category,
  onUploaded,
  compact = false,
}: {
  category: MediaCategory;
  onUploaded: (records: MediaRecord[]) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [dragging, setDragging] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setBusy(true);
    setTotal(list.length);
    setDone(0);
    const uploaded: MediaRecord[] = [];
    const failed: string[] = [];

    for (const file of list) {
      try {
        uploaded.push(await uploadMedia(file, { category }));
      } catch (err) {
        failed.push(file.name);
        console.error(err);
      }
      setDone((d) => d + 1);
    }

    setBusy(false);
    if (uploaded.length) {
      toast.success(`${uploaded.length} photo${uploaded.length === 1 ? "" : "s"} uploaded`);
      onUploaded(uploaded);
    }
    if (failed.length) {
      toast.error("Some photos did not upload", { description: failed.join(", ") });
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card text-center transition-colors",
          compact ? "p-5" : "p-10",
          dragging ? "border-primary bg-primary/5" : "border-border",
        )}
      >
        <UploadCloud className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="mt-2 text-sm font-medium">Drag photos here, or choose files</p>
        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG or WebP · up to 25 MB each · category: {category}</p>
        <Button type="button" variant="outline" className="mt-4" onClick={() => inputRef.current?.click()} disabled={busy}>
          {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
          {busy ? `Uploading ${done}/${total}` : "Choose files"}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {busy && total > 0 ? <Progress value={(done / total) * 100} className="mt-3" /> : null}
    </div>
  );
}
