// ─── Types ────────────────────────────────────────────────────────────────────

interface ChallengeBody {
  challenge: string;
  subscription: { id: string; type: string; status: string };
}

interface NotificationBody {
  subscription: { id: string; type: string };
  event: Record<string, unknown>;
}

interface RevocationBody {
  subscription: { id: string; type: string; status: string };
}

type MessageType =
  | "webhook_callback_verification"
  | "notification"
  | "revocation";

// ─── HMAC Verification ────────────────────────────────────────────────────────

async function verifySignature(
  secret: string,
  messageId: string,
  timestamp: string,
  rawBody: string,
  expectedSignature: string,
): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const buf = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(messageId + timestamp + rawBody),
  );
  const hex = Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `sha256=${hex}` === expectedSignature;
}

// ─── Request Handler ──────────────────────────────────────────────────────────

async function handleRequest(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);

  if (req.method === "GET" && pathname === "/health") {
    return Response.json({ ok: true });
  }

  if (req.method === "POST" && pathname === "/webhook") {
    const secret = process.env.TWITCH_WEBHOOK_SECRET;
    if (!secret) {
      console.error("[webhook] TWITCH_WEBHOOK_SECRET not set");
      return new Response("Server misconfiguration", { status: 500 });
    }

    const messageId = req.headers.get("Twitch-Eventsub-Message-Id") ?? "";
    const timestamp = req.headers.get("Twitch-Eventsub-Message-Timestamp") ??
      "";
    const signature = req.headers.get("Twitch-Eventsub-Message-Signature") ??
      "";
    const messageType = req.headers.get("Twitch-Eventsub-Message-Type") as
      | MessageType
      | null;

    // Read raw body before parsing — HMAC is over the raw bytes
    const rawBody = await req.text();

    if (
      !(await verifySignature(secret, messageId, timestamp, rawBody, signature))
    ) {
      console.warn("[webhook] Invalid signature — rejecting");
      return new Response("Forbidden", { status: 403 });
    }

    switch (messageType) {
      case "webhook_callback_verification": {
        const { challenge, subscription } = JSON.parse(
          rawBody,
        ) as ChallengeBody;
        console.log(
          `[webhook] Challenge for subscription ${subscription.id} (${subscription.type})`,
        );
        return new Response(challenge, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }
      case "notification": {
        const body = JSON.parse(rawBody) as NotificationBody;
        console.log(`[webhook] ${body.subscription.type}`, body.event);
        return new Response(null, { status: 204 });
      }
      case "revocation": {
        const { subscription } = JSON.parse(rawBody) as RevocationBody;
        console.log(
          `[webhook] Revoked — ${subscription.id} (${subscription.status})`,
        );
        return new Response(null, { status: 204 });
      }
      default:
        console.warn(`[webhook] Unknown message type: ${messageType}`);
        return new Response("Bad Request", { status: 400 });
    }
  }

  return new Response("Not Found", { status: 404 });
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = Bun.serve({
  port: Number(process.env.PORT) || 3000,
  fetch: handleRequest,
});

console.log(`[server] Listening on http://localhost:${server.port}`);
