import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Link-preview image for LinkedIn and X, generated at build time.
export const alt = "Xplormate: AI agents for manufacturing operations.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = `data:image/jpeg;base64,${(await readFile(join(process.cwd(), "public", "xplormate-logo.jpg"))).toString("base64")}`;
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
          <img src={logo} width={54} height={54} alt="" style={{ borderRadius: 12, marginRight: 16 }} />
          <span>Xplormate</span>
          <span style={{ color: "#ffb629", marginLeft: -2 }}>.</span>
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
