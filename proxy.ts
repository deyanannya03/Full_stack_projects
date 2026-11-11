// proxy.ts
import arcjet, { detectBot, shield } from "@arcjet/next";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

if (!process.env.ARCJET_KEY) throw new Error("ARCJET_KEY is not set");

// Runs on every request. Allows search engines and link previews so the
// landing page gets indexed and Slack/Twitter unfurls work.
const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:PREVIEW"],
    }),
  ],
});

// clerkMiddleware must stay in place so auth() works in layouts and routes.
export default clerkMiddleware(async (_auth, req) => {
  // Webhooks verify themselves with signatures, so skip bot detection.
  if (req.nextUrl.pathname.startsWith("/api/webhooks")) {
    return NextResponse.next();
  }

  const decision = await aj.protect(req);

  if (decision.isErrored()) {
    console.error("Arcjet error:", decision.reason); // fails open on purpose
  }

  if (decision.isDenied()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};