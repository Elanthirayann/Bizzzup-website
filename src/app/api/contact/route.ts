import { createRateLimiter } from "@/lib/rateLimit";

const RESEND_API_URL = "https://api.resend.com/emails";
const TO_EMAIL = "hello@bizzzup.com";

const isRateLimited = createRateLimiter(5, 60_000);

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 }
    );
  }

  let name: string, email: string, subject: string, message: string;
  try {
    const body = await req.json();
    name = String(body.name || "").trim();
    email = String(body.email || "").trim();
    subject = String(body.subject || "").trim();
    message = String(body.message || "").trim();
    if (!name || !email || !message) {
      return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set.");
    return Response.json({ error: "Email service is not configured." }, { status: 503 });
  }

  const emailSubject = subject
    ? `[Bizzzup Contact] ${subject}`
    : `[Bizzzup Contact] New message from ${name}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; color: #1a1a1a;">
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 4px;">New Contact Message</h2>
      <p style="font-size: 13px; color: #9a9a9a; margin-bottom: 24px;">Received via bizzzup.com</p>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e6e1; font-size: 13px; color: #5c5c5c; width: 80px;">From</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e6e1; font-size: 14px; font-weight: 500;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e6e1; font-size: 13px; color: #5c5c5c;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e6e1; font-size: 14px;">
            <a href="mailto:${escapeHtml(email)}" style="color: #4f46e5;">${escapeHtml(email)}</a>
          </td>
        </tr>
        ${subject ? `<tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e6e1; font-size: 13px; color: #5c5c5c;">Subject</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #e8e6e1; font-size: 14px;">${escapeHtml(subject)}</td>
        </tr>` : ""}
      </table>

      <div style="background: #f5f4f0; border-radius: 8px; padding: 20px;">
        <p style="font-size: 13px; color: #5c5c5c; margin-bottom: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Message</p>
        <p style="font-size: 15px; line-height: 1.7; white-space: pre-wrap; margin: 0;">${escapeHtml(message)}</p>
      </div>

      <p style="margin-top: 32px; font-size: 12px; color: #9a9a9a;">
        Reply directly to this email to respond to ${escapeHtml(name)}.
      </p>
    </div>
  `;

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Bizzzup Contact <contact@bizzzup.com>",
        to: [TO_EMAIL],
        reply_to: email,
        subject: emailSubject,
        html,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.error("Resend error:", data);
      return Response.json({ error: "Failed to send email. Please try again." }, { status: 502 });
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return Response.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
