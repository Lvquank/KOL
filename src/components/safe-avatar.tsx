"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

type SafeAvatarProps = {
  src: string | null;
  alt: string;
  className: string;
  fallbackClassName: string;
};

export function SafeAvatar({ src, alt, className, fallbackClassName }: SafeAvatarProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canShowImage = Boolean(src && failedSource !== src);

  useEffect(() => {
    const image = imageRef.current;
    if (!src || !image?.complete || image.naturalWidth > 0) return;
    const frame = window.requestAnimationFrame(() => setFailedSource(src));
    return () => window.cancelAnimationFrame(frame);
  }, [src]);

  if (!canShowImage) {
    return (
      <span className={fallbackClassName} role="img" aria-label={alt}>
        {alt.trim().slice(0, 1).toUpperCase() || "?"}
      </span>
    );
  }

  return (
    <img
      ref={imageRef}
      alt={alt}
      src={src || ""}
      className={className}
      onError={() => src && setFailedSource(src)}
    />
  );
}
