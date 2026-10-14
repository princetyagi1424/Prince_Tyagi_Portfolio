/**
 * Open Graph / social share image.
 * GET /api/og-image.jpg
 * Serves a JPEG so WhatsApp, LinkedIn, and X can render link previews.
 * Uses the existing public portrait (absolute URL) so the binary need not live in this function.
 */
export async function onRequestGet(): Promise<Response> {
  try {
    const upstream = await fetch(
      "https://prince-tyagi-portfolio.pages.dev/prince-tyagi.jpg",
      { cf: { cacheTtl: 86400, cacheEverything: true } } as RequestInit
    );
    if (!upstream.ok) {
      return new Response("OG image unavailable", { status: 502 });
    }
    const bytes = await upstream.arrayBuffer();
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("OG image fetch failed", { status: 502 });
  }
}

export const onRequest = onRequestGet;
