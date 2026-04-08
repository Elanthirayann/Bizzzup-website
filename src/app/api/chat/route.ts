import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/data/chatContext";
import { createRateLimiter } from "@/lib/rateLimit";

/* lazy-init so build succeeds without GOOGLE_API_KEY */
let _genAI: GoogleGenerativeAI | null = null;
function getGenAI() {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
  }
  return _genAI;
}

const isRateLimited = createRateLimiter(20, 60_000);

export async function POST(req: Request) {
  /* ─── rate limit ─── */
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Please wait a moment." },
      { status: 429 },
    );
  }

  /* ─── parse body ─── */
  let messages: { role: "user" | "assistant"; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages required" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  /* ─── stream from Gemini ─── */
  try {
    const model = getGenAI().getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    /* convert messages to Gemini format:
       OpenAI role "assistant" → Gemini role "model"
       each message needs a "parts" array */
    const geminiHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessageStream(lastMessage.content);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`),
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: err instanceof Error ? err.message : "Stream interrupted" })}\n\n`,
            ),
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Gemini API error:", err);
    return Response.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to connect to AI service",
      },
      { status: 500 },
    );
  }
}
