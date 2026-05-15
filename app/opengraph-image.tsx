import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "GTM strategy is not a set of tactics across channels";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fontBold = readFileSync(
    join(process.cwd(), "public/fonts/GTEestiProDisplay-Bold.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          // Approximate the hero gradient: dark green base + green + purple orbs
          background:
            "radial-gradient(ellipse at 10% 90%, rgba(34,197,94,0.75) 0%, transparent 55%), " +
            "radial-gradient(ellipse at 90% 10%, rgba(124,58,237,0.65) 0%, transparent 50%), " +
            "radial-gradient(ellipse at 55% 55%, rgba(22,163,74,0.25) 0%, transparent 40%), " +
            "#011C00",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            width: "100%",
          }}
        >
          {/* Logo label */}
          <div
            style={{
              display: "flex",
              color: "#FDFBF4",
              fontFamily: "GTEestiPro",
              fontSize: 22,
              opacity: 0.85,
            }}
          >
            Backspace Oddity
          </div>

          {/* Headline */}
          <div
            style={{
              color: "#FDFBF4",
              fontFamily: "GTEestiPro",
              fontWeight: 700,
              fontSize: 74,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            GTM strategy is not a set of tactics across channels
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "GTEestiPro",
          data: fontBold.buffer,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
