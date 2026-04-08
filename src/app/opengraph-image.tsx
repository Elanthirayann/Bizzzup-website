import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bizzzup AI Labs — Shaping the Future of AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#fafaf8",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Background gradient mesh */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 10% 50%, rgba(79,70,229,0.08) 0%, transparent 55%), " +
              "radial-gradient(ellipse at 85% 15%, rgba(13,148,136,0.07) 0%, transparent 50%), " +
              "radial-gradient(ellipse at 60% 90%, rgba(124,58,237,0.06) 0%, transparent 50%)",
            display: "flex",
          }}
        />

        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #4f46e5 0%, #0d9488 50%, #7c3aed 100%)",
            display: "flex",
          }}
        />

        {/* Grid dot pattern (top-right) */}
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 60,
            width: 280,
            height: 280,
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            opacity: 0.12,
          }}
        >
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "#4f46e5",
                display: "flex",
              }}
            />
          ))}
        </div>

        {/* Grid dot pattern (bottom-left) */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 60,
            width: 200,
            height: 160,
            display: "flex",
            flexWrap: "wrap",
            gap: 20,
            opacity: 0.08,
          }}
        >
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "#0d9488",
                display: "flex",
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 80px",
            height: "100%",
            position: "relative",
          }}
        >
          {/* Top: Brand badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            {/* Logo mark */}
            <div
              style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)",
                  display: "flex",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              Bizzzup AI Labs
            </span>
          </div>

          {/* Center: Main headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 820,
            }}
          >
            {/* Eyebrow label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 2,
                  background: "linear-gradient(90deg, #4f46e5, #0d9488)",
                  display: "flex",
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4f46e5",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                AI — Powered Production Systems
              </span>
            </div>

            {/* Main title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "#1a1a1a",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>Shaping the</span>
              <span
                style={{
                  background: "linear-gradient(135deg, #4f46e5 0%, #0d9488 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Future of AI
              </span>
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 20,
                color: "#5c5c5c",
                lineHeight: 1.5,
                margin: 0,
                maxWidth: 680,
                fontWeight: 400,
              }}
            >
              Multi-agent systems · RAG platforms · AI chatbots · Creative pipelines · Production automation
            </p>
          </div>

          {/* Bottom: Tags + location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Capability tags */}
            <div style={{ display: "flex", gap: 10 }}>
              {["Multi-Agent", "RAG", "Automation", "AI Chatbots"].map((tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "6px 16px",
                    background: "rgba(79,70,229,0.08)",
                    border: "1px solid rgba(79,70,229,0.15)",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#4f46e5",
                    display: "flex",
                    letterSpacing: "0.01em",
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>

            {/* Location */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#9a9a9a",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#0d9488",
                  display: "flex",
                }}
              />
              Chennai, India · bizzzup.com
            </div>
          </div>
        </div>

        {/* Right accent panel */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 6,
            background: "linear-gradient(180deg, #4f46e5 0%, #0d9488 50%, #7c3aed 100%)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
