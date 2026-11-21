import { ImageResponse } from "next/og";

// Link-preview image for LinkedIn and X, generated at build time.
export const alt = "Xplormate: AI agents for manufacturing operations.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0a0d0c 0%, #101513 60%, #2a2110 100%)",
          color: "#f5f4ed",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
          <div
            style={{
              display: "flex",
              width: 54,
              height: 54,
              borderRadius: 12,
              background: "#000",
              border: "1px solid rgba(255,255,255,.2)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              marginRight: 16,
            }}
          >
            X
          </div>
          <span>Xplormate</span>
          <span style={{ color: "#ffb629" }}>.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 74, fontWeight: 700, lineHeight: 1.04, letterSpacing: -3 }}>
          <span>AI agents for</span>
          <div style={{ display: "flex" }}>
            <span style={{ color: "#ffb629" }}>manufacturing</span>
            <span>&nbsp;operations.</span>
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 2, color: "#c9cec8" }}>
          MATERIALS · QUALITY · MAINTENANCE · PRODUCTION · REPORTING
        </div>
      </div>
    ),
    { ...size },
  );
}
