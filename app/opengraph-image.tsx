import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PDF Smart Hub - أدوات PDF مجانية";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(147,197,253,0.15)", display: "flex" }} />
        <div style={{ position: "absolute", bottom: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(96,165,250,0.12)", display: "flex" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 18,
            background: "rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[1, 0.8, 0.6].map((op, i) => (
                <div key={i} style={{ width: 36, height: 5, borderRadius: 3, background: `rgba(255,255,255,${op})` }} />
              ))}
            </div>
          </div>
          <span style={{ color: "white", fontSize: 52, fontWeight: "bold" }}>PDF Smart Hub</span>
        </div>

        {/* Subtitle */}
        <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 36, marginBottom: 48 }}>
          أدوات PDF مجانية وذكية
        </div>

        {/* Tool badges */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {["ضغط PDF", "دمج PDF", "تقسيم PDF", "OCR نصوص", "تحويل Word", "علامة مائية"].map((tool) => (
            <div
              key={tool}
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                padding: "10px 24px",
                borderRadius: 24,
                fontSize: 20,
                display: "flex",
              }}
            >
              {tool}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 24, marginTop: 48 }}>
          www.pdfsmarthub.com
        </div>
      </div>
    ),
    { ...size }
  );
}
