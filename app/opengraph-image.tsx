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
          {/* Logo: mark + wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            {/* BSO logo mark — white fill */}
            <svg
              width="48"
              height="48"
              viewBox="0 0 268 268"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M267.18 133.339C267.18 157.332 260.58 176.783 256.42 176.783C252.26 176.783 252.116 157.332 252.116 133.339C252.116 109.345 252.26 89.8948 256.42 89.8948C260.58 89.8948 267.18 109.345 267.18 133.339Z" fill="#FDFBF4"/>
              <path d="M233.305 134.008C233.305 183.194 228.15 223.068 225.773 223.068C223.396 223.068 224.697 183.194 224.697 134.008C224.697 84.8212 223.396 44.9476 225.773 44.9476C228.15 44.9476 233.305 84.8212 233.305 134.008Z" fill="#FDFBF4"/>
              <path d="M201.543 133.5C201.543 197.683 197.464 249.713 195.087 249.713C192.71 249.713 192.935 197.683 192.935 133.5C192.935 69.3177 192.71 17.2875 195.087 17.2875C197.464 17.2875 201.543 69.3177 201.543 133.5Z" fill="#FDFBF4"/>
              <ellipse cx="159.024" cy="133.59" rx="11.8362" ry="133.59" fill="#FDFBF4"/>
              <path d="M128.375 133.313C128.375 204.393 125.569 262.015 116.06 262.015C106.552 262.015 93.9422 204.393 93.9422 133.313C93.9422 62.2321 106.552 4.60986 116.06 4.60986C125.569 4.60986 128.375 62.2321 128.375 133.313Z" fill="#FDFBF4"/>
              <path d="M75.3212 133.754C75.3212 190.438 70.2526 236.39 49.1561 236.39C28.0596 236.39 0 190.438 0 133.754C0 77.0693 28.0596 31.1174 49.1561 31.1174C70.2526 31.1174 75.3212 77.0693 75.3212 133.754Z" fill="#FDFBF4"/>
            </svg>
            <div
              style={{
                display: "flex",
                color: "#FDFBF4",
                fontFamily: "GTEestiPro",
                fontSize: 28,
                fontWeight: 700,
                letterSpacing: "-0.01em",
              }}
            >
              Backspace Oddity
            </div>
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
