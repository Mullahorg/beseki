import { createFileRoute } from "@tanstack/react-router";

/**
 * Public image passthrough.
 *
 * The storage bucket is private, so files are streamed through this route
 * instead of being exposed directly. Only files that are recorded in the
 * media library are served — anything else (customer documents, uploads that
 * are not part of the website) returns 404.
 */
export const Route = createFileRoute("/api/public/media/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const path = (params as { _splat?: string })._splat ?? "";
        if (!path || path.includes("..")) return new Response("Not found", { status: 404 });

        const url = process.env["SUPABASE_URL"];
        const serviceKey = process.env["SUPABASE_SERVICE_ROLE_KEY"];
        if (!url || !serviceKey) return new Response("Not configured", { status: 500 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: record } = await supabaseAdmin
          .from("media")
          .select("id,mime_type")
          .eq("bucket", "media")
          .eq("path", path)
          .maybeSingle();
        if (!record) return new Response("Not found", { status: 404 });

        const requested = Number(new URL(request.url).searchParams.get("w"));
        const mime = record.mime_type ?? "";
        // SVG, GIF and non-image files are streamed as-is; the rest can be resized.
        const transformable = /^image\/(jpeg|png|webp|avif)$/.test(mime);
        const width = transformable && [160, 640, 1024, 1600].includes(requested) ? requested : null;

        const original = `${url}/storage/v1/object/authenticated/media/${path}`;
        const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` };

        let upstream: Response | null = null;
        if (width) {
          const resized = await fetch(
            `${url}/storage/v1/render/image/authenticated/media/${path}?width=${width}&resize=contain&quality=78`,
            { headers },
          );
          if (resized.ok && resized.body) upstream = resized;
        }
        // Fall back to the stored file whenever resizing is unavailable.
        if (!upstream) upstream = await fetch(original, { headers });
        if (!upstream.ok || !upstream.body) return new Response("Not found", { status: 404 });

        return new Response(upstream.body, {
          status: 200,
          headers: {
            "Content-Type": upstream.headers.get("content-type") ?? (mime || "application/octet-stream"),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });

      },
    },
  },
});
