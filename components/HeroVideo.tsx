'use client';

import { useRef, useEffect } from 'react';

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Forcer muted via la propriété DOM (contourne le bug React/iOS)
    v.muted = true;
    v.load();
    const play = () => v.play().catch(() => {});
    play();
    // Relance au premier touch si iOS a bloqué
    document.addEventListener('touchstart', play, { once: true });
    return () => document.removeEventListener('touchstart', play);
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      loop
      playsInline
      autoPlay
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}
