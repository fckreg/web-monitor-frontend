import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

import { SITE_DESCRIPTION, SITE_NAME } from "@/shared/config";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

const OG_BARS = [
  { id: "b0", opacity: 1 },
  { id: "b1", opacity: 1 },
  { id: "b2", opacity: 1 },
  { id: "b3", opacity: 0.5 },
  { id: "b4", opacity: 1 },
  { id: "b5", opacity: 1 },
  { id: "b6", opacity: 1 },
] as const;

const FONT_DIR = join(process.cwd(), "node_modules/@fontsource/geologica/files");

// Satori не читает woff2, а без явного шрифта не рисует кириллицу.
async function readFonts() {
  "use cache";
  cacheLife("max");
  const files = ["cyrillic", "latin"].map((subset) =>
    readFile(join(FONT_DIR, `geologica-${subset}-300-normal.woff`), "base64"),
  );

  return Promise.all(files);
}

async function loadFonts() {
  return (await readFonts()).map((encoded) => ({
    name: "Geologica",
    data: Uint8Array.from(Buffer.from(encoded, "base64")).buffer,
    weight: 300 as const,
    style: "normal" as const,
  }));
}

export async function siteImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#10211e",
        color: "#ffffff",
        fontFamily: "Geologica",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {OG_BARS.map((bar) => (
          <div
            key={bar.id}
            style={{
              width: 28,
              height: 72,
              borderRadius: 8,
              background: bar.opacity === 1 ? "#18764b" : "#b84d46",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 112, letterSpacing: "-0.04em" }}>{SITE_NAME}</div>
        <div
          style={{
            fontSize: 36,
            lineHeight: 1.3,
            color: "rgb(255 255 255 / 0.84)",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    </div>,
    { ...OG_IMAGE_SIZE, fonts: await loadFonts() },
  );
}
