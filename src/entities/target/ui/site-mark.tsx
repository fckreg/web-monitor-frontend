"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib";

function paintsPixels(node: HTMLImageElement): boolean {
  if (node.naturalWidth < 1 || node.naturalHeight < 1) {
    return false;
  }

  const canvas = document.createElement("canvas");
  const width = Math.min(node.naturalWidth, 48);
  const height = Math.min(node.naturalHeight, 48);
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    return false;
  }

  try {
    context.drawImage(node, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);

    for (let index = 3; index < data.length; index += 4) {
      if (data[index] > 0) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

const SIZES = {
  sm: {
    box: "size-5 rounded-sm text-[11px] font-semibold",
    placeholder: "bg-idle",
    pixels: 20,
  },
  md: {
    box: "size-7 rounded-lg text-xs font-light",
    placeholder: "bg-plate",
    pixels: 28,
  },
  lg: {
    box: "size-16 rounded-2xl text-2xl font-light",
    placeholder: "bg-plate",
    pixels: 64,
  },
} as const;

export function SiteMark({
  name,
  src,
  size = "sm",
}: {
  name: string;
  src: string;
  size?: keyof typeof SIZES;
}) {
  const image = useRef<HTMLImageElement>(null);
  const [shown, setShown] = useState<string | null>(null);
  const variant = SIZES[size];
  const letter = name.trim().charAt(0).toLocaleUpperCase("ru") || "•";
  const ready = shown === src;

  useEffect(() => {
    const node = image.current;

    if (node?.complete && paintsPixels(node)) {
      setShown(src);
    }
  }, [src]);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden text-ink",
        variant.box,
        !ready && variant.placeholder,
      )}
    >
      <span aria-hidden className={ready ? "invisible" : undefined}>
        {letter}
      </span>
      {/* буква остаётся, пока файл значка не загрузился; img нужен для onLoad/onError */}
      <img
        ref={image}
        src={src}
        alt=""
        width={variant.pixels}
        height={variant.pixels}
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full object-contain",
          ready ? "opacity-100" : "opacity-0",
        )}
        onLoad={(event) => {
          setShown(paintsPixels(event.currentTarget) ? src : null);
        }}
        onError={() => setShown(null)}
      />
    </span>
  );
}
