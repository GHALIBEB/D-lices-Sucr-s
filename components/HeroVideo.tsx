'use client';

import { useEffect, useRef } from 'react';

export default function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      // Si le navigateur bloque, on réessaie au premier touch
      const resume = () => { v.play(); document.removeEventListener('touchstart', resume); };
      document.addEventListener('touchstart', resume, { once: true });
    });
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      preload="auto"
      className="absolute inset-0 w-full h-full"
      style={{
        objectFit: 'cover',
        objectPosition: 'center 20%',
      }}
    />
  );
}
