// Cloudflare Pages Function -> handles POST /api/book (the booking form).
// Sends each lead to the owner's inbox via the Resend API.
//
// Set these in Cloudflare Pages -> your project -> Settings -> Variables and Secrets:
//   RESEND_API_KEY   (secret)  your Resend API key
//   LEAD_TO_EMAIL    (var)     inbox that receives leads, e.g. info@skywyo.com
//   LEAD_FROM_EMAIL  (var)     a Resend-verified sender, e.g. leads@skywyo.com
//
// Runs only on Cloudflare (the local `astro build` ignores this folder).

interface Env {
  RESEND_API_KEY: string;
  LEAD_TO_EMAIL: string;
  LEAD_FROM_EMAIL: string;
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let data: Record<string, string>;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const name = (data.name || "").trim();
  const contact = (data.contact || "").trim();
  const address = (data.address || "").trim();
  const honeypot = (data.company || "").trim(); // bots fill hidden fields

  if (honeypot) return json({ ok: true }, 200); // silently drop bots
  if (!name || !contact || !address) {
    return json({ ok: false, error: "Please fill in every field." }, 400);
  }
  if (!env.RESEND_API_KEY || !env.LEAD_TO_EMAIL || !env.LEAD_FROM_EMAIL) {
    return json({ ok: false, error: "Email is not configured yet." }, 500);
  }

  const looksLikeEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `SkyWyo Booking <${env.LEAD_FROM_EMAIL}>`,
      to: [env.LEAD_TO_EMAIL],
      ...(looksLikeEmail ? { reply_to: contact } : {}),
      subject: `New shoot request: ${name}`,
      text: [
        "New booking request from skywyo.com",
        "",
        `Name: ${name}`,
        `Contact: ${contact}`,
        `Listing address / area: ${address}`,
      ].join("\n"),
    }),
  });

  if (!res.ok) {
    return json({ ok: false, error: "Could not send right now. Please try again." }, 502);
  }

  return json({ ok: true }, 200);
};
